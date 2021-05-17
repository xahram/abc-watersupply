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
const {
  userLoginSchemaValidator,
  userSignUpSchemaValidator,
  updateUserSchemaValidator,
  searchUserValidationSchema,
} = require("../dependencies/helpers/validation.schema/user.validation");
const customRolesValidatorSchema = require("../dependencies/helpers/customDbValidaiton.helpers/user.validator");
const scheduledPayment = require("../dependencies/internal-services/subscription-payments/subscriptionPayments.schedule");

// SIGNUP CONTROLLER FOR ALL USERS
const signup = async (req, res, next) => {
  try {
    // Validate The incoming Requests Fields
    const {
      email,
      name,
      age,
      role,
      password,
      subscriptionId,
    } = await userSignUpSchemaValidator.validateAsync(req.body);

    // Check If Email Already Exists
    const verifyEmailExists = await User.findOne({ email });
    if (verifyEmailExists)
      return res.status(CONFLICT).send({ message: "Email Already In Use" });

    // Check if USER ROLE is 'CUSTOMER' AND it has missing Subscription ID
    if (
      (role === "CUSTOMER" && !subscriptionId) ||
      (["CUSTOMER", "DELIVERY_BOY"].includes(role) && password)
    )
      return res.status(BAD_REQUEST).send({
        message:
          "Customer Should not have a Password and Must contain Subscription",
      });

    let user;

    // Check if the password field exists or not in case of Customers or Delivery Boys

    if (password) {
      // Generate Hash Password
      const hashPassword = await generatePassword(password, 10);
      user = new User({ email, name, age, role, password: hashPassword });
      await user.save();
    } else {
      user = new User({ email, name, age, role, subscription: subscriptionId });
      await user.save();

      //START CHARGING PAYMENTS BASED ON SUBSCRIPTION DATA
      await scheduledPayment(subscriptionId, user._id);
    }

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

// LOGIN CONTROLLER
const login = async (req, res, next) => {
  try {
    const { email, password } = await userLoginSchemaValidator.validateAsync(
      req.body
    );

    // Check if the email provided exists or not
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(NOT_FOUND)
        .send({ message: "User Not Found... Please Try Again" });

    const isMatched = await verifyPasswordHash(password, user.password);

    // if the password provided in the request doesn't match
    if (!isMatched)
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
      role: user.role,
      token,
    });
  } catch (error) {
    res.status(BAD_REQUEST).send({ message: error.message });
  }
};

// SEARCH USER BASED ON USERID CONTROLLER
const searchUser = async (req, res, next) => {
  try {
    const { id } = await searchUserValidationSchema.validateAsync(req.params);
    // Search for user with the given Id and exclude password and v
    const user = await await User.findById(id, { password: 0, __v: 0 });

    if (!user)
      return res
        .status(NOT_FOUND)
        .send({ message: `ERROR: User with the following Id doesn't exists` });

    return res.status(SUCCESS).send({ user });
  } catch (error) {
    next(error);
  }
};

// CONTROLLER FOR GETTING ALL USERS
const getAllUsers = async (req, res, next) => {
  try {
    // const users = await User.find()
    //   .select("-__v -password");
    const users = await User.aggregate([
      { $match: { _id: { $exists: 1 } } },
      {
        $lookup: {
          from: "utilities",
          let: { subscription_id: "$subscription" },
          pipeline: [
            { $unwind: "$subscriptions" },
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: ["$subscriptions._id", "$$subscription_id"] },
                    // { $not: { $exists: "$$subscription_id" } },
                    // { "$subscription._id"},
                  ],
                },
              },
            },
            { $replaceRoot: { newRoot: "$subscriptions" } },
          ],
          as: "subscription",
        },
      },
      { $unwind: "$subscription" },
      {
        $project: {
          subscription: 1,
          _id: 1,
          name: 1,
          age: 1,
          role: 1,
          email: 1,
        },
      },
    ]);

    // { $unwind: "$subscriptions" },
    // {
    //   $match: {
    //     $expr: { $eq: ["$$subscription_id", "$subscriptions._id"] },
    //   },
    // },
    // { $group: { _id: "$subscriptions._id" } },

    // {
    //   $lookup: {
    //     from: "users",
    //     localField: "subscriptions",
    //     foreignField: "subscription",
    //     as: "sub",
    //   },
    // },
    //Check if the Array of Users is empty
    if (!users.length)
      return res.status(NOT_FOUND).send({ message: "No User Exists" });

    res.status(SUCCESS).send({ users });
  } catch (error) {
    res.status(NOT_FOUND).send({ errorMessage: error.message });
  }
};

// UPDATE USER INFORMATION CONTROLLER
const updateUserData = async (req, res, next) => {
  try {
    const values = await updateUserSchemaValidator.validateAsync(req.body);

    //Check if role is provided in request body
    if (values.role) {
      // Check if the provided Role exists in our Database RETURNS BOOLEAN VALUE
      const verifiedRole = await customRolesValidatorSchema(values.role);
      //In case the role provided doesn't exists in our db
      if (!verifiedRole)
        return res
          .status(NOT_FOUND)
          .send({ message: "ERROR: Role Not in our database" });
    }

    let password = values.password;
    let user = { ...values };

    // Generate Hash if the password field is provided in request in case of SUPER_ADMIN | ADMIN
    if (values.password) {
      password = await generatePassword(values.password, 10);
      user = { ...values, password };
    }

    // Find and update user and get this updated user
    const updatedUser = await User.findOneAndUpdate(
      { _id: values.userId },
      { $set: user },
      { new: true }
    );
    return res
      .status(SUCCESS)
      .send({ user: updatedUser, message: "Successfully Updated" });
  } catch (error) {
    return res
      .status(NOT_FOUND)
      .send({ message: `ERROR: ${error.message}...`, error });
  }
};

// EXPORT ALL CONTROLLERS
module.exports = {
  signup,
  searchUser,
  login,
  getAllUsers,
  updateUserData,
};
