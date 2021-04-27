const express = require("express");
const {
  createPayment,
  getPayments,
  getLatestPaymentRecord,
} = require("../controllers/payment.controller");
const paymentRouter = express.Router();

paymentRouter.post("/createPayment", createPayment);
paymentRouter.post("/getPayments", getPayments);
paymentRouter.post("/getSinglePaymentRecord", getLatestPaymentRecord);

module.exports = paymentRouter;
