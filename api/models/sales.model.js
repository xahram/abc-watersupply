const mongoose = require("mongoose");

const SaleSchema = mongoose.Schema({
  paid: { type: Number, required: true },
  // totalAmount: { type: Number, required: true, default: 0 },
  paymentTime: { type: mongoose.Schema.Types.Date, required: true },
});


module.exports = mongoose.model("Sale", SaleSchema);
