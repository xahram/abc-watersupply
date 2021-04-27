const Utility = require("../models/utility.model");

module.exports = {
  getUserRolesFromDatabase: async ()=> {
    const [utility] = await Utility.find();
    if (!utility)
      return Promise.reject(
        "No Utility Entry Exists, First Create Utility To Proceed Further"
      );
      // Return the Roles from the database back to the caller
      return Promise.resolve(utility.roles)
  },

  getBottleSizesFromDatabase: async () => {
    const [utility] = await Utility.find();
    if (!utility)
      return Promise.reject(
        "No Utility Entry Exists, First Create Utility To Proceed Further"
      );
    //Convert Ratelist which contains Object of Waterbottle
    // to an array of bottle type ["100ml","200ml"] to check
    // for incoming bottle existence in the array.
    const bottleTypes = utility.ratelist.map((el) => {
      return el.size;
    });
    return Promise.resolve(bottleTypes);
  },
  RESPONSE_STATUS_CODES: {
    SUCCESS: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    SERVER_ERROR: 500,
  },
};
