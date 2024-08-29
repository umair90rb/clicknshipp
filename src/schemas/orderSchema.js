import Joi from "joi";

export const orderFilterSchema = Joi.object({
  page: Joi.number().allow(null),
  pageSize: Joi.number().allow(null),
  filters: Joi.array()
    .items(
      Joi.object({
        column: Joi.string().required(),
        op: Joi.string().required(),
        value: Joi.alternatives(Joi.string(), Joi.number(), Joi.array())
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

export const filteredOrderSchema = Joi.object({
  brand: Joi.array().items(Joi.number()).min(0).optional(),
  users: Joi.array().items(Joi.number()).min(0).optional(),
  chanel: Joi.array().items(Joi.number()).min(0).optional(),
  startPeriod: Joi.string().allow("").optional(),
  endPeriod: Joi.string().allow("").optional(),
  type: Joi.string().allow("").optional(),
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

export const orderItemsAddUpdateSchema = Joi.object({
  orderId: Joi.number().required(),
  items: Joi.array()
    .items({
      id: Joi.alternatives(Joi.string(), Joi.number()).required(),
      name: Joi.string().required(),
      quantity: Joi.number().min(1).required(),
      price: Joi.alternatives(Joi.string(), Joi.number()).required(),
    })
    .min(1),
});

export const orderPatchUpdateSchema = Joi.object({
  customerId: Joi.number().allow(""),
  addressId: Joi.number().allow(""),
  first_name: Joi.string().required(),
  last_name: Joi.string().allow(""),
  delivery_account_id: Joi.number().allow(null),
  phone: Joi.string().required(),
  remarks: Joi.string().allow(""),
  address: Joi.string().required(),
  city: Joi.string().required(),
  status: Joi.string().required(),
});

export const bulkOrderDeleteSchema = Joi.object({
  orderIds: Joi.array().items(Joi.number()).min(1),
});
