import Joi from "joi";

const createChanelSchema = Joi.object({
  name: Joi.string().required(),
  source: Joi.string().required(),
});

const updateChanelSchema = Joi.object({
  name: Joi.string().required(),
  source: Joi.string().required(),
});

export { createChanelSchema, updateChanelSchema };
