import Joi from "joi";

const createUpdateDeliveryServiceAccount = Joi.object({
  name: Joi.string().required(),
  service: Joi.string().required(),
  client_id: Joi.string().required().allow(""),
  key: Joi.string().required().allow(""),
  username: Joi.string().required().allow(""),
  password: Joi.string().required().allow(""),
  active: Joi.boolean().required(),
});

export { createUpdateDeliveryServiceAccount };
