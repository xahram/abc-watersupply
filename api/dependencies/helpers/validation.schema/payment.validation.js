const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);


const createPaymentSchemaValidator = Joi.object({
  userId: Joi.objectId().required(),
  paid: Joi.number().required().positive().greater(0),
  dueAmount : Joi.number().required().greater(-1)
});

const getPaymentRecordOfUserSchemaValidator = Joi.object({
  userId: Joi.objectId().required()
});

const singlePaymentRecordValidatorSchema = Joi.object({
  paymentId: Joi.objectId().required()
});

const updatePaymentRecordSchemaValidator = Joi.object({
  paymentId: Joi.objectId().required(),
  paid: Joi.number().positive().greater(0),
  dueAmount : Joi.number().greater(-1)
})

const calculateTotalPaymentForUserSchemaValidator = Joi.object({
  userId :  Joi.objectId().required()
})

module.exports = {
  createPaymentSchemaValidator,
  getPaymentRecordOfUserSchemaValidator,
  singlePaymentRecordValidatorSchema,
  updatePaymentRecordSchemaValidator,
  calculateTotalPaymentForUserSchemaValidator
};
