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

const createDelivery = async (req, res, next) => {
  const { userId, bottleSize } = req.body;
  const deliveryTime = moment().format();

  try {
    // Check If Bottle Type Exists in our Database or Not
    const bottleTypeExists = await checkBottleSizeInDb(bottleSize);
    console.log(bottleTypeExists);
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

    // Check If the previous Payment Rcord exists to calculate total Payment
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

const getDeliveries = async (req, res, next) => {
  // const { userId } = req.body;
  try {
    const { userId } = await getUserDeliveriesSchemaValidator.validateAsync(
      req.body
    );
    const deliveries = await Delivery.find(
      { userId },
      { __v: 0 },
      { sort: { deliveryTime: -1 } }
    );
    if (!deliveries.length)
      return res
        .status(NOT_FOUND)
        .send({ message: "No Delivery Record for this User Exists..." });
    res.status(SUCCESS).send({ deliveries });
  } catch (error) {
    res.status(NOT_FOUND).send({ message: error.message });
  }
};

const getDeliveryRecordById = async (req, res, next) => {
  // const { deliveryId } = req.params;
  try {
    const {
      deliveryId,
    } = await getDeliveryRecordByIdSchemaValidator.validateAsync(req.params);
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

const updateDeliveryRecord = async (req, res, next) => {
  try {
    const values = await updateDeliveryRecordSchemaValidator.validateAsync(
      req.body
    );
    const bottleSize = await checkBottleSizeInDb(values.bottleSize);
    if(!bottleSize) return res.status(NOT_FOUND).send({message: `Bottle Size Not Found in our Record`})
    
    const updatedDelivery = await Delivery.findOneAndUpdate(
      { _id: values.deliveryId },
      { ...values },
      { new: true }
    );

    return res
      .status(SUCCESS)
      .send({ delivery: updatedDelivery, message: "Successfully Updated" });
  } catch (error) {
    res.status(NOT_FOUND).send({ message: error.message });
  }
};

module.exports = {
  createDelivery,
  getDeliveryRecordById,
  getDeliveries,
  updateDeliveryRecord,
};
