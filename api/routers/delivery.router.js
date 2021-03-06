const express = require("express");
const {
  accessGranter,
  grantUserAccessToRole,
} = require("../middlewares/authenticate-request.middleware");
const {
  createDelivery,
  getDeliveries,
  getDeliveryRecordById,
  updateDeliveryRecord,
  calculateDeliveryCostBasedOnUserId,
} = require("../controllers/delivery.controller");
const deliveryRouter = express.Router();

// Route For creating Delivery made to Customer
deliveryRouter.post(
  "/createDelivery",
  accessGranter,
  grantUserAccessToRole,
  createDelivery
);

// Route for getting list of all bottle deliveries made so far
// for Particular Customer
deliveryRouter.post(
  "/getDeliveries",
  accessGranter,
  grantUserAccessToRole,
  getDeliveries
);

// Route for getting a single delivery
deliveryRouter.get(
  "/getDeliveryRecordById/:deliveryId",
  accessGranter,
  grantUserAccessToRole,
  getDeliveryRecordById
);

deliveryRouter.patch(
  "/updateDeliveryRecord",
  accessGranter,
  grantUserAccessToRole,
  updateDeliveryRecord
);

deliveryRouter.get(
  "/calculateDeliveryCost/:userId",
  accessGranter,
  grantUserAccessToRole,
  calculateDeliveryCostBasedOnUserId
);

module.exports = deliveryRouter;
