const Sale = require("../models/sales.model");
const moment = require("moment");
const {
  createSaleSchemaValidator,
  getSingleSaleRecordSchemaValidator,
  updateSaleRecordSchemaValidator
} = require("../dependencies/helpers/validation.schema/sale.validation");
const {
  CREATED,
  BAD_REQUEST,
  SUCCESS,
  CONFLICT,
  NOT_FOUND,
} = require("../dependencies/config").RESPONSE_STATUS_CODES;


// CREATE SALE RECORD CONTROLLER
const createSale = async (req, res, next) => {

  try {
    //  VALIDATE THE INCOMING REQUEST
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
      paymentTime
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
    const sales = await Sale.find(
      {},
      { __v: 0 },
      { sort: { paymentTime: -1 } }
    );

    // IN CASE SALS ARRAY IS EMPTY
    if (!sales.length)
      return res
        .status(NOT_FOUND)
        .send({ message: "No Sales Record for this User Exists..." });

    res.status(SUCCESS).send({ sales });
  } catch (error) {
    res.status(NOT_FOUND).send({ message: error.message });
  }
};


// GETTING SINGLE SALE RECORD BASED ON SALEID
const getSingleSaleRecord = async (req, res, next) => {
  try {
    //VALIDATING INCOMING REQUEST
    const { saleId } = await getSingleSaleRecordSchemaValidator.validateAsync(req.params);
    
    //CHECK IF THE SALE RECORD EXISTS
    const sale = await Sale.findOne({ _id: saleId }, { __v: 0 });
    if (!sale)
      return res
        .status(NOT_FOUND)
        .send({ message: "No Such Sale Record Exists..." });

    res.status(SUCCESS).send({ sale });
  } catch (error) {
    res.status(NOT_FOUND).send({ message: error.message });
  }
};


// UPDATE ANY INDIVIDUAL SALES RECORD
const updateSaleRecord = async (req, res, next) => {
  try {

    // VALIDATE INCOMING REQUEST FOR VALUES
    const values = await updateSaleRecordSchemaValidator.validateAsync(req.body)
    values.paymentTime = moment().format();
    
    // USE FINDONEANDUPDATE INSTEAD OF UPDATEONE TO GET THE LATEST RECORD
    const updatedSale = await Sale.findOneAndUpdate(
      { _id: values.saleId },
      { $set: values },
      { new: true }
    );

    return res.status(SUCCESS).send({sale: updatedSale, message: "Successfully Updated"})

  } catch (error) {
    return res.status(NOT_FOUND).send({ message: `ERROR: ${error.message}`, error });
  }
};



//EXPORT ALL CONTROLLERS
module.exports = {
  createSale,
  getSingleSaleRecord,
  getSales,
  updateSaleRecord
};
