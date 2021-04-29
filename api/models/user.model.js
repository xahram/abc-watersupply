const mongoose = require("mongoose");
const roleValidator = require("../dependencies/helpers/customDbValidaiton.helpers/user.validator");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  password: {
    type: String
  },
  role: {
    type: mongoose.Schema.Types.String,
    validate: roleValidator,
  },
  subscription: {
    type: mongoose.Schema.Types.ObjectId,
    ref : "Utility"
  }
});

module.exports = mongoose.model("User", userSchema);
