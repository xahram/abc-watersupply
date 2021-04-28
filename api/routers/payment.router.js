const express = require("express");
const {
  createPayment,
  getPayments,
  getSinglePaymentRecord,
  updatePaymentRecord
} = require("../controllers/payment.controller");
const {
  accessGranter,
  grantUserAccessToRole,
} = require("../middlewares/authenticate-request.middleware");
const paymentRouter = express.Router();

// Route for Creating Payment against a Customer
paymentRouter.post(
  "/createPayment",
  accessGranter,
  grantUserAccessToRole,
  createPayment
);

// Route for getting Payment Record of a Single Customer
paymentRouter.post(
  "/getPayments",
  accessGranter,
  grantUserAccessToRole,
  getPayments
);

// Route for getting A single payment record with payment ID
paymentRouter.post(
  "/getSinglePaymentRecord",
  accessGranter,
  grantUserAccessToRole,
  getSinglePaymentRecord
);

paymentRouter.patch(
  "/updatePaymentRecord",
  accessGranter,
  grantUserAccessToRole,
  updatePaymentRecord
);
module.exports = paymentRouter;
