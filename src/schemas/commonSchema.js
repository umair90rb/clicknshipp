import Joi from 'joi';

export const idSchema = Joi.object({
  id: Joi.number().integer().required(),
});

export const identifierSchema = Joi.object({
  identifier: Joi.string().required(),
});
