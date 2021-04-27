const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");

const {
  NOT_FOUND,
} = require("../api/dependencies/config").RESPONSE_STATUS_CODES;

// Mounting modules for database Connection
require("dotenv").config();
require("../api/dependencies/db/db.connection");

// Importing Routes
const userRouter = require("../api/routers/user.router");
const utilityRouter = require("../api/routers/utility.router");
const paymentRouter = require("../api/routers/payment.router");
const deliveryRouter = require("../api/routers/delivery.router");
const saleRouter = require("../api/routers/sale.router");


const app = express();

// Third Party Middlewares
// parse application/x-www-form-urlencoded // parse application/json
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));

// Routes For handling incoming User requests
app.use("/auth", userRouter);
app.use("/admin", utilityRouter);
app.use("/payments",paymentRouter);
app.use("/deliveries",deliveryRouter);
app.use("/sales",saleRouter);


// Error Handlers
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = NOT_FOUND;

  next(error);
});

app.use((error, req, res, next) => {
  res.status(NOT_FOUND || SERVER_ERROR).send({ message: error.message });
});


module.exports = app