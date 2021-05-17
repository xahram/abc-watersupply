const express = require("express");
const {
  accessGranter,
  grantUserAccessToRole,
} = require("../middlewares/authenticate-request.middleware");
const {
  createSale,
  getSingleSaleRecord,
  getSales,
  updateSaleRecord,
  calculateTotalSale,
} = require("../controllers/sale.controller");
const saleRouter = express.Router();

// This Router is used For Recording Sales Data for Random Customers
// that aren't subscribed to our Water Supply Company

// Route for creating  Sales Record
saleRouter.post(
  "/createSale",
  accessGranter,
  grantUserAccessToRole,
  createSale
);

//Route For getting all the sales that have happened So far
saleRouter.get("/getSales", accessGranter, grantUserAccessToRole, getSales);

//Route for getting A single sale by record
saleRouter.get(
  "/getSingleSaleRecord/:saleId",
  accessGranter,
  grantUserAccessToRole,
  getSingleSaleRecord
);

//Route for getting A Total sales 

saleRouter.patch(
  "/updateSaleRecord/",
  accessGranter,
  grantUserAccessToRole,
  updateSaleRecord
);

saleRouter.get(
  "/totalSales",
  accessGranter,
  grantUserAccessToRole,
  calculateTotalSale
);


module.exports = saleRouter;
