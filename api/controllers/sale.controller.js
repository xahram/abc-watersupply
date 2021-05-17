const Sale = require("../models/sales.model");
const moment = require("moment");
const {
  createSaleSchemaValidator,
  getSingleSaleRecordSchemaValidator,
  updateSaleRecordSchemaValidator,
} = require("../dependencies/helpers/validation.schema/sale.validation");
const {
  CREATED,
  BAD_REQUEST,
  SUCCESS,
  SERVER_ERROR,
  CONFLICT,
  NOT_FOUND,
} = require("../dependencies/config").RESPONSE_STATUS_CODES;

// CREATE SALE RECORD CONTROLLER
const createSale = async (req, res, next) => {
  try {
    // Validate the incoming request
    const { paid } = await createSaleSchemaValidator.validateAsync(req.body);
    const paymentTime = moment().format();

    // Find the Latest Previous PaymentTime Of the user to
    // calculate Total Amount paid So far
    // const previousSale = await Sale.findOne(
    //   {},
    //   {},
    //   { sort: { paymentTime: -1 } }
    // );

    // Check If the previous Sale Record exists to calculate total Sale
    // let totalSale = previousSale ? previousSale.totalAmount + paid : paid;

    const sale = new Sale({
      paid,
      // totalAmount: totalSale,
      paymentTime,
    });

    await sale.save();
    res.status(CREATED).send({ sale, message: "Sale Successfully Created..." });
  } catch (error) {
    return res.status(BAD_REQUEST).send({ error: error.message });
  }
};

// GET ALL SALES RECORD CONTROLLER
const getSales = async (req, res, next) => {
  try {
    const sales = await Sale.aggregate([
      { $match: { _id: { $exists: 1 } } },
      {
        $project: {
          dueAmount: 1,
          paid: 1,
          _id: 1,
          paymentTime: {
            $dateToString: {
              date: "$paymentTime",
              format: "%Y-%m-%d %H:%M:%S",
            },
          },
        },
      },
      { $sort: { paymentTime: -1 } },
    ]);


    // In case sales array is empty
    if (!sales.length)
      return res
        .status(NOT_FOUND)
        .send({ message: "No Sales Record for this User Exists..." });

    res.status(SUCCESS).send({ sales });
  } catch (error) {
    res.status(SERVER_ERROR).send({ message: error.message });
  }
};

// GETTING SINGLE SALE RECORD BASED ON SALEID
const getSingleSaleRecord = async (req, res, next) => {
  try {
    //Validate the incoming request
    const { saleId } = await getSingleSaleRecordSchemaValidator.validateAsync(
      req.params
    );

    //Check if the given sale record exists or not
    const sale = await Sale.findOne({ _id: saleId }, { __v: 0 });
    if (!sale)
      return res
        .status(NOT_FOUND)
        .send({ message: "No Such Sale Record Exists..." });

    res.status(SUCCESS).send({ sale });
  } catch (error) {
    res.status(SERVER_ERROR).send({ message: error.message });
  }
};

// UPDATE ANY INDIVIDUAL SALES RECORD
const updateSaleRecord = async (req, res, next) => {
  try {
    // Validate incoming request for values
    const values = await updateSaleRecordSchemaValidator.validateAsync(
      req.body
    );
    values.paymentTime = moment().format();

    // Use findoneandupdate isntead of updateone to get the latest record
    const updatedSale = await Sale.findOneAndUpdate(
      { _id: values.saleId },
      { $set: values },
      { new: true }
    );

    return res
      .status(SUCCESS)
      .send({ sale: updatedSale, message: "Successfully Updated" });
  } catch (error) {
    return res
      .status(NOT_FOUND)
      .send({ message: `ERROR: ${error.message}`, error });
  }
};

// CONTROLLER FOR CALCULATING TOTAL SALE PRICE
const calculateTotalSale = async (req, res, next) => {
  try {
    const sales = await Sale.find({});

    // Check if Sales Array is empty or not
    if (!sales.length)
      return res.status(NOT_FOUND).send({
        message: `No Sales Record Exists Yet. Create Sales Record First ANd Try again`,
      });

    // Calculate Total Sale
    const totalSales = sales.reduce((previousValue, currentValue) => {
      return previousValue + currentValue.paid;
    }, 0);

    return res.status(SUCCESS).send({ totalSales });
  } catch (error) {
    return res
      .status(SERVER_ERROR)
      .send({ message: `ERROR : ${error.message}` });
  }
};

//EXPORT ALL CONTROLLERS
module.exports = {
  createSale,
  getSingleSaleRecord,
  getSales,
  updateSaleRecord,
  calculateTotalSale,
};
