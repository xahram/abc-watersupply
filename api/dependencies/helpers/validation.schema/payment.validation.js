const Joi = require("joi");

const createPaymentSchemaValidator = Joi.object({
  userId: Joi.string().required(),
  paid: Joi.number().required().positive().greater(0),
  dueAmount : Joi.number().required().greater(-1)
});

const getPaymentRecordOfUserSchemaValidator = Joi.object({
  userId: Joi.string().required()
});

const singlePaymentRecordValidatorSchema = Joi.object({
  paymentId: Joi.string().required()
});

module.exports = {
  createPaymentSchemaValidator,
  getPaymentRecordOfUserSchemaValidator,
  singlePaymentRecordValidatorSchema
};
