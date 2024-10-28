import Joi from 'joi';

const createUnitOfMeasureSchema = Joi.object({
  name: Joi.string().required(),
});

export { createUnitOfMeasureSchema };
