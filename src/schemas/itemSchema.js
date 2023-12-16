import Joi from "joi";

const createItemSchema = Joi.object({
  name: Joi.string().required(),
  code: Joi.string().required(),
  unit_price: Joi.number().required(),
  cost_price: Joi.number(),
  category: Joi.number().required(),
  brand: Joi.number().required(),
  supplier: Joi.number(),
});

const updateItemSchema = Joi.object({
  name: Joi.string(),
  code: Joi.string(),
  unit_price: Joi.number(),
  cost_price: Joi.number(),
  category: Joi.number(),
  brand: Joi.number(),
  supplier: Joi.number(),
});

export { createItemSchema, updateItemSchema };
