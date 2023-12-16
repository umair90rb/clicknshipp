import Joi from "joi";

const createStockSchema = Joi.object({
  comment: Joi.string(),
  expiry: Joi.date().required(),
  level: Joi.number().required(),
  item: Joi.number(),
});

export { createStockSchema };
