import Joi from 'joi';

export const getBatchSchema = Joi.object({
  item_type: Joi.string().required(),
  location_id: Joi.number().integer().required(),
  ids: Joi.array().items(Joi.number().integer()).min(1),
});
