const Joi = require("joi");

const createSaleSchemaValidator = Joi.object({
    paid : Joi.number().required().positive().greater(0)
});

const getSingleSaleRecordSchemaValidator = Joi.object({
    saleId : Joi.string().required()
});

module.exports = {
  createSaleSchemaValidator,
  getSingleSaleRecordSchemaValidator
};
