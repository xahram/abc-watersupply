const mongoose = require("mongoose");
const Delivery = require("../models/delivery.model");
const User = require("../models/user.model");
const moment = require("moment");
const {
  checkBottleSizeInDb,
  getUserDeliveriesSchemaValidator,
  getDeliveryRecordByIdSchemaValidator,
  updateDeliveryRecordSchemaValidator,
  calculateDeliveryCostValidationSchema,
} = require("../dependencies/helpers/validation.schema/delivery.validation");
const {
  CREATED,
  BAD_REQUEST,
  SUCCESS,
  CONFLICT,
  NOT_FOUND,
} = require("../dependencies/config").RESPONSE_STATUS_CODES;



// CONTROLLER TO CREATE DELIVERY
const createDelivery = async (req, res, next) => {
  const { userId, bottleSize } = req.body;
  const deliveryTime = moment().format();

  try {
    // Check If Bottle Type Exists in our Database or Not
    const bottleTypeExists = await checkBottleSizeInDb(bottleSize);

    // True in case bottle is in our db False in casae of Non-existence
    if (!bottleTypeExists)
      return res
        .status(NOT_FOUND)
        .send({ message: "Please Send Valid Bottle Type" });

    // Check If user with that given Id Exists Or not
    const user = await User.findOne({ _id: userId });
    if (!user)
      return res
        .status(NOT_FOUND)
        .send({ message: "Can't Create Delivery, User doesn't exist..." });

    // create new Delivery for the given user 
    const delivery = new Delivery({
      userId: user._id,
      bottleSize,
      deliveryTime,
    });

    await delivery.save();
    res
      .status(CREATED)
      .send({ delivery, message: "Delivery Successfully Created..." });
  } catch (error) {
    return res.status(NOT_FOUND).send({ error: error.message });
  }
};



// CONTROLLER TO GET ALL DELIVERIES OF PARTICULAR USER
const getDeliveries = async (req, res, next) => {
  try {
    const { userId } = await getUserDeliveriesSchemaValidator.validateAsync(
      req.body
    );

    //  Get the deliveries and sort them based on their date
    const deliveries = await Delivery.find(
      { userId },
      { __v: 0 },
      { sort: { deliveryTime: -1 } }
    );

    // If there is no delivery of the user in our db
    if (!deliveries.length)
      return res
        .status(NOT_FOUND)
        .send({ message: "No Delivery Record for this User Exists..." });

    res.status(SUCCESS).send({ deliveries });
  } catch (error) {
    res.status(NOT_FOUND).send({ message: error.message });
  }
};



// CONTROLLER TO GET A PARTICULAR DELIVERY BASED ON DELVIERYID
const getDeliveryRecordById = async (req, res, next) => {
  try {
    // Validate the incoming request for the deliveryId
    const {
      deliveryId,
    } = await getDeliveryRecordByIdSchemaValidator.validateAsync(req.params);

    const delivery = await Delivery.findOne(
      { _id: deliveryId },
      { __v: 0 },
      { sort: { deliveryTime: -1 } }
    );

    // If the delivery with the record doesn't exists 
    if (!delivery)
      return res
        .status(NOT_FOUND)
        .send({ message: "No Such Delivery Record Exists..." });

    res.status(SUCCESS).send({ delivery });
  } catch (error) {
    res.status(NOT_FOUND).send({ message: error.message });
  }
};

// CONTROLLER TO UPDATE DELIVERY PARTICULAR RECORD BASED
const updateDeliveryRecord = async (req, res, next) => {
  try {
    // Validate if the request have required fields like deliveryId, bOttleSize
    const values = await updateDeliveryRecordSchemaValidator.validateAsync(
      req.body
    );

    //  Check if bottle size in request exists in our db
    const bottleSize = await checkBottleSizeInDb(values.bottleSize);

    // IF bottle size doesn't exist in our db
    if (!bottleSize)
      return res
        .status(NOT_FOUND)
        .send({ message: `Bottle Size Not Found in our Record` });

    // Use findoneandupdate to get the new updated field
    const updatedDelivery = await Delivery.findOneAndUpdate(
      { _id: values.deliveryId },
      { $set: values },
      { new: true }
    );

    return res
      .status(SUCCESS)
      .send({ delivery: updatedDelivery, message: "Successfully Updated" });
  } catch (error) {
    res.status(NOT_FOUND).send({ message: error.message });
  }
};





// CONTROLLER TO CALCULATE THE TOTAL PRICE OF DELIVERIES TO ONE USER BASED ON ID
const calculateDeliveryCostBasedOnUserId = async (req, res, next) => {
  try {
    // Validate THe incoming request Schema FOr valid User Id
    const {
      userId,
    } = await calculateDeliveryCostValidationSchema.validateAsync(req.params);

    const totalDeliveriesCost = await Delivery.aggregate([
      
      // Stage 1 :  Match the user based on incoming userId in the Delivery Collection
      { $match: { userId: mongoose.Types.ObjectId(userId) } },

      // Stage 2 : Look for the Bottle Size in the Utility Schema. The Bottle Sizes
      // in Utility Collection is in the form Ratelist : [{size:'1000ml',price:1},{size:"100ml",price:1}]
      
      {
        $lookup: {
          from: "utilities",

          // Stores the value of Stage 1 pipeline matched Object Property [BottleSize] into size variable
          let: { size: "$bottleSize" },

          // We need to use Pipeline for ForeignField becuase our Foreign Field is 
          // in the form Ratelist : [{size:'1000ml',price:1},{size:"100ml",price:1}]
          // pipeline will Change the context of '$' from "Delivery" -> "Utility" Collection

          pipeline: [
            // Match all Utility Objects that are in the range of Specified Bottles
            // This stage will match the WHOLE utility Object and embed as childInfo property Array
            // { $match: { $expr: { $in: ["$$size", "$ratelist.size"] } } },

            // Stage 2.1 : This Stage will break the Ratelist Array into Single Ratelist Objects, 
            // with multiple copies of Utility Obj each containing unique Ratelist Obj

            { $unwind: "$ratelist" },

            // Stage 2.2 : This stage will match ratelist object Size property with Our Placedholder size : Bottlesize
            // Result will be the matched Objects of one single type of bottles
            { $match: { $expr: { $eq: ["$ratelist.size", "$$size"] } } },

            
            // Stage 2.3 : This stage will remove all the properties like Subscription Roles and will 
            // push only Ratelist Object to the childInfo Array
            { $replaceRoot: { newRoot: "$ratelist" } },
          ],
          as: "childInfo",
        },
      },

      // Stage 3 : This Stage will convert ChildInfo Array to Plain ChildInfo Object 
      // Because at this point we only have one Array Element in ChildINfo Array
      { $unwind: "$childInfo" },


      // Stage 4 : Group the user based on userId field PRESENT in the Documents
      // here _id field is important because left hand side in the group stage must be accumulator
      {
        $group: {
          _id: "$userId",
          totalPrice: { $sum: "$childInfo.price" },
        },
      },
    ]);

    if (!totalDeliveriesCost.length)
      return res.status(NOT_FOUND).send({
        message: `ERROR : No Delivery Record for the given user found...`,
      });

    res.status(SUCCESS).send({ totalDeliveriesCost });
  } catch (error) {
    res.status(NOT_FOUND).send({ error: `ERROR : ${error.message}` });
  }
};



// EXPORT ALL CONTROLLERS
module.exports = {
  createDelivery,
  getDeliveryRecordById,
  getDeliveries,
  updateDeliveryRecord,
  calculateDeliveryCostBasedOnUserId,
};
