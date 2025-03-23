import Joi from 'joi';

export const createSalesOrder = Joi.object({
  location_id: Joi.number().integer().required(),
  name: Joi.string().required(),
  comment: Joi.string().allow(''),
  items: Joi.array()
    .items({
      item_id: Joi.number().integer().required(),
      quantity: Joi.number().integer().min(1).required('Please enter quantity'),
      // price: Joi.number().integer().min(0).required('Please enter price'),
    })
    .min(1)
    .required(),
});
