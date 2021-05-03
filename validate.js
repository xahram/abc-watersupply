const {
  UNAUTHORIZED,
  FORBIDDEN,
  CONFLICT,
  BAD_REQUEST,
} = require("./api/dependencies/config").RESPONSE_STATUS_CODES;

const validateBody = (schema) => {
  return async (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    const isValid = error == null;

    if (!isValid) {
      let errors = error.details.map((detail) => {
        return {
          key: detail.context.key,
          value: detail.message,
        };
      });

      return res.status(BAD_REQUEST).send(errors);
    }

    // otherwise
    next();
  };
};

const validateParams = (schema) => {
  return async (req, res, next) => {
    const { error } = schema.validate(req.params, { abortEarly: false });

    const isValid = error == null;

    if (!isValid) {
      let errors = error.details.map((detail) => {
        return {
          key: detail.context.key,
          value: detail.message,
        };
      });

      return res.status(BAD_REQUEST).send(errors);
    }

    // otherwise
    next();
  };
};

module.exports = { validateBody, validateParams };
