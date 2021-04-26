const Joi = require("joi");

const paymentSchemaValidator = Joi.object({
  userId: Joi.string().required(),
  paid: Joi.number().required(),
  dueAmount : Joi.number().required()
});

module.exports = {
  paymentSchemaValidator,
};
