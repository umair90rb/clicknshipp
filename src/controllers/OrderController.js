import { Op } from "sequelize";
import { sequelize } from "../models/index";
import model from "../models";
import { sendErrorResponse, sendSuccessResponse } from "../utils/sendResponse";
import { extract } from "../utils/extract";
import excelToJson from "../helpers/excelToJson";
import formatPhoneNumber from "../helpers/formatPhone";
import BookingService from "../services/BookingService";
import { PERMISSIONS } from "../constants/constants";
import logger from "../middleware/logger";

const { Order, OrderItem, Customer, Address, User, Chanel, Payments } = model;

const order_data_keys = [
  "order_number",
  "total_price",
  "total_tax",
  "subtotal_price",
  "total_price",
  "total_discounts",
  "created_at",
];
const address_data_keys = [
  "address1",
  "city",
  "zip",
  "province",
  "country",
  "address2",
  "company",
  "latitude",
  "longitude",
  "country_code",
  "province_code",
];

const customer_data_keys = [
  "email",
  "first_name",
  "last_name",
  "note",
  "phone",
];

const item_data_keys = [
  "name",
  "price",
  "grams",
  "quantity",
  "product_id",
  "sku",
  "total_discount",
];

function getOperator(key) {
  switch (key) {
    case "contains":
      return Op.like;
    case "equals":
      return Op.eq;
    case "starts with":
      return Op.startsWith;
    case "ends with":
      return Op.endsWith;
    case "is empty":
      return Op.eq;
    case "is not empty":
      return Op.ne;
    default:
      console.error(`Operator for key "${key}" not found.`);
      return null; // Or throw an error, depending on your use case
  }
}

function parseValue(value, type) {
  switch (type) {
    case "string":
      return value;
    case "number":
      return parseInt(value);
    case "date":
      return new Date(value);
    default:
      return value;
  }
}

const FILTER_COLUMNS = {
  order_number: { column: "order_number", type: "number" },
  status: { column: "status", type: "string" },
  agent: { column: "$user.name$", type: "string" },
  address: { column: "$address.address1$", type: "string" },
  city: { column: "$address.city$", type: "string" },
  total_price: { column: "total_price", type: "number" },
  total_tax: { column: "total_tax", type: "number" },
  total_discounts: { column: "total_discounts", type: "number" },
  createdAt: { column: "createdAt", type: "date" },
  chanel: { column: "$chanel.name$", type: "string" },
};

// const FILTER_OP = {
//   contains: Op.iLike,
//   equals: Op.eq,
//   "starts with": Op.startsWith,
//   "ends with": Op.endsWith,
//   "is empty": Op.eq,
//   "is not empty": Op.ne,
// };

const FILTER_OP = {
  "Is empty": Op.eq,
  "Is not empty": Op.ne,
  "Text contains": Op.iLike,
  "Text does not contain": Op.notILike,
  "Text starts with": Op.startsWith,
  "Text ends with": Op.endsWith,
  "Text is exactly": Op.eq,
  "Date is": Op.eq,
  "Date is before": Op.lt,
  "Date is after": Op.gt,
  "Greater than": Op.gt,
  "Greater than or equal to": Op.gte,
  "Less than": Op.lt,
  "Less than or equal to": Op.lte,
  "Is equal to": Op.eq,
  "Is not equal to": Op.ne,
  "Is between": Op.between,
  "Is not between": Op.notBetween,
};

export default {
  async orders(req, res) {
    try {
      const { page, pageSize, filters } = req.body;
      const permissions = req.user.permissions;
      const query = {
        offset: page * pageSize,
        limit: pageSize,
        where: {
          user_id: req.user.id,
        },
        order: [["createdAt", "DESC"]],
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name"],
          },
          {
            model: Chanel,
            as: "chanel",
            attributes: ["id", "name"],
          },
          {
            model: Address,
            as: "address",
            attributes: ["city", "address1"],
          },
        ],
        attributes: {
          exclude: [
            "data",
            "customer_id",
            "user_id",
            "chanel_id",
            "brand_id",
            "UserId",
            "CustomerId",
            "updatedAt",
          ],
        },
      };
      if (permissions.includes(PERMISSIONS.PERMISSION_VIEW_ALL_ORDERS)) {
        delete query.where.user_id;
      } else if (
        "settings" in req.user &&
        req.user.settings.hasOwnProperty("default_brand_id")
      ) {
        query.where.brand_id = req.user.settings.default_brand_id;
      } else if ("brands" in req.user) {
        query.where.brand_id = req.user.brands[0].id;
      }

      if (filters.length) {
        const _filters = {};
        for (let i = 0; i < filters.length; i++) {
          const { column, op, value } = filters[i];
          console.log(
            column,
            op,
            value,
            parseValue(value, FILTER_COLUMNS[column].type),
            "column, op, value, parse"
          );
          _filters[FILTER_COLUMNS[column].column] = {
            //parseValue(value, FILTER_COLUMNS[column].type)
            [FILTER_OP[op]]: value,
          };
        }
        query.where = { ...query.where, ..._filters };
      }
      const orders = await Order.findAndCountAll(query);
      return sendSuccessResponse(res, 200, {
        orders: { ...orders, ...req.body },
      });
    } catch (e) {
      console.error(e);
      return sendErrorResponse(
        res,
        500,
        "Could not perform operation at this time, kindly try again later.",
        e
      );
    }
  },
  async order(req, res) {
    try {
      const { id } = req.params;
      const order = await Order.findByPk(id, {
        attributes: {
          exclude: [
            "data",
            "CustomerId",
            "updatedAt",
            "customer_id",
            "chanel_id",
            "brand_id",
            "user_id",
          ],
        },
        include: [
          {
            model: Chanel,
            as: "chanel",
            attributes: ["id", "name"],
          },
          {
            model: User,
            as: "user",
            attributes: {
              exclude: [
                "password",
                "status",
                "settings",
                "createdAt",
                "updatedAt",
              ],
            },
          },
          {
            model: Customer,
            as: "customer",
          },
          {
            model: Address,
            as: "address",
            attributes: {
              exclude: [
                "order_id",
                "customer_id",
                "CustomerId",
                "OrderId",
                "company",
                "longitude",
                "latitude",
                "country_code",
                "province_code",
              ],
            },
          },
          {
            model: OrderItem,
            as: "items",
            attributes: {
              exclude: ["OrderId", "createdAt", "updatedAt"],
            },
          },
        ],
      });
      if (order) {
        return sendSuccessResponse(res, 200, { order });
      }
      return sendErrorResponse(res, 404, "No data found with this id.");
    } catch (e) {
      console.error(e);
      return sendErrorResponse(
        res,
        500,
        "Could not perform operation at this time, kindly try again later.",
        e
      );
    }
  },

  async createShopifyOrder(req, res) {
    try {
      const body = req.body;
      const storeDomain = req.get("x-shopify-shop-domain");
      const sha256 = req.get("x-shopify-hmac-sha256");
      let chanel;
      if (storeDomain) {
        chanel = await Chanel.findOne({
          where: {
            source: {
              [Op.iLike]: storeDomain,
            },
          },
        });
      }
      const order_data = extract(body, order_data_keys);
      const address_data = extract(body["billing_address"], address_data_keys);
      const customer_data = extract(body["customer"], customer_data_keys);
      if (customer_data && "phone" in customer_data) {
        customer_data.phone = formatPhoneNumber(customer_data.phone);
      }
      const order_items_data = body["line_items"].map((item) =>
        extract(item, item_data_keys)
      );
      throw new Error("This is a testing error");
      const order = await Order.create({
        ...order_data,
        chanel_id: chanel.id,
        brand_id: chanel.brand_id,
        data: JSON.stringify(body),
      });
      let customer;
      if (customer_data && "phone" in customer_data) {
        customer = await Customer.findOne({
          where: { phone: customer_data?.phone },
        });
      }
      if (!customer) {
        customer = await order.createCustomer(customer_data);
      }
      await order.setCustomer(customer);
      const address = await order.createAddress(address_data);
      await address.setCustomer(customer.id);
      const items = await OrderItem.bulkCreate(order_items_data);
      await order.addItems(items);

      return sendSuccessResponse(res, 201, {}, "Order created successfully");
    } catch (error) {
      logger.error(error.message, {
        data: req.body,
      });
      return sendErrorResponse(
        res,
        500,
        "Could not perform operation at this time, kindly try again later.",
        error
      );
    }
  },

  async create(req, res) {
    try {
      const {
        addressId,
        customerId,
        first_name,
        last_name,
        email,
        phone,
        note,
        address1,
        address2,
        city,
        chanel_id,
        brand_id,
        zip,
        province,
        items: itemsArray,
        payments: paymentsArray,
      } = req.body || {};
      const orderItems = [];
      let subtotal_price = 0,
        total_discount = 0,
        withoutDiscount = 0;
      let customerWithDuplicateOrders = null;
      if (customerId) {
        const itemsId = itemsArray.map((item) => item.id);
        customerWithDuplicateOrders = await Customer.findByPk(customerId, {
          include: {
            model: Order,
            include: {
              model: OrderItem,
              as: "items",
              where: {
                product_id: itemsId,
              },
            },
          },
        });
        console.log(
          "previous order found!",
          customerWithDuplicateOrders.Orders.length
        );
      }

      for (const item of itemsArray) {
        const {
          id,
          name,
          unit,
          price,
          quantity,
          discount,
          sku,
          grams,
          reason,
        } = item || {};
        orderItems.push({
          product_id: id,
          name,
          price,
          total_discount: discount,
          quantity,
          sku,
          grams,
          reason,
        });
        total_discount += (discount / 100) * unit;
        subtotal_price += price * quantity;
        withoutDiscount += unit * quantity;
      }
      const total_tax = 0;
      const total_price = subtotal_price + total_tax;
      const order = await Order.create({
        chanel_id,
        brand_id,
        user_id: req.user.id,
        status: "Assigned",
        subtotal_price: withoutDiscount.toFixed(2),
        total_price: total_price.toFixed(2),
        total_tax,
        total_discounts: total_discount.toFixed(2),
        order_number: Math.random().toString().split(".")[1].slice(0, 4),
      });
      if (paymentsArray && paymentsArray.length) {
        const payments = await Payments.bulkCreate(paymentsArray);
        await order.addPayments(payments);
      }
      const address = await order.createAddress({
        address1,
        address2,
        city,
        zip,
        province,
        country: "Pakistan",
        country_code: "PK",
      });
      let customer;
      if (customerId) {
        customer = await order.setCustomer(customerId);
        await address.setCustomer(customerId);
      } else {
        customer = await order.createCustomer({
          first_name,
          last_name,
          note,
          email,
          phone: formatPhoneNumber(phone),
        });
        await address.setCustomer(customer.id);
      }
      const items = await OrderItem.bulkCreate(orderItems);
      await order.addItems(items);
      await order.reload();
      // remove agent assignment, update status to delete, add proper remarks.
      if (customerWithDuplicateOrders) {
        const duplicateOrders = [];
        customerWithDuplicateOrders.Orders.forEach((order) => {
          if (order.status !== "Confirmed" && order.status !== "Cancel") {
            duplicateOrders.push(order.id);
          }
        });
        if (duplicateOrders.length) {
          await Order.update(
            {
              user_id: null,
              status: "Deleted",
              remarks: `This order was deleted by system due to duplication. New order id that replace this order is ${
                order.id
              } and created by user(id) ${
                req.user.id
              } at ${new Date().toLocaleString()}`,
            },
            {
              where: {
                id: {
                  [Op.in]: duplicateOrders,
                },
              },
            }
          );
        }
      }
      let orderWithoutData = order.dataValues;
      delete orderWithoutData.data;
      return sendSuccessResponse(
        res,
        201,
        { order: orderWithoutData },
        "Order created successfully"
      );
    } catch (error) {
      return sendErrorResponse(
        res,
        500,
        "Could not perform operation at this time, kindly try again later.",
        error
      );
    }
  },

  async import(req, res) {
    try {
      const json = await excelToJson(req.file.buffer);
      const orderWithoutIds = json.map(
        ({ id, updated_at, created_at, ...rest }) => rest
      );
      await Order.bulkCreate(orderWithoutIds);
      return sendSuccessResponse(res, 200, {}, "Orders imported successfully!");
    } catch (error) {
      console.error(error);
      return sendErrorResponse(
        res,
        500,
        "Could not perform operation at this time, kindly try again later.",
        e
      );
    }
  },

  async updateStatus(req, res) {
    try {
      const { orderId, status, reason, remarks } = req.body;
      if (status === "Cancel" && !reason) {
        return sendErrorResponse(
          res,
          402,
          "To cancel order you need to add reson for cancelation!"
        );
      }
      const order = await Order.findByPk(orderId);
      if (!order) {
        return sendErrorResponse(res, 404, "No data found with this id.");
      }
      if (order.status === "Confirmed") {
        return sendErrorResponse(
          res,
          409,
          `This order is already confirmed, you can't set its status to ${status}`
        );
      }

      await order.update({
        status,
        remarks: remarks || order.remarks,
        cancel_reason: reason || order.cancel_reason,
      });
      return sendSuccessResponse(res, 200, {}, "Operation successful");
    } catch (error) {
      console.error(error);
      return sendErrorResponse(
        res,
        500,
        "Could not perform operation at this time, kindly try again later.",
        error
      );
    }
  },

  async book(req, res) {
    try {
      const { orderId, service } = req.body;
      const order = await Order.findByPk(orderId, {
        attributes: {
          exclude: [
            "data",
            "CustomerId",
            "updatedAt",
            "customer_id",
            "user_id",
          ],
        },
        include: [
          {
            model: User,
            as: "user",
            attributes: {
              exclude: [
                "password",
                "status",
                "settings",
                "createdAt",
                "updatedAt",
              ],
            },
          },
          {
            model: Customer,
            as: "customer",
          },
          {
            model: Address,
            as: "address",
            attributes: {
              exclude: [
                "order_id",
                "customer_id",
                "CustomerId",
                "OrderId",
                "company",
                "longitude",
                "latitude",
                "country_code",
                "province_code",
              ],
            },
          },
          {
            model: OrderItem,
            as: "items",
            attributes: {
              exclude: ["OrderId", "createdAt", "updatedAt"],
            },
          },
        ],
      });
      if (!order) {
        return sendErrorResponse(res, 404, "No data found with this id.");
      }
      if (order.status === "Booked") {
        return sendErrorResponse(res, 400, "Order already booked!");
      }
      const bookingService = new BookingService();
      const bookingResponse = bookingService.bookParcelWithCourier(
        service,
        order
      );
      const { cn, slip, isSuccess, error, response } = bookingResponse || {};
      console.log(response, "response from courier service");
      if (isSuccess) {
        await order.createDelivery({
          courier: service,
          cn,
          slip_link: slip,
          status: "Booked",
        });
        await order.update({ status: "Booked" });
      }
      return sendSuccessResponse(res, 200, {}, "Operation successful");
    } catch (error) {
      console.error(error);
      return sendErrorResponse(
        res,
        500,
        "Could not perform operation at this time, kindly try again later.",
        error
      );
    }
  },

  async deliveryStatus(req, res) {
    try {
      const id = req.params.id;
      const order = await Order.findByPk(id);
      const delivery = await order.getDelivery();
      console.log(delivery);
      const bookingService = new BookingService();
      const courierService = bookingService.getCourierService(delivery.courier);
      const trackResponse = courierService.checkParcelStatus(delivery.cn);
      console.log(trackResponse);
      return sendSuccessResponse(
        res,
        200,
        { deliveryStatus: trackResponse },
        "Operation successful"
      );
    } catch (error) {
      console.error(error);
      return sendErrorResponse(
        res,
        500,
        "Could not perform operation at this time, kindly try again later.",
        error
      );
    }
  },

  async update(req, res) {
    try {
      const id = req.params.id;
      const {
        addressId,
        customerId,
        first_name,
        last_name,
        email,
        phone,
        note,
        address1,
        address2,
        city,
        zip,
        province,
        chanel_id,
        brand_id,
        items: itemsArray,
      } = req.body || {};
      const orderItems = [];
      let subtotal_price = 0;
      for (const item of itemsArray) {
        const { id, name, price, quantity, sku, grams } = item || {};
        orderItems.push({ id, name, price, quantity, sku, grams });
        subtotal_price += price * quantity;
      }
      const total_tax = 0,
        total_discounts = 0;
      const total_price = subtotal_price + total_tax;
      const order = await Order.findByPk(id);
      if (!order) {
        return sendErrorResponse(res, 404, "No data found with this id.");
      }
      await order.update(
        {
          chanel_id,
          brand_id,
          user_id: req.user.id,
          subtotal_price,
          total_price,
          total_tax,
          total_discounts,
        },
        { where: { id } }
      );
      await Customer.update(
        {
          first_name,
          last_name,
          email,
          phone,
          note,
        },
        { where: { id: customerId } }
      );
      await Address.update(
        {
          address1,
          address2,
          city,
          zip,
          province,
        },
        { where: { id: addressId } }
      );
      await Promise.all(
        itemsArray.map((i) =>
          OrderItem.update({ ...i }, { where: { id: i.id } })
        )
      );
      await order.reload({
        attributes: {
          exclude: [
            "data",
            "CustomerId",
            "updatedAt",
            "customer_id",
            "user_id",
          ],
        },
        include: [
          {
            model: User,
            as: "user",
            attributes: {
              exclude: [
                "password",
                "status",
                "settings",
                "createdAt",
                "updatedAt",
              ],
            },
          },
          {
            model: Customer,
            as: "customer",
          },
          {
            model: Address,
            as: "address",
            attributes: {
              exclude: [
                "order_id",
                "customer_id",
                "CustomerId",
                "OrderId",
                "company",
                "longitude",
                "latitude",
                "country_code",
                "province_code",
              ],
            },
          },
          {
            model: OrderItem,
            as: "items",
            attributes: {
              exclude: ["OrderId", "createdAt", "updatedAt"],
            },
          },
        ],
      });
      return sendSuccessResponse(
        res,
        200,
        {
          order,
        },
        "Operation successful."
      );
    } catch (e) {
      console.error(e);
      return sendErrorResponse(
        res,
        500,
        "Could not perform operation at this time, kindly try again later.",
        e
      );
    }
  },

  async destroy(req, res) {
    try {
      const id = req.params.id;
      const order = await Order.findByPk(id);
      if (order) {
        await order.destroy();
        return sendSuccessResponse(
          res,
          200,
          {},
          `Order with id ${id} has been deleted successful.`
        );
      }
      return sendErrorResponse(res, 404, "No data found with this id.");
    } catch (e) {
      console.error(e);
      return sendErrorResponse(
        res,
        500,
        "Could not perform operation at this time, kindly try again later.",
        e
      );
    }
  },

  async bulkDestroy(req, res) {
    const t = await sequelize.transaction();
    try {
      const body = req.body;
      const orderIds = body.orderIds;
      await Payments.destroy(
        {
          where: {
            order_id: orderIds,
          },
        },
        { transaction: t }
      );
      await Order.destroy(
        {
          where: {
            id: orderIds,
          },
        },
        { transaction: t }
      );
      await t.commit();
      return sendSuccessResponse(res, 200, {}, "Orders deleted successful.");
    } catch (error) {
      await t.rollback();
      return sendErrorResponse(
        res,
        500,
        "Could not perform operation at this time, kindly try again later.",
        error
      );
    }
  },
};
