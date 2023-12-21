import Joi from "joi";

const createStockSchema = Joi.object({
  comment: Joi.string().empty("").default("None"),
  expiry: Joi.date().required(),
  level: Joi.number().required(),
  item: Joi.number().required(),
});

export { createStockSchema };
