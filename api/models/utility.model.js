const mongoose = require("mongoose");

const subscriptionSchema = mongoose.Schema({
  name: { type: String, required: true },
  days: { type: Number, required: true },
  price: { type: Number, required: true },
});


const utilitySchema = mongoose.Schema({
  roles: [{ type: String }],
  ratelist: [
    {
      size: { type: String, required: true },
      price: { type: Number, required: true },
    },
  ],
  subscriptions: [subscriptionSchema],
});

module.exports = mongoose.model("Utility", utilitySchema);
