import Joi from "joi";

const createChanelSchema = Joi.object({
  name: Joi.string().required(),
  source: Joi.string().required(),
  brand_id: Joi.number().required(),
});

const updateChanelSchema = Joi.object({
  name: Joi.string().required(),
  source: Joi.string().required(),
  brand_id: Joi.number().required(),
});

export { createChanelSchema, updateChanelSchema };
