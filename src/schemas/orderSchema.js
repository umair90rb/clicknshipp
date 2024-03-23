import Joi from "joi";

export const orderBookSchema = Joi.object({
  service: Joi.string().required(),
  orderId: Joi.number().required(),
});

export const orderAssignSchema = Joi.object({
  agentIds: Joi.array().items(Joi.number()).min(1),
  orderIds: Joi.array().items(Joi.number()).min(1),
});

export const orderStatusUpdateSchema = Joi.object({
  orderId: Joi.number().required(),
  status: Joi.string().required(),
  reason: Joi.string().allow(""),
  remarks: Joi.string().allow(""),
});
