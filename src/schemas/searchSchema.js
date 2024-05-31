import Joi from "joi";

const searchSchema = Joi.object({
  query: Joi.string().min(3).required(),
  tag: Joi.string().allow(""),
});

export { searchSchema };
