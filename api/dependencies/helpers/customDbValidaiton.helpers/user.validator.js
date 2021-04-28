const Utility = require("../../../models/utility.model");

module.exports = async (v, type) => {
  try {
    const [utility] = await Utility.find();
    if (!utility) throw new Error("Role Not In our DB");
    if (utility.roles.includes(v)) return Promise.resolve(true);
    throw new Error("Role Not In our DB");
  } catch (error) {
      throw new Error(error.message);
  }
};
