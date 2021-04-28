const mongoose = require("mongoose");

const utilitySchema = mongoose.Schema({
  roles: [{ type: String }],
  ratelist: [
    {
      size: { type: String, required: true },
      price: { type: Number, required: true },
    }
  ],
  subscriptions: [
    {
      name: { type: String, required: true },
      days: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
});

module.exports = mongoose.model("Utility", utilitySchema);
