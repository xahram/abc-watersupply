const User = require("../models/user.model");
const {
  generateAccessToken,
  verifyPasswordHash,
} = require("../dependencies/helpers/auth.helpers");
const {
  generatePassword,
} = require("../dependencies/helpers/generatePassword.helpers");
const {
  CREATED,
  BAD_REQUEST,
  SUCCESS,
  NOT_FOUND,
  CONFLICT,
} = require("../dependencies/config").RESPONSE_STATUS_CODES;

const signup = async (req, res, next) => {
  const { email, name, age, role, password } = req.body;
  try {
    // Check If Email Already Exists
    const verifyEmailExists = await User.findOne({ email });
    if (verifyEmailExists)
      return res.status(CONFLICT).send({ message: "Email Already In User" });

    // Generate Hash Password
    const hashPassword = await generatePassword(password, 10);
    const user = new User({ email, name, age, role, password: hashPassword });
    await user.save();
    const token = await generateAccessToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });
    res.status(CREATED).send({ user, token });
  } catch (error) {
    res.status(BAD_REQUEST).send({ message: error.message });
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(NOT_FOUND)
        .send({ messsage: "User Not Found... Please Try Again" });

    const result = await verifyPasswordHash(password, user.password);
    if (!result)
      return res
        .status(NOT_FOUND)
        .send({ message: "Email or/and Password Incorrect" });

    const token = await generateAccessToken({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    res.status(SUCCESS).send({
      _id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      token,
    });
  } catch (error) {
    res.status(BAD_REQUEST).send({ message: error.message });
  }
};

const searchUser = async (req, res, next) => {
  try {
    const user = await (
      await User.findById(req.params.id, { password: 0, __v: 0 })
    ).populate("role");
    return res.status(200).send({ user });
  } catch (error) {
    next(error);
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-__v -password");
    if (!users.length)  return res.status(NOT_FOUND).send({ message: "No User Exists" });
    res.status(SUCCESS).send({ users });
  } catch (error) {
    res.status(NOT_FOUND).send({ errorMessage: error.message });
  }
};
module.exports = {
  signup,
  searchUser,
  login,
  getAllUsers
};
