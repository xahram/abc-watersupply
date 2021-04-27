const express = require("express");
const {
  accessGranter,
  grantUserAccessToRole,
} = require("../middlewares/authenticate-request.middleware");
const {
  createDelivery,
  getDeliveries,
  getDeliveryRecordById,
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

module.exports = deliveryRouter;
