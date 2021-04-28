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

const updatePaymentRecordSchemaValidator = Joi.object({
  paymentId: Joi.string().required(),
  paid: Joi.number().positive().greater(0),
  dueAmount : Joi.number().greater(-1)
})

module.exports = {
  createPaymentSchemaValidator,
  getPaymentRecordOfUserSchemaValidator,
  singlePaymentRecordValidatorSchema,
  updatePaymentRecordSchemaValidator
};
