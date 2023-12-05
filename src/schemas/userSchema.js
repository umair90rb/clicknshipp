import Joi from "joi";

const createUserSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  roles: Joi.array().items(Joi.number().integer()).min(1),
});

const updateUserSchema = Joi.object({
  name: Joi.string(),
  phone: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string().min(8),
  roles: Joi.array().items(Joi.number().integer()),
});

export { createUserSchema, updateUserSchema };
