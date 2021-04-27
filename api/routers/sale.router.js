const express = require("express");
const {
  createSale,
  getLatestSale,
  getSales
} = require("../controllers/sale.controller");
const saleRouter = express.Router();

saleRouter.post("/createSale", createSale);
saleRouter.post("/getSales", getSales);
saleRouter.get("/getLatestSale/:saleId", getLatestSale);

module.exports = saleRouter;
