import Joi from 'joi';

const createRawMaterialSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(''),
  unit_of_measure: Joi.string().required(),
  code: Joi.string().required(),
  type: Joi.string().required(),
  cost_price: Joi.number().required(),
  re_order_level: Joi.number().required(),
});

export { createRawMaterialSchema };
