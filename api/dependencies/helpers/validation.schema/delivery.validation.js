const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const { getBottleSizesFromDatabase } = require("../../config");

// Validation Method is used for getting array of BottleSizes
// available in the db and we check if the bottle size sent
// by the client is available in the array returned by this method.
const checkBottleSizeInDb = async (bottle) => {
  try {
    const bottleTypes = await getBottleSizesFromDatabase();
    if (bottleTypes.includes(bottle)) return Promise.resolve(true);

    // const [utility] = await Utility.find();
    // if (!utility) return Promise.reject("No Utility Entry Exists, First Create Utility To Proceed Further");

    // const bottleTypes = utility.ratelist.map((el) => {
    //   return el.size;
    // });
    // console.log("delivery validation ", bottleTypes, bottle);
  } catch (error) {
    return Promise.reject(error);
  }
};

const getUserDeliveriesSchemaValidator = Joi.object({
  userId: Joi.objectId().required(),
});

const getDeliveryRecordByIdSchemaValidator = Joi.object({
  deliveryId: Joi.objectId().required(),
});

const updateDeliveryRecordSchemaValidator = Joi.object({
  deliveryId: Joi.objectId().required(),
  bottleSize: Joi.string().required(),
});

const calculateDeliveryCostValidationSchema = Joi.object({
  userId: Joi.objectId().required(),
});

module.exports = {
  getUserDeliveriesSchemaValidator,
  checkBottleSizeInDb,
  getDeliveryRecordByIdSchemaValidator,
  updateDeliveryRecordSchemaValidator,
  calculateDeliveryCostValidationSchema
};
