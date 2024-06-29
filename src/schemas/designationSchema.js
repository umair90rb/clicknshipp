import Joi from "joi";

const createUpdateDesignationSchema = Joi.object({
  name: Joi.string().required(),
});

export { createUpdateDesignationSchema };
