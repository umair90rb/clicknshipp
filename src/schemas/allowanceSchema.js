import Joi from "joi";

const createUpdateAllowanceSchema = Joi.object({
  name: Joi.string().required(),
});

export { createUpdateAllowanceSchema };
