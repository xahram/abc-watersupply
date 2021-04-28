const Utility = require("../models/utility.model");
const {
  CREATED,
  BAD_REQUEST,
  CONFLICT,
  SERVER_ERROR,
  SUCCESS,
} = require("../dependencies/config").RESPONSE_STATUS_CODES;
const {
  utilitySchemaValidator,
  updateRateListSchemaValidator,
  updateSubscriptionListSchemaValidator
} = require("../dependencies/helpers/validation.schema/utility.validation");
const mongoose = require("mongoose");

const utilityController = async (req, res, next) => {
  const { roles = [], ratelist = [], subscriptions = [] } = req.body;
  try {
    // Check If the Utility Model is Empty Or Not
    await utilitySchemaValidator.validateAsync(req.body);
    const [utilityObj] = await Utility.find();
    if (!utilityObj) {
      console.log("Iniside Utility Object");
      const utility = new Utility({
        roles,
        ratelist,
        subscriptions,
      });
      await utility.save();
      return res.status(CREATED).send({ message: "CREATED", utility });
    }

    // Check If the values provided in the Request Body
    // already exist in our database if so reject the request

    const doesNotExist =
      roles?.every((role) => {
        return !utilityObj.roles.includes(role);
      }) &&
      ratelist?.every((rl) => {
        return (
          utilityObj.ratelist.filter((uRL) => {
            return uRL.size === rl.size;
          }).length === 0
        );
      }) &&
      subscriptions?.every((sb) => {
        return (
          utilityObj.subscriptions.filter((uSB) => {
            return uSB.name === sb.name;
          }).length === 0
        );
      });

    // If the Request Body doesn't contain the fields present
    // in our database then concatenate them with the existing
    // values [PAYASYOUGO,MONTHLY] -> [PAYASYOUGO,MONTHLY,WEEKLY]
    if (!doesNotExist)
      return res
        .status(CONFLICT)
        .send({ message: "Field Already Exists, Please send unique fielts" });

    const newRoles = utilityObj.roles.concat(roles);
    const newRateList = utilityObj.ratelist.concat(ratelist);
    const newSubscriptions = utilityObj.subscriptions.concat(subscriptions);

    const utility = new Utility({
      roles: newRoles,
      ratelist: newRateList,
      subscriptions: newSubscriptions,
    });
    await utility.save();
    await Utility.deleteOne();
    res.status(CREATED).send({ message: "CREATED", utility });
  } catch (error) {
    res.status(BAD_REQUEST).send({ message: error.message });
  }
};

const getAllUtilities = async (req, res, next) => {
  try {
    const utility = await Utility.find();
    res.status(SUCCESS).send(utility);
  } catch (error) {
    return res
      .status(SERVER_ERROR)
      .send({ message: `Error : ${error.message}` });
  }
};

const updateRateList = async (req, res, next) => {
  try {
    const { ratelist } = await updateRateListSchemaValidator.validateAsync(req.body);
    const updatedUtility = await Utility.updateOne(
      { "ratelist._id": ratelist.rateListId },
      {
        $set: {
          "ratelist.$": ratelist,
        },
      },
      { new: true }
    );

    return res
      .status(SUCCESS)
      .send({ sale: updatedUtility, message: "Successfully Updated" });
  } catch (error) {
    return res
      .status(SERVER_ERROR)
      .send({ message: `Error : ${error.message}` });
  }
};
const updateSubscription = async (req, res, next) => {
  try {
    const { subscription } = await updateSubscriptionListSchemaValidator.validateAsync(req.body);
    const updatedUtility = await Utility.updateOne(
      { "subscriptions._id": subscription.subscriptionListId },
      {
        $set: {
          "subscriptions.$": subscription,
        },
      },
      { new: true }
    );

    return res
      .status(SUCCESS)
      .send({ sale: updatedUtility, message: "Successfully Updated" });
  } catch (error) {
    return res
      .status(SERVER_ERROR)
      .send({ message: `Error : ${error.message}` });
  }
};

module.exports = {
  utilityController,
  getAllUtilities,
  updateRateList,
  updateSubscription,
};
