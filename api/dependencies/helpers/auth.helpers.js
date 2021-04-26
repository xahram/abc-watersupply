const jwt = require(`jsonwebtoken`);
const bcrypt = require("bcrypt");

const {
  logSuccess,
  logInfo,
  logWarning,
  logError,
} = require(`../helpers/console.helpers`);

const generateAccessToken = async (inputTokenPayload) => {
  // fetching required data from token payload
  const { role } = inputTokenPayload;

  const tokenConfigParams = {
    expiresIn: process.env.JWT_EXPIRY_IN_SECONDS,
  };

  // customizing the token according to needs
  if (role && role.toUpperCase() === `SUPER_USER`) {
    delete tokenConfigParams.expiresIn;
  }

  return new Promise((resolve, reject) => {
    // generating the token
    jwt.sign(
      inputTokenPayload,
      process.env.JWT_SECRET_KEY,
      tokenConfigParams,
      (err, token) => {
        if (err) {
          logError(
            `ERROR @ generateAccessToken -> auth.helpers.js`,
            error.message
          );
          return reject(error);
          // return reject(err)
        }
        return resolve(token);
      }
    );
  });

  // returning the generated token to its caller
};

const verifyPasswordHash = async (inputPasswordString, inputHashedString) => {
  try {
    // comparing the password and input hash
    const result = await bcrypt.compare(inputPasswordString, inputHashedString);

    // returning the response to its caller
    return result;
  } catch (error) {
    logError("ERROR @ verifyPasswordHash -> auth.helpers.js", error.message);
    return Promise.reject(error);
  }
};

module.exports = {
  generateAccessToken,
  verifyPasswordHash,
};
