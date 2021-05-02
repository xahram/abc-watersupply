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
  updateSubscriptionListSchemaValidator,
} = require("../dependencies/helpers/validation.schema/utility.validation");

// UTILITY CONTROLLER TO CREATE ROLES SUBSCRIPTIONS AND RATELIST FOR OUR APP
const utilityController = async (req, res, next) => {
  const { roles = [], ratelist = [], subscriptions = [] } = req.body;
  try {
    // Check if the incoming request has valid fields required by our app
    await utilitySchemaValidator.validateAsync(req.body);

    // Check If the Utility Model is Empty Or Not BY TAKING FIRST UTILITY ELEMENT
    const [utilityObj] = await Utility.find();
    if (!utilityObj) {
      const utility = new Utility({
        roles,
        ratelist,
        subscriptions,
      });
      await utility.save();
      return res.status(CREATED).send({ message: "CREATED", utility });
    }

    // Check If the values provided in the Request Body already exist in our database if so reject the request
    // EVALUATES TO TRUE AND REJECT in CASE OF FALSE

    const doesNotExist =
      // True if the roles provided doesn't already exist in our db
      roles?.every((role) => {
        return !utilityObj.roles.includes(role);
      }) &&
      // True if the [Size] of the bottle isn't inour db [UtilityObj] 
      ratelist?.every((rl) => {
        return (
          utilityObj.ratelist.filter((uRL) => {
            return uRL.size === rl.size;
          }).length === 0
        );
      }) &&
      // TRUE if the [NAME] of the SUBSCRIPTION isn't in our database [utilityOBJ]
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

    // CONCAT THE INCOMING REQUEST OPTIONS WITH OUR EXISTING VALUES
    const newRoles = utilityObj.roles.concat(roles);
    const newRateList = utilityObj.ratelist.concat(ratelist);
    const newSubscriptions = utilityObj.subscriptions.concat(subscriptions);

    const utility = new Utility({
      roles: newRoles,
      ratelist: newRateList,
      subscriptions: newSubscriptions,
    });
    await utility.save();

    //UPON SAVING THE NEW UTILITY OBJECT DELETE THE OLD RECORD FROM DB
    await Utility.deleteOne();
    res.status(CREATED).send({ message: "CREATED", utility });
  } catch (error) {
    res.status(BAD_REQUEST).send({ message: error.message });
  }
};



// CONTROLLER TO GET THE LIST OF ALL DATA IN OUR UTILITY COLLECTION
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

// CONTROLLER TO UPDATE THE RATELIST PRESENT IN UTILITY COLLECTION
const updateRateList = async (req, res, next) => {
  try {
    // Validate incoming request's RateList for Correct fields syntax 
    const { ratelist } = await updateRateListSchemaValidator.validateAsync(
      req.body
    );

    //Find the utility object witht the given ratelist ID
    const updatedUtility = await Utility.findOneAndUpdate(
      { "ratelist._id": ratelist.rateListId },
      {
        // $ SIGN SHOWS THE MATCHED SUBDOCUMENT BASED ON WHICH UTILITY DOCUMENT
        // WAS SELECTED ABOVE AND GIVES THE INDEX OF THE MATCHED SUB DOCUMENT ALSO CALLED POSITIONAL $ OPERATOR
        $set: {
          "ratelist.$.size": ratelist.size,
          "ratelist.$.price": ratelist.price,
        },
      },
      { new: true }
    ).exec();

    return res
      .status(SUCCESS)
      .send({ ratelist: updatedUtility, message: "Successfully Updated" });
  } catch (error) {
    return res
      .status(SERVER_ERROR)
      .send({ message: `Error : ${error.message}` });
  }
};

// CONTROLLER TO UPDATE THE SUBSCRIPTION PRESENT IN UTILITY COLLECTION
const updateSubscription = async (req, res, next) => {
  try {
    // Validate Incoming request Subsciption data for correct fields syntax
    const {
      subscription,
    } = await updateSubscriptionListSchemaValidator.validateAsync(req.body);

    // Find the utility object with the given Subsciption ID
    const updatedUtility = await Utility.findOneAndUpdate(
      { "subscriptions._id": subscription.subscriptionListId },
      {
        // $ SIGN SHOWS THE MATCHED SUBDOCUMENT BASED ON WHICH UTILITY DOCUMENT
        // WAS SELECTED ABOVE AND GIVES THE INDEX OF THE MATCHED SUB DOCUMENT ALSO CALLED POSITIONAL $ OPERATOR
        $set: {
          "subscriptions.$.name": subscription.name,
          "subscriptions.$.days": subscription.days,
          "subscriptions.$.price": subscription.price,
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


// EXPORT ALL CONTROLLERS
module.exports = {
  utilityController,
  getAllUtilities,
  updateRateList,
  updateSubscription,
};
