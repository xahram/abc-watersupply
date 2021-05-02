const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const createSaleSchemaValidator = Joi.object({
    paid : Joi.number().required().positive().greater(0)
});

const getSingleSaleRecordSchemaValidator = Joi.object({
    saleId : Joi.objectId().required()
});

const updateSaleRecordSchemaValidator = Joi.object({
  saleId : Joi.objectId().required(),
  paid : Joi.number().required().positive().greater(0)
})

module.exports = {
  createSaleSchemaValidator,
  getSingleSaleRecordSchemaValidator,
  updateSaleRecordSchemaValidator
};
