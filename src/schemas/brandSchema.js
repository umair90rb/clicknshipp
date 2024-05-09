import Joi from "joi";

const createUpdateBrandSchema = Joi.object({
  name: Joi.string().required(),
  deliver_service_account_id: Joi.number(),
  shipment_series: Joi.number(),
});

export { createUpdateBrandSchema };
