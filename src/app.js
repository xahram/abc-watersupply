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

const app = express();

// Third Party Middlewares
// parse application/x-www-form-urlencoded // parse application/json
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));

// Routes For handling incoming User requests
app.use("/signup", userRouter);

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