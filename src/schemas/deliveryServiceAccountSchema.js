import Joi from "joi";

const createUpdateDeliveryServiceAccount = Joi.object({
  service: Joi.string().required(),
  key: Joi.string().required().allow(""),
  active: Joi.boolean().required(),
});

export { createUpdateDeliveryServiceAccount };
