const Delivery = require("../models/delivery.model");
const User = require("../models/user.model");
const moment = require("moment");
const {
  checkBottleSizeInDb,
  getUserDeliveriesSchemaValidator,
  getDeliveryRecordByIdSchemaValidator,
  updateDeliveryRecordSchemaValidator,
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

    // TRUE IN CASE BOTTLE IS IN OUR DB FALSE IN CASE OF NON EXISTENCE
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

    // CREATE NEW DELIVERY FOR THE PARTICULAR USER
    const delivery = new Delivery({
      userId: user._id,
      bottleSize,
      deliveryTime
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

    // GET THE  DELIVERIES AND SORT THEM BASED ON THEIR DATE
    const deliveries = await Delivery.find(
      { userId },
      { __v: 0 },
      { sort: { deliveryTime: -1 } }
    );

    // IF THERE IS NO DELIVERY OF THE USER IN OUR DATABASE
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
    //VALIDATE THE INCOMING REQUEST FOR THE DELIVERYID
    const {
      deliveryId,
    } = await getDeliveryRecordByIdSchemaValidator.validateAsync(req.params);

    const delivery = await Delivery.findOne(
      { _id: deliveryId },
      { __v: 0 },
      { sort: { deliveryTime: -1 } }
    );

    // IF THE DELIVERY WITH THAT RECORD DOES'NT EXIST
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
    // VALIDATE IF THE REQUEST HAVE REQUIRED FIELDS LIKE DELIVERYID BOTTLESIZE
    const values = await updateDeliveryRecordSchemaValidator.validateAsync(
      req.body
    );

    // CHECK IF BOTTLE SIZE IN REQUEST EXISTS IN OUR DB
    const bottleSize = await checkBottleSizeInDb(values.bottleSize);

    // IF BOTTLE SIZE DOESN"T EXIST
    if (!bottleSize)
      return res
        .status(NOT_FOUND)
        .send({ message: `Bottle Size Not Found in our Record` });

    // USE FINDONEANDUPDATE TO GET THE NEW UPDATED FIELD
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


// EXPORT ALL CONTROLLERS
module.exports = {
  createDelivery,
  getDeliveryRecordById,
  getDeliveries,
  updateDeliveryRecord,
};
