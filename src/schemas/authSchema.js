import Joi from 'joi';

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  device_name: Joi.string().allow(''),
});

const updatedPasswordSchema = Joi.object({
  current_password: Joi.string().required(),
  password: Joi.string().required(),
  confirm_password: Joi.string().required(),
});

export { loginSchema, updatedPasswordSchema };
