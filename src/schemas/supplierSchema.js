import Joi from "joi";

const createSupplierSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().allow(""),
  company: Joi.string().allow(""),
  account_number: Joi.number().allow(""),
});

const updateSupplierSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().allow(""),
  company: Joi.string().allow(""),
  account_number: Joi.number().allow(""),
});

export { createSupplierSchema, updateSupplierSchema };
