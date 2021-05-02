const schedule = require("node-schedule");
const Payment = require("../../../models/payment.model");
const Utility = require("../../../models/utility.model");
const { logError, logInfo } = require("../../helpers/console.helpers");
const moment = require("moment");

const scheduledPayment = async (subscriptionId, userId) => {
  let job;
  try {
    //
    const { subscriptions } = await Utility.findOne(
      {
        // This will match the Whole utiltiy Document based on
        // match id on subsciprition subdocument
        "subscriptions._id": subscriptionId,
      },

      // This will only select the matched sub document because of position $
      { "subscriptions.$": 1 }
    );
    console.log(subscriptions[0]);

    if (!subscriptions.length)
      return new Error("Subscription Unavailable at the moment");

    let scheduleTime = subscriptions[0].days;
    job = schedule.scheduleJob(
      `*/${scheduleTime} * * * * *`,
      async function () {
        const payment = new Payment({
          userId,
          paid: subscriptions[0].price,
          dueAmount: 0,
          paymentTime: moment().format(),
        });
        await payment
          .save()
          .then((payment) => {
            logInfo(payment);
          })
          .catch((err) => {
            logInfo(`ERROR : ${err.message}`);
          });
          return payment
      }
    );
  } catch (error) {
    logError(`[SubscriptionPayments.scheulde.js] -> ${error.message}`);
    return new Error(error.message);
  }

  // job.on("run", (data) => logInfo(data));
};



module.exports = scheduledPayment;
