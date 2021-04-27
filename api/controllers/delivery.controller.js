const Delivery =  require("../models/delivery.model");
const User = require("../models/user.model");
const moment = require("moment");
const {getBottleSizeArray} = require("../dependencies/helpers/validation.schema/delivery.validation")
const {
    CREATED,
    BAD_REQUEST,
    SUCCESS,
    CONFLICT,
    NOT_FOUND,
  } = require("../dependencies/config").RESPONSE_STATUS_CODES;
  

const createDelivery = async (req, res, next) => {
    const { userId, bottleSize } = req.body;
  const deliveryTime = moment().format();

  try {
    // Check If Bottle Type Exists in our Database or Not
    const bottleTypeExists = await getBottleSizeArray(bottleSize);
    console.log(bottleTypeExists);
    if(!bottleTypeExists) return res.status(NOT_FOUND).send({message: "Please Send Valid Bottle Type"});

    // Check If user with that given Id Exists Or not
    const user = await User.findOne({ _id: userId });
    if (!user)
      return res
        .status(NOT_FOUND)
        .send({ message: "Can't Create Delivery, User doesn't exist..." });

   

    // Check If the previous Payment Rcord exists to calculate total Payment
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



const getDeliveries = async (req, res, next) => {
    const { userId } = req.body;
    try {
      const deliveries = await Delivery.find({ userId }, { __v: 0 }, { sort: { deliveryTime: -1 } });
      if (!deliveries.length)
        return res
          .status(NOT_FOUND)
          .send({ message: "No Delivery Record for this User Exists..." });
      res.status(SUCCESS).send({ deliveries });
    } catch (error) {
      res.status(NOT_FOUND).send({ message: error.message });
    }
  };
  
  const getLatestDeliveryRecord = async (req, res, next) => {
    const { deliveryId } = req.params;
    try {
      const delivery = await Delivery.findOne(
        { _id: deliveryId },
        { __v: 0 },
        { sort: { deliveryTime: -1 } }
      );
      if (!delivery)
        return res
          .status(NOT_FOUND)
          .send({ message: "No Such Delivery Record Exists..." });
      res.status(SUCCESS).send({ delivery });
    } catch (error) {
      res.status(NOT_FOUND).send({ message: error.message });
    }
  };
  


module.exports = { createDelivery ,getLatestDeliveryRecord,getDeliveries};
