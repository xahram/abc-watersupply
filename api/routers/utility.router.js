const express = require("express");
const {
  utilityController,
  getAllUtilities,
  updateRateList,
  updateSubscription
} = require("../controllers/utility.controller");
const {
  accessGranter,
  grantUserAccessToRole,
} = require("../middlewares/authenticate-request.middleware");
const utilityRouter = express.Router();

// Route to create our app related utilities dynamically
// so user can add features according to his needs

utilityRouter.post(
  "/utility",
  accessGranter,
  grantUserAccessToRole,
  utilityController
);

utilityRouter.patch(
  "/utility/updateRateList",
  accessGranter,
  grantUserAccessToRole,
  updateRateList
);

utilityRouter.patch(
  "/utility/updateSubscription",
  accessGranter,
  grantUserAccessToRole,
  updateSubscription
  
);

// For getting all of our utility -> [Users, WaterBottles,Subscriptions]
// that are used in our app
utilityRouter.get(
  "/utility",
  accessGranter,
  grantUserAccessToRole,
  getAllUtilities
);

module.exports = utilityRouter;
