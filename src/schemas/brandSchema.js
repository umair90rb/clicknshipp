import Joi from "joi";

const createUpdateBrandSchema = Joi.object({
  name: Joi.string().required(),
});

export { createUpdateBrandSchema };
