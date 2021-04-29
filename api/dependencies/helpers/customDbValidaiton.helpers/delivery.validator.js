const Utility = require("../../../models/utility.model");



// CUSTOM VALIDATOR FOR OUR UTILITY COLLECTION DATA BASE SCHEMA
module.exports = async (v, type) => {
  try {
    const [utility] = await Utility.find();
    if (!utility) return false;
    if (
      utility.ratelist.findIndex((el) => {
        return el.size === v;
      }) !== -1
      ) return true;
    return false;
  } catch (error) {
    return false;
  }
};
