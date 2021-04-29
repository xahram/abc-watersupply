const Payment = require("../models/payment.model");
const User = require("../models/user.model");
const moment = require("moment");
const {
  createPaymentSchemaValidator,
  getPaymentRecordOfUserSchemaValidator,
  singlePaymentRecordValidatorSchema,
  updatePaymentRecordSchemaValidator,
} = require("../dependencies/helpers/validation.schema/payment.validation");
const {
  CREATED,
  BAD_REQUEST,
  SUCCESS,
  CONFLICT,
  NOT_FOUND,
} = require("../dependencies/config").RESPONSE_STATUS_CODES;

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

const calculateTotalPaymentForUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    // const values = await calculateTotalPaymentForUserSchemaValidator.validateAsync(req.body)
    const totalPayments = await Payment.aggregate([
      { $match: { _id: userId } },
      {
        $group: {
          user: "$userId",
          totalAmountPaid: { $sum: "$paid" },
          totalDueAmount: { $sum: "$dueAmount" },
        },
      },
      {
        $project: {
          remainingAmount: {
            $subtract: ["$totalAmountPaid", "$totalDueAmount"],
          },
        }
      }
      
    ]);
    res.status(SUCCESS).send({ totalPayments });
  } catch (error) {
    res.status(NOT_FOUND).send({ error: `ERROR : ${error.message}` });
  }
};

// EXPORT ALL CONTROLLERS
module.exports = {
  createPayment,
  getPayments,
  getSinglePaymentRecord,
  updatePaymentRecord,
  calculateTotalPaymentForUser,
};
