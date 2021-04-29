const schedule = require("node-schedule");
const Payment = require("../../models/payment.model");
const Utility = require("../../models/utility.model");
const { logError, logInfo } = require("../helpers/console.helpers");
const moment = require("moment");

const scheduledPayment = async (subscriptionId, userId) => {
  let job;
  try {
    const { subscriptions } = await Utility.findOne(
      {
        "subscriptions._id": subscriptionId,
      },
      { "subscriptions.$": 1 }
    );
    console.log(subscriptions[0]);

    let scheduleTime = subscriptions[0].days;
    if (!subscriptions.length)
      return new Error("Subscription Unavailable at the moment");

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
            return payment;
          })
          .catch((err) => {
            return `ERROR : ${err.message}`;
          });

      }
    );
  } catch (error) {
    logError(`[SubscriptionPayments.scheulde.js] -> ${error.message}`);
    return new Error(error.message);
  }

  job.on("run", (data) => logInfo(data._id));
};

module.exports = scheduledPayment;
