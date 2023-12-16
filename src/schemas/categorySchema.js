import Joi from "joi";

const createUpdateCategorySchema = Joi.object({
  name: Joi.string().required(),
});

export { createUpdateCategorySchema };
