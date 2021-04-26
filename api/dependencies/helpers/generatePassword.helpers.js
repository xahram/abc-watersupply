const bcrypt = require("bcrypt");

const generatePassword = async (password,salt) => {
  try {
    const hashedPassword = await bcrypt.hash(
      password,
      salt
    );
    return Promise.resolve(hashedPassword);
  } catch (error) {
    return Promise.reject(error);
  }
};

module.exports = { generatePassword };
