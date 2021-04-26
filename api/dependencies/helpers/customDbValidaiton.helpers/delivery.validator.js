const Utility = require("../../../models/utility.model");

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
