const User = require("../models/user.model");
const {
  CREATED,
  BAD_REQUEST,
} = require("../dependencies/config").RESPONSE_STATUS_CODES;
const userController = async (req, res, next) => {
  const { name, age, role } = req.body;
  const user = new User({ name, age, role });
  try {
    await user.save();
    res.status(CREATED).send({});
  } catch (error) {
    res.status(BAD_REQUEST).send({ message: error.message });
  }
};

module.exports = {
  userController,
};
