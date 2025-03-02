import Joi from 'joi';

const createBillOfMaterialSchema = Joi.object({
  product_id: Joi.object({
    id: Joi.number().integer().required(),
    label: Joi.string().required(),
  }),
  name: Joi.string().allow(''),
  quantity: Joi.number().integer().required(),
  unit_of_measure: Joi.string().required(),
  materials: Joi.array()
    .items({
      raw_material_id: Joi.object({
        id: Joi.number().integer().required(),
        label: Joi.string().required(),
        type: Joi.string().required(),
      }),
      quantity: Joi.number()
        .integer()
        .min(1)
        .required('Please enter stock received quantity'),
      unit_of_measure: Joi.string().required('Please select unit'),
    })
    .min(1)
    .required(),
});

const materialQuantityUpdateSchema = Joi.object({
  quantity: Joi.number().integer().required(),
  reason: Joi.string().required(),
  previousQuantity: Joi.number().integer().required(),
});

const idAndLocationIdSchema = Joi.object({
  id: Joi.number().integer().required(),
  locationId: Joi.number().integer().required(),
});

export {
  createBillOfMaterialSchema,
  materialQuantityUpdateSchema,
  idAndLocationIdSchema,
};
