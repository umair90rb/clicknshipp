import Joi from 'joi';

export const allNotificationSchema = Joi.object({
  action: Joi.string().required(),
  resource: Joi.string().required(),
  offset: Joi.number().integer().min(0).default(0),
  limit: Joi.number().integer().min(1).default(10),
});

export const markReadNotificationSchema = Joi.object({
  notifications: Joi.array().items(Joi.number().integer()).min(1).required(),
});

export const createNotificationSchema = Joi.object({
  resource: Joi.string().required(),
  action: Joi.string().required(),
});
