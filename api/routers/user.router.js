const express = require("express");
const {
  signup,
  searchUser,
  login,
  getAllUsers,
  updateUserData,
} = require("../controllers/user.controller");
const {
  accessGranter,
  grantUserAccessToRole,
} = require("../middlewares/authenticate-request.middleware");
const userRouter = express.Router();

// Creating New User
userRouter.post("/signup", accessGranter, grantUserAccessToRole, signup);

// Allow logging In user so Admin can Regenerate Token When It Expires
userRouter.post("/login", login);

// Allowing Admin to search users by their Id
userRouter.get("/search/:id", accessGranter, grantUserAccessToRole, searchUser);

//Getting ALl users
userRouter.get("/allUsers", accessGranter, grantUserAccessToRole, getAllUsers);

//For Updating Or Patching User data
userRouter.patch("/updateUser", accessGranter, grantUserAccessToRole, updateUserData);

module.exports = userRouter;
