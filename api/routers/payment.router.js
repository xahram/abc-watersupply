const express = require("express");
const {
  createPayment,
  getPayments,
  getSinglePaymentRecord,
} = require("../controllers/payment.controller");
const paymentRouter = express.Router();

paymentRouter.post("/createPayment", createPayment);
paymentRouter.post("/getPayments", getPayments);
paymentRouter.post("/getSinglePaymentRecord", getSinglePaymentRecord);

module.exports = paymentRouter;
