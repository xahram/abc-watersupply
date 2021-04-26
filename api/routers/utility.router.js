const express = require("express");
const { utilityController } = require("../controllers/utility.controller");
const utilityRouter = express.Router();
const Utility = require("../models/utility.model");

utilityRouter.post("/utility", utilityController);

utilityRouter.get("/utility",async (req,res,next)=>{
    try {
        const utility = await Utility.find();
        res.status(200).send(utility);
        
    } catch (error) {
        
    }
})
module.exports = utilityRouter;
