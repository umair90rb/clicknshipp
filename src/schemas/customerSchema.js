import Joi from "joi";

export const searchCustomerSchema = Joi.object({
  phone: Joi.string(),
  email: Joi.string().email(),
});
