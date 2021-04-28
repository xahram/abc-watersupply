const Joi = require("joi");

const utilitySchemaValidator = Joi.object({
  roles: Joi.array().items(Joi.string().required()),
  ratelist: Joi.array().items({
    size: Joi.string().required(),
    price: Joi.number().greater(-1).required(),
  }),
  subscriptions: Joi.array().items({
    name: Joi.string().required(),
    price: Joi.number().greater(0).positive().required(),
    days: Joi.number().positive().greater(0).required(),
  }),
});

const updateRateListSchemaValidator = Joi.object({
  ratelist: Joi.object({
    rateListId: Joi.string().required(),
    size: Joi.string(),
    price: Joi.number().greater(0).positive(),
  }),
});

const updateSubscriptionListSchemaValidator = Joi.object({
    subscription: Joi.object({
        subscriptionListId: Joi.string().required(),
        name: Joi.string(),
        days: Joi.number().greater(0).positive(),
        price: Joi.number().greater(0).positive()
    }),
  });

module.exports = {
  utilitySchemaValidator,
  updateRateListSchemaValidator,
  updateSubscriptionListSchemaValidator
};
