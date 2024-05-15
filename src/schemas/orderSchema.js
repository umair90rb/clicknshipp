import Joi from "joi";

export const orderFilterSchema = Joi.object({
  page: Joi.number().allow(null),
  pageSize: Joi.number().allow(null),
  filters: Joi.array()
    .items(
      Joi.object({
        column: Joi.string().required(),
        op: Joi.string().required(),
        value: Joi.alternatives(Joi.string(), Joi.number())
          .required()
          .allow(""),
      })
    )
    .default([]),
  sort: Joi.array()
    .items(
      Joi.object({
        field: Joi.string().required(),
        sort: Joi.string().required(),
      })
    )
    .default([]),
});

export const orderBookSchema = Joi.object({
  accountId: Joi.number().required(),
  orderId: Joi.number().required(),
});

export const orderAssignSchema = Joi.object({
  agentIds: Joi.array().items(Joi.number()).min(1),
  orderIds: Joi.array().items(Joi.number()).min(1),
});

export const orderStatusUpdateSchema = Joi.object({
  orderId: Joi.number().required(),
  status: Joi.string().required(),
  reason: Joi.string().allow(""),
  remarks: Joi.string().allow(""),
});

export const bulkOrderDeleteSchema = Joi.object({
  orderIds: Joi.array().items(Joi.number()).min(1),
});
