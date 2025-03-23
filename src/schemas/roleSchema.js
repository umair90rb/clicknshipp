import Joi from 'joi';

const createRoleSchema = Joi.object({
  name: Joi.string().required(),
  permissions: Joi.array().items(Joi.number().integer()).min(1),
});

const updateRoleSchema = Joi.object({
  permissions: Joi.array().items(Joi.number().integer()),
});

export { createRoleSchema, updateRoleSchema };
