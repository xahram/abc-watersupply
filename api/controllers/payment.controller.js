const Payment = require("../models/payment.model");
const User = require("../models/user.model");
const moment = require("moment");
const {
  createPaymentSchemaValidator,
  getPaymentRecordOfUserSchemaValidator,
  singlePaymentRecordValidatorSchema,
  updatePaymentRecordSchemaValidator,
  calculateTotalPaymentForUserSchemaValidator,
} = require("../dependencies/helpers/validation.schema/payment.validation");
const {
  CREATED,
  BAD_REQUEST,
  SUCCESS,
  CONFLICT,
  NOT_FOUND,
} = require("../dependencies/config").RESPONSE_STATUS_CODES;
const mongoose = require("mongoose");

// CONTROLLER FOR CREATING NEW PAYMENT RECORD
const createPayment = async (req, res, next) => {
  const { userId, paid, dueAmount } = req.body;
  const paymentTime = moment().format();

  try {
    // VALIDATE INCOMING REQUEST DATA TO VERFIFY USERID, PAID , DUEAMOUNT
    const values = await createPaymentSchemaValidator.validateAsync({
      userId,
      paid,
      dueAmount,
    });

    // Check If user with that Id Exists Or not
    const user = await User.findOne({ _id: userId });
    if (!user)
      return res
        .status(NOT_FOUND)
        .send({ message: "Can't Charge Payment, User doesn't exist..." });

    // Find the Latest Previous Payment Of the user to
    // calculate Total Amount paid So far
    // const previousPayment = await Payment.findOne(
    //   { userId },
    //   {},
    //   { sort: { paymentTime: -1 } }
    // );

    // Check If the previous Payment Rcord exists to calculate total Payment
    // let totalPayment = previousPayment ? previousPayment.totalAmountPaid : 0;
    // let totalPaymentDue = previousPayment ? previousPayment.totalAmountDue : 0;

    const payment = new Payment({
      ...values,
      // totalAmount: totalPayment + (paid - dueAmount),
      // totalAmountPaid: totalPayment + paid,
      // totalAmountDue: totalPaymentDue + dueAmount,
      paymentTime,
    });

    await payment.save();
    res
      .status(CREATED)
      .send({ payment, message: "Payment Successfully Created..." });
  } catch (error) {
    return res.status(BAD_REQUEST).send({ error: error.message });
  }
};

// CONTROLLER TO GET ALL THE PAYMENTS OF A GIVEN USER
const getPayments = async (req, res, next) => {
  try {
    const {
      userId,
    } = await getPaymentRecordOfUserSchemaValidator.validateAsync(req.body);
    const payments = await Payment.find(
      { userId },
      { __v: 0 },
      { sort: { paymentTime: -1 } }
    );
    if (!payments.length)
      return res
        .status(NOT_FOUND)
        .send({ message: "No Payment Record for this User Exists..." });
    res.status(SUCCESS).send({ payments });
  } catch (error) {
    res.status(NOT_FOUND).send({ message: error.message });
  }
};

// GETTING SINGLE PAYMENT RECORD BASED ON PAYMENT ID
const getSinglePaymentRecord = async (req, res, next) => {
  try {
    const {
      paymentId,
    } = await singlePaymentRecordValidatorSchema.validateAsync(req.body);

    const payment = await Payment.findOne({ _id: paymentId }, { __v: 0 });
    if (!payment)
      return res
        .status(NOT_FOUND)
        .send({ message: "No Such Payment Record Exists..." });
    res.status(SUCCESS).send({ payment });
  } catch (error) {
    res.status(NOT_FOUND).send({ message: error.message });
  }
};

// CONTROLLER FOR UPDATING A PAYMENT RECORD BASED ON PAYMENTID
const updatePaymentRecord = async (req, res, next) => {
  try {
    const values = await updatePaymentRecordSchemaValidator.validateAsync(
      req.body
    );
    values.paymentTime = moment().format();

    const updatedPayment = await Payment.findOneAndUpdate(
      { _id: values.paymentId },
      { $set: values },
      { new: true }
    );

    return res
      .status(SUCCESS)
      .send({ payment: updatedPayment, message: "Successfully Updated" });
  } catch (error) {
    return res
      .status(NOT_FOUND)
      .send({ message: `ERROR: ${error.message}`, error });
  }
};

// CONTROLLER TO CALCULATE THE TOTAL PAYMENT PRICE OF USER BASED ON ITS ID
const calculateTotalPaymentForUser = async (req, res, next) => {
  try {
    // Validate THe incoming request Schema FOr valid User Id
    const {
      userId,
    } = await calculateTotalPaymentForUserSchemaValidator.validateAsync(
      req.params
    );

    const totalPayments = await Payment.aggregate([
      // Stage 1 :  Match the user based on incoming userId in the Payment Collection
      { $match: { userId: mongoose.Types.ObjectId(userId) } },

      // Stage 2 : Group the user based on userId field PRESENT in the matched Documents
      // here _id field is important because left hand side in the group stage must be accumulator
      {
        $group: {
          _id: "$userId",
          totalAmountPaid: { $sum: "$paid" },
          totalDueAmount: { $sum: "$dueAmount" },
        },
      },

      // Stage 3 : From the previous stage Only get the fields marked with 1
      // and calculate the amount remaining based on the difference
      {
        $project: {
          _id: 1,
          totalAmountPaid: 1,
          totalDueAmount: 1,
          remainingAmount: {
            $subtract: ["$totalAmountPaid", "$totalDueAmount"],
          },
        },
      },

      // Stage 4 : Look for the USERS Collection from our Payment COllection
      // Check _id Field we are getting from the previous stage and look for
      // a match for FOreignField in the USERS collection (_id Of USERS Collection).
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
    ]);

    if (!totalPayments.length)
      return res.status(NOT_FOUND).send({
        message: `ERROR : No Payment Record for the given user found...`,
      });

    res.status(SUCCESS).send({ totalPayments: totalPayments });
  } catch (error) {
    res.status(NOT_FOUND).send({ error: `ERROR : ${error.message}` });
  }
};

const getAllPaymentsRecord = async (req, res, next) => {
  try {
    const payments = await Payment.aggregate([
      { $match: { _id: { $exists: 1 } } },
      {
        $project: {
          user: 1,
          dueAmount: 1,
          paid: 1,
          _id: 1,
          userId:1,
          paymentTime: {
            $dateToString: {
              date: "$paymentTime",
              format: "%Y-%m-%d %H:%M:%S",
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },

      {
        $unwind: "$user"
      }

    ]);
    if (!payments.length)
      return res
        .status(NOT_FOUND)
        .send({ message: "No Payment Record Exists..." });
    res.status(SUCCESS).send({ payments });
  } catch (error) {
    res.status(NOT_FOUND).send({ message: error.message });
  }
};

// EXPORT ALL CONTROLLERS
module.exports = {
  createPayment,
  getPayments,
  getSinglePaymentRecord,
  updatePaymentRecord,
  calculateTotalPaymentForUser,
  getAllPaymentsRecord,
};
