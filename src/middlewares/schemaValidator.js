const validationOptions = {
  abortEarly: false,
  allowUnknown: false,
  stripUnknown: false,
};

export default function schemaValidator(schema, useJoiError = true) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, validationOptions);

    if (error) {
      const customError = {
        status: "failed",
        error: "Invalid request. Please review request and try again.",
      };

      const joiError = {
        status: "failed",
        error: error.details.map(({ message, type }) =>
          message.replace(/['"]/g, "")
        ),
      };

      return res.status(422).json(useJoiError ? joiError : customError);
    }

    req.body = value;
    return next();
  };
}
