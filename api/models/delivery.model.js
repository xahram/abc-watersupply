const mongoose = require("mongoose");
const bottleTypeValidator = require("../dependencies/helpers/customDbValidaiton.helpers/delivery.validator");

const deliverySchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  bottleSize: {
    type: mongoose.Schema.Types.String,
    required: true,
    validate: bottleTypeValidator,
  },
  deliveryTime: { type: mongoose.Schema.Types.Date, required: true },
});

module.exports = mongoose.model("Delivery", deliverySchema);
