const User = require("../models/user.model");
const {
  logInfo,
  logError,
} = require(`../dependencies/helpers/console.helpers`);
const jwt = require("jsonwebtoken");

const {
  UNAUTHORIZED,
  FORBIDDEN,
  SERVER_ERROR,
  BAD_REQUEST,
  NOT_FOUND
} = require(`../dependencies/config`).RESPONSE_STATUS_CODES;
const { getUserRolesFromDatabase } = require("../dependencies/config");

const accessGranter = async (req, res, next) => {
  try {
    const token = req.headers.authorization.replace("Bearer ", "");

    // logInfo("authneticate-request file: ", token);

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // logInfo("Authenticate Request line 23 Decoded token: ", decoded);

    // Check for validity of the user Role if it is available in roles Array of our DB
    // and If it matches with the user role in the db
    const allowedInputArrayOfRoles = await getUserRolesFromDatabase();
    const user = await User.findOne({ _id: decoded.id });
    if (!user)
      return res.status(NOT_FOUND).send({
        message: "Error: 'Please provide a valid user ID or Login Again...'",
      });

    if (!allowedInputArrayOfRoles.includes(decoded.role.toUpperCase()))
      return res.status(FORBIDDEN).send({
        message: `ERROR: Invalid value for 'User Role'`,
      });

    if (user.role !== decoded.role.toUpperCase())
      return res.status(UNAUTHORIZED).send({
        message: "ERROR:'User Role' is not valid to proceed further... ",
      });

    req.tokenData = decoded;
    req.user = user;

    next();
  } catch (error) {
    return res.status(SERVER_ERROR).send({ error, message: error.message });
  }
};

const grantUserAccessToRole = (req, res, next) => {
  const user = req.user;

  // logInfo("GRANTACCESSTOROLE : ", user);
  if (user.role === "SUPER_USER" || user.role === "ADMIN") {
    next();
  } else {
    
    return res
      .status(UNAUTHORIZED)
      .send({
        message: "Error: You're not allowed to Access this resource...",
      });
  }
};

module.exports = {
  accessGranter,
  grantUserAccessToRole,
};
