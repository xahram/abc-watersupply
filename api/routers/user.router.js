const express = require("express");
const { signup,searchUser , login} = require("../controllers/user.controller");
const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.get("/search/:id",searchUser);

module.exports = userRouter;
