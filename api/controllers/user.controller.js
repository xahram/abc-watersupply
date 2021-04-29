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
} = require("../dependencies/helpers/validation.schema/user.validation");
const customRolesValidatorSchema = require("../dependencies/helpers/customDbValidaiton.helpers/user.validator");
const scheduledPayment = require("../dependencies/subscription-payments/subscriptionPayments.schedule");



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

    // CHECK IF USER ROLE IS 'CUSTOMER' AND IT has missing Subscription ID
    if (role === "CUSTOMER" && !subscriptionId && password)
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

      //START CHAARGING PAYMENTS BASED ON SUBSCRIPTION DATA
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

    // CHECK IF THE EMAIL PROVIDED EXISTS
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(NOT_FOUND)
        .send({ messsage: "User Not Found... Please Try Again" });

    const result = await verifyPasswordHash(password, user.password);
    
    // IF THE PASSWORD PROVIDED IN REQUEST DOESNT MATCH
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




// SEARCH USER BASED ON USERID CONTROLLER
const searchUser = async (req, res, next) => {
  try {
    // Search for user with the given Id and exclude password and v
    const user = await (
      await User.findById(req.params.id, { password: 0, __v: 0 })).populate("role");

    return res.status(200).send({ user });

  } catch (error) {
    next(error);
  }
};



// CONTROLLER FOR GETTING ALL USERS
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-__v -password");

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

    // Check if the provided Role exists in our Database RETURNS BOOLEAN VALUE
    const verifiedRole = await customRolesValidatorSchema(values.role);

    //IN CASE THE RETURN VALUE IS FALSE RETURN ERROR
    if (!verifiedRole)
      return res
        .status(NOT_FOUND)
        .send({ message: "ERROR: Role Not in our database" });

    let password = values.password;
    let user = { ...values };

    // GENERATE HASH IF THE PASSWORD FIELD IS PROVIDED IN REQUEST
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
