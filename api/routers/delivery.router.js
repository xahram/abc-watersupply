const express = require("express");
const { createDelivery,getDeliveries,getLatestDeliveryRecord } = require("../controllers/delivery.controller");
const deliveryRouter = express.Router();

deliveryRouter.post("/createDelivery", createDelivery);
deliveryRouter.post("/getDeliveries", getDeliveries);
deliveryRouter.get("/getLatestDeliveryRecord/:deliveryId", getLatestDeliveryRecord);

module.exports = deliveryRouter;
