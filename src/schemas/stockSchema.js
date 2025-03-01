import Joi from 'joi';

export const createStockSchema = Joi.object({
  item_type: Joi.string().required(),
  comment: Joi.string().allow(''),
  location_id: Joi.number().integer().required(),
  gate_pass_no: Joi.number().integer().required(),
  gate_pass_date: Joi.date().required(),
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

export const returnStockSchema = Joi.object({
  item_type: Joi.string().required(),
  comment: Joi.string().allow(''),
  location_id: Joi.number().integer().required(),
  inventory: Joi.array()
    .items({
      item_id: Joi.object({
        id: Joi.number().integer().required(),
        label: Joi.string().required(),
        unit: Joi.string().allow(null),
      }),
      batch_number: Joi.string().allow(''),
      quantity: Joi.number()
        .integer()
        .min(1)
        .required('Please enter stock return quantity'),
      unit_of_measure: Joi.string().required('Please select unit'),
    })
    .min(1)
    .required(),
});

export const addStockDamageSchema = Joi.object({
  item_type: Joi.string().required(),
  comment: Joi.string().allow(''),
  location_id: Joi.number().integer().required(),
  inventory: Joi.array()
    .items({
      item_id: Joi.object({
        id: Joi.number().integer().required(),
        label: Joi.string().required(),
        unit: Joi.string().allow(null),
      }),
      batch_number: Joi.string().allow(''),
      quantity: Joi.number()
        .integer()
        .min(1)
        .required('Please enter stock damage quantity'),
      unit_of_measure: Joi.string().required('Please select unit'),
      deduct_stock: Joi.boolean(),
    })
    .min(1)
    .required(),
});

export const stockHistorySchema = Joi.object({
  item_type: Joi.string().required(),
  item_id: Joi.number().integer().required(),
});

export const damageReportSchema = Joi.object({
  item_type: Joi.string().required(),
  item_id: Joi.number().integer().required(),
  location_id: Joi.number().integer().required(),
  from: Joi.date().required(),
  to: Joi.date().required(),
});
