import Joi from 'joi';

const createLocationSchema = Joi.object({
  name: Joi.string().required(),
  address: Joi.string().required(),
});

export { createLocationSchema };
