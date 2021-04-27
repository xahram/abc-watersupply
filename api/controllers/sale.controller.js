const Sale = require("../models/sales.model");
const moment = require("moment");

const {
  CREATED,
  BAD_REQUEST,
  SUCCESS,
  CONFLICT,
  NOT_FOUND,
} = require("../dependencies/config").RESPONSE_STATUS_CODES;

const createSale = async (req, res, next) => {
  const { paid } = req.body;
  const paymentTime = moment().format();

  try {
    // Find the Latest Previous PaymentTime Of the user to
    // calculate Total Amount paid So far
    const previousSale = await Sale.findOne(
      {},
      {},
      { sort: { paymentTime: -1 } }
    );

    // Check If the previous Sale Record exists to calculate total Sale
    let totalSale = previousSale ? previousSale.totalAmount + paid : paid;
    const sale = new Sale({
      paid,
      totalAmount: totalSale,
      paymentTime,
    });

    await sale.save();
    res.status(CREATED).send({ sale, message: "Sale Successfully Created..." });
  } catch (error) {
    return res.status(BAD_REQUEST).send({ error: error.message });
  }
};

const getSales = async (req, res, next) => {
  try {
    const sales = await Sale.find(
      {},
      { __v: 0 },
      { sort: { paymentTime: -1 } }
    );
    if (!sales.length)
      return res
        .status(NOT_FOUND)
        .send({ message: "No Sales Record for this User Exists..." });
    res.status(SUCCESS).send({ sales });
  } catch (error) {
    res.status(NOT_FOUND).send({ message: error.message });
  }
};

const getLatestSale = async (req, res, next) => {
  const { saleId } = req.params;
  try {
    const sale = await Sale.findOne(
      { _id: saleId },
      { __v: 0 },
      { sort: { paymentTime: -1 } }
    );
    if (!sale)
      return res
        .status(NOT_FOUND)
        .send({ message: "No Such Sale Record Exists..." });
    res.status(SUCCESS).send({ sale });
  } catch (error) {
    res.status(NOT_FOUND).send({ message: error.message });
  }
};

module.exports = {
  createSale,
  getLatestSale,
  getSales,
};
