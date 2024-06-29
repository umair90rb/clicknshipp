import Joi from "joi";

const createUpdateDepartmentSchema = Joi.object({
  name: Joi.string().required(),
});

export { createUpdateDepartmentSchema };
