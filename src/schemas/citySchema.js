import Joi from 'joi';

export const createMapedCitySchema = Joi.array()
  .items(
    Joi.object({
      city: Joi.string().required(),
      maped: Joi.string().required(),
      courier: Joi.string().required(),
      assigned_id: Joi.number().integer().allow(null),
      id: Joi.number().integer().allow(''),
    })
  )
  .min(1);

export const searchCitySchema = Joi.object({
  city: Joi.string().required(),
});
