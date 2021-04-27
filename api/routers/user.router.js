const express = require("express");
const { signup,searchUser , login, getAllUsers} = require("../controllers/user.controller");
const {accessGranter,grantUserAccessToRole} = require("../middlewares/authenticate-request.middleware")
const userRouter = express.Router();

userRouter.post("/signup", accessGranter,grantUserAccessToRole,signup);
userRouter.post("/login", login);
userRouter.get("/search/:id",accessGranter,grantUserAccessToRole,searchUser);
userRouter.get("/allUsers",accessGranter,grantUserAccessToRole,getAllUsers);

module.exports = userRouter;
