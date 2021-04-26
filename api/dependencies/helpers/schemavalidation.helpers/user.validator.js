const Utility = require("../../../models/utility.model");

module.exports = async (v, type) => {
  try {
    const [utility] = await Utility.find();
    if (!utility) return false;
    if (utility.roles.includes(v)) return true;
    return false;
  } catch (error) {
    return false;
  }
};
