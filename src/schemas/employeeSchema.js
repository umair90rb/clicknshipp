import Joi from "joi";

const createUpdateEmployeeSchema = Joi.object({
  name: Joi.string().required(),
});

export { createUpdateEmployeeSchema };
