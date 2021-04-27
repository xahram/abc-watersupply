const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  paid: { type: Number, required: true },
  dueAmount: { type: Number, required: true },
  totalAmountPaid: { type: Number, required: true, default: 0 },
  totalAmountDue: { type: Number, required: true, default: 0 },
  paymentTime: { type: mongoose.Schema.Types.Date, required: true },
});

// paymentSchema.pre("save", async function (next){
//     const payment = this;
// })
module.exports = mongoose.model("Payment", paymentSchema);
