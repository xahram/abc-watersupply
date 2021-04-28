const Joi = require("joi");

const createSaleSchemaValidator = Joi.object({
    paid : Joi.number().required().positive().greater(0)
});

const getSingleSaleRecordSchemaValidator = Joi.object({
    saleId : Joi.string().required()
});

const updateSaleRecordSchemaValidator = Joi.object({
  saleId : Joi.string().required(),
  paid : Joi.number().required().positive().greater(0)
})

module.exports = {
  createSaleSchemaValidator,
  getSingleSaleRecordSchemaValidator,
  updateSaleRecordSchemaValidator
};
