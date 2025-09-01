import Joi from 'joi';

const filteredChanelSchema = Joi.object({
  brand: Joi.array().items(Joi.number()).min(0),
});

const createChanelSchema = Joi.object({
  name: Joi.string().required(),
  source: Joi.string().required(),
  token: Joi.string().allow(null, ''),
  brand_id: Joi.number().required(),
});

const updateChanelSchema = Joi.object({
  name: Joi.string().required(),
  source: Joi.string().required(),
  token: Joi.string().allow(null, ''),
  brand_id: Joi.number().required(),
});

export { createChanelSchema, filteredChanelSchema, updateChanelSchema };

