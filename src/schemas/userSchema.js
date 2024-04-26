import Joi from "joi";

const fetchUserWithPermissionsSchema = Joi.object({
  permissions: Joi.array().items(Joi.string()).min(1),
});

const createUserSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  roles: Joi.array().items(Joi.number().integer()).min(1),
  brands: Joi.array().items(Joi.number().integer()),
});

const updateUserSchema = Joi.object({
  name: Joi.string(),
  phone: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string().min(8),
  status: Joi.string(),
  roles: Joi.array().items(Joi.number().integer()),
  brands: Joi.array().items(Joi.number().integer()),
});

export { fetchUserWithPermissionsSchema, createUserSchema, updateUserSchema };
