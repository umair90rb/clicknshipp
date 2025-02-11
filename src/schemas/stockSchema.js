import Joi from 'joi';

const createStockSchema = Joi.object({
  item_type: Joi.string().required(),
  comment: Joi.string().allow(''),
  location_id: Joi.number().integer().required(),
  inventory: Joi.array()
    .items({
      item_id: Joi.object({
        id: Joi.number().integer().required(),
        label: Joi.string().required(),
        unit: Joi.string(),
      }),
      batch_number: Joi.string().allow(''),
      production_date: Joi.date().allow(null),
      expiry_date: Joi.date().allow(null),
      quantity: Joi.number()
        .integer()
        .min(1)
        .required('Please enter stock received quantity'),
      unit_of_measure: Joi.string().required('Please select unit'),
    })
    .min(1)
    .required(),
});

const stockHistorySchema = Joi.object({
  item_type: Joi.string().required(),
  item_id: Joi.number().integer().required(),
});

export { stockHistorySchema, createStockSchema };
