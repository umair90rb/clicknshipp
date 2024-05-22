import Joi from "joi";

export const createMapedCitySchema = Joi.object({
  city: Joi.string().required(),
  maped: Joi.string().required(),
  service_id: Joi.number().integer().required(),
  code: Joi.string().allow(""),
  assigned_id: Joi.string().allow(""),
});
