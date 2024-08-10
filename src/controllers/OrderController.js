import { Op } from "sequelize";
import { sequelize } from "../models/index";
import model from "../models";
import { sendErrorResponse, sendSuccessResponse } from "../utils/sendResponse";
import { extract } from "../utils/extract";
import excelToJson from "../helpers/excelToJson";
import formatPhoneNumber from "../helpers/formatPhone";
import { getStartOfDay, getEndOfDay } from "../helpers/pgDateFormat";
import {
  PERMISSIONS,
  order_data_keys,
  address_data_keys,
  customer_data_keys,
  item_data_keys,
  FILTER_COLUMNS,
} from "../constants/constants";
import logger from "../middleware/logger";
import { _orderService } from "../services/OrderService";

const {
  Order,
  OrderItem,
  Customer,
  Address,
  User,
  Chanel,
  Payments,
  Delivery,
  OrderHistory,
} = model;

const FILTER_OP = {
  "Is empty": Op.eq,
  "Is not empty": Op.ne,
  "Text contains": Op.iRegexp,
  "Text does not contain": Op.notIRegexp,
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
  "Text is any": Op.in,
  "Text not in": Op.notIn,
};

export default {
  async orders(req, res) {
    try {
      const { page, pageSize, filters, sort } = req.body;
      const permissions = req.user.permissions;
      const today = new Date();
      let query = {
        where: {
          user_id: req.user.id,
          assigned_at: {
            [Op.and]: [
              { [Op.gte]: getStartOfDay(today) },
              { [Op.lte]: getEndOfDay(today) },
            ],
          },
        },
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name"],
          },
          {
            model: Customer,
            as: "customer",
            attributes: ["id", "first_name", "last_name", "phone"],
          },
          {
            model: OrderItem,
            as: "items",
            attributes: ["id", "name", "quantity"],
          },
          {
            model: Chanel,
            as: "chanel",
            attributes: ["id", "name"],
          },
          {
            model: Payments,
            as: "payments",
            attributes: {
              exclude: ["order_id", "updatedAt"],
            },
          },
          {
            model: Delivery,
            as: "delivery",
            attributes: {
              exclude: ["slip_link", "createdAt", "updatedAt", "order_id"],
            },
          },
          {
            model: Address,
            as: "address",
            attributes: ["id", "name", "phone", "city", "address1"],
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
        order: [["assignedAt", "ASC"]],
      };
      if (pageSize > -1) {
        query.limit = pageSize;
        if (page > -1) {
          query.offset = page * pageSize;
        }
      }
      if (sort && sort.length) {
        const order = sort.map((s) => [`${s.field}`, s.sort.toUpperCase()]);
        query.order = order;
      }
      if (permissions.includes(PERMISSIONS.PERMISSION_VIEW_ALL_ORDERS)) {
        delete query.where.user_id;
        delete query.where.assigned_at;
      }

      // else if (
      //   "settings" in req.user &&
      //   req.user?.settings?.hasOwnProperty("default_brand_id")
      // ) {
      //   query.where.brand_id = req.user.settings.default_brand_id;
      // } else if ("brands" in req.user) {
      //   query.where.brand_id = req.user?.brands[0]?.id;
      // }

      if (filters.length) {
        let _filters = {};
        for (let i = 0; i < filters.length; i++) {
          const { column, op, value } = filters[i];
          if (FILTER_COLUMNS[column] in _filters) {
            const previousFilter = _filters[FILTER_COLUMNS[column]];
            delete _filters[FILTER_COLUMNS[column]];
            _filters = {
              [Op.and]: [
                {
                  [FILTER_COLUMNS[column]]: previousFilter,
                },
                {
                  [FILTER_COLUMNS[column]]: { [FILTER_OP[op]]: value },
                },
              ],
              ..._filters,
            };
          } else {
            _filters = {
              [FILTER_COLUMNS[column]]: { [FILTER_OP[op]]: value },
              ..._filters,
            };
          }
          if (column === FILTER_COLUMNS.status && value[0] === "No Pick") {
            delete query.where.user_id;
          }
          // if (
          //   FILTER_COLUMNS[column] in _filters &&
          //   !Array.isArray(_filters[FILTER_COLUMNS[column]])
          // ) {
          //   const filterValues = filters
          //     .filter((filter) => filter.column === column)
          //     .map((filter) => filter.value);
          //   _filters[FILTER_COLUMNS[column]] = filterValues;
          // } else if (!(FILTER_COLUMNS[column] in _filters)) {
          //   _filters[FILTER_COLUMNS[column]] = {
          //     [FILTER_OP[op]]: value,
          //   };
          // }
        }
        const _query = { ...query, where: { ...query.where, ..._filters } };
        query = _query;
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
      const orderExisted = await Order.findByPk(id, { raw: true });
      if (!orderExisted) {
        return sendErrorResponse(res, 404, "No data found with this id.");
      }
      const order = await _orderService.loadFullOrder(id);
      if (order) {
        await _orderService.addDuplicateOrder(order);
      }
      return sendSuccessResponse(res, 200, { order });
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
      const address_data = extract(body["shipping_address"], address_data_keys);
      const customer_data = extract(body["customer"], customer_data_keys);
      if (
        customer_data &&
        "phone" in customer_data &&
        customer_data.phone !== null
      ) {
        customer_data.phone = formatPhoneNumber(customer_data.phone);
      }
      const order_items_data = body["line_items"].map((item) =>
        extract(item, item_data_keys)
      );
      let order = await Order.create({
        ...order_data,
        chanel_id: chanel?.id,
        brand_id: chanel?.brand_id,
        data: JSON.stringify(body),
      });
      if (
        customer_data &&
        "phone" in customer_data &&
        (customer_data.phone == null || customer_data.phone == "")
      ) {
        customer_data.phone = address_data.phone;
      }
      let customer;
      if (
        customer_data &&
        "phone" in customer_data &&
        customer_data.phone !== null
      ) {
        customer = await Customer.findOne({
          where: { phone: customer_data?.phone },
          raw: true,
        });
      }
      if (!customer) {
        const cus = { shopify_id: customer_data.id, ...customer_data };
        delete cus.id;
        customer = await order.createCustomer(cus);
      }
      await order.setCustomer(customer.id);
      const address = await order.createAddress(address_data);
      await address.setCustomer(customer.id);
      const items = await OrderItem.bulkCreate(order_items_data);
      await order.addItems(items);
      await order.createHistory({ event: "order create via shopify web hook" });
      order = await _orderService.loadFullOrder(order.id);
      await _orderService.checkOrderDuplication(order);
      return sendSuccessResponse(res, 201, {}, "Order created successfully");
    } catch (error) {
      logger.error(error.message, {
        data: req.body,
        stack: error.stack,
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
        // addressId,
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
        status,
        items: itemsArray,
        payments: paymentsArray,
      } = req.body || {};
      const orderItems = [];
      let subtotal_price = 0,
        total_discount = 0,
        withoutDiscount = 0;
      // let customerWithDuplicateOrders = null;
      // if (customerId) {
      //   const itemsId = itemsArray.map((item) => item.id);
      //   customerWithDuplicateOrders = await Customer.findByPk(customerId, {
      //     include: {
      //       model: Order,
      //       as: "orders",
      //       include: {
      //         model: OrderItem,
      //         as: "items",
      //         where: {
      //           product_id: itemsId,
      //         },
      //       },
      //     },
      //   });
      // }

      const orderExistFromCustomer =
        await _orderService.findSameDayOrderByPhone(phone);
      if (orderExistFromCustomer) {
        const { status } = orderExistFromCustomer;
        if (status === "Confirmed") {
          return sendErrorResponse(
            res,
            500,
            "Order from this customer already confirmed!",
            null,
            orderExistFromCustomer.get()
          );
        }
      }

      for (const item of itemsArray) {
        const {
          product_id,
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
          product_id,
          name,
          price,
          unit_price: unit,
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
      const subTotalWithTax = subtotal_price + total_tax;
      let pendingPayments = 0,
        receivedPayments = 0;
      if (paymentsArray && paymentsArray.length) {
        paymentsArray.forEach(({ type, amount }) => {
          switch (type) {
            case "received":
              receivedPayments += amount;
              break;
            case "pending":
              pendingPayments += amount;
              break;
          }
        });
      }
      const total_price = subTotalWithTax + pendingPayments - receivedPayments;
      const order = await Order.create({
        chanel_id,
        brand_id,
        user_id: req.user.id,
        status,
        assignedAt: new Date().toISOString(),
        subtotal_price: withoutDiscount.toFixed(2),
        total_price: total_price.toFixed(2),
        total_tax,
        total_discounts: total_discount.toFixed(2),
        order_number: Math.random().toString().split(".")[1].slice(0, 4),
      });
      if (paymentsArray && paymentsArray.length) {
        await Payments.bulkCreate(
          paymentsArray.map((payment) => ({ ...payment, order_id: order.id }))
        );
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
        await order.setCustomer(customerId);
        await address.setCustomer(customerId);
      } else {
        if (phone) {
          customer = await Customer.findOne({
            where: {
              phone: formatPhoneNumber(phone),
            },
          });
          if (!customer) {
            customer = await Customer.create({
              first_name,
              last_name,
              note,
              email,
              phone: formatPhoneNumber(phone),
            });
          }
        }
        await order.setCustomer(customer.id);
        await address.setCustomer(customer.id);
      }
      const items = await OrderItem.bulkCreate(orderItems);
      await order.addItems(items);
      await order.reload();
      await order.createHistory({
        event: "order created",
        user_id: req.user.id,
      });
      if (orderExistFromCustomer) {
        const { status } = orderExistFromCustomer;
        let existedOrderUpdateData = {
          tags: "Duplicate,",
          status: "Duplicate",
        };
        if (status === "Assigned") {
          existedOrderUpdateData = {
            ...existedOrderUpdateData,
            user_id: null,
            assignedAt: null,
          };
        }
        await orderExistFromCustomer.update(existedOrderUpdateData);
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
      console.log(error.stack, "error stack");
      return sendErrorResponse(
        res,
        500,
        "Could not perform operation at this time, kindly try again later.",
        error
      );
    }
  },

  async importOrders(req, res) {
    try {
      const { chanel_id } = req.body;
      const json = await excelToJson(req.file.buffer);
      console.log(json.length, "json.length");
      if (!json.length) {
        return sendErrorResponse(res, 500, "File is empty.");
      }
      const chanel = await Chanel.findByPk(chanel_id);
      const brand_id = chanel.brand_id || null;

      // console.log(json);
      // return;

      const orders = json.map(
        ({
          ID,
          Page,
          Account,
          Name,
          Address,
          City,
          Quantity,
          Product,
          Price,
          SKU,
          ...rest
        }) => {
          const created_at = rest["created at"];
          const phone = rest["Phone Number"];
          const items = [
            {
              product_id: null,
              name: Product,
              price: Price,
              total_discount: 0,
              quantity: parseInt(Quantity),
              sku: SKU,
              grams: null,
              reason: null,
            },
          ];
          const address = {
            address1: Address,
            address2: null,
            city: City,
            zip: null,
            province: null,
            country: "Pakistan",
            country_code: "PK",
          };
          const customer = { phone: formatPhoneNumber(phone), name: Name };
          const order = {
            chanel_id: parseInt(chanel_id),
            brand_id,
            user_id: null,
            status: "Received",
            subtotal_price: Price,
            total_price: Price,
            total_tax: 0,
            total_discounts: 0,
            order_number: ID,
            created_at,
            updated_at: created_at,
            data: JSON.stringify({
              ID,
              Page,
              Account,
              Name,
              Address,
              City,
              Quantity,
              ...rest,
            }),
          };
          return { order, items, address, customer };
        }
      );
      await Promise.all(
        orders.map((order) =>
          _orderService.createSubmissionOrder(order, req.user.id)
        )
      );
      return sendSuccessResponse(res, 200, {}, "Orders imported successfully!");
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

  async updateStatus(req, res) {
    try {
      const { orderId, status, reason, remarks } = req.body;
      if (status === "Cancel" && !reason) {
        return sendErrorResponse(
          res,
          402,
          "To cancel order you need to add reason for cancelation!"
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
      const ud = {
        status,
        remarks: remarks || order.remarks,
        cancel_reason: reason || order.cancel_reason,
      };
      if (status === "Duplicate") {
        ud["assignedAt"] = null;
        ud["user_id"] = null;
      }
      if ((order.status = "No Pick" && status === "Confirmed")) {
        ud = {
          ...ud,
          assignedAt: new Date().toISOString(),
          user_id: req.user.id,
        };
      }
      await order.update(ud);
      await order.createHistory({
        event: `order status updated to ${status}. ${
          remarks && "remarks:" + remarks
        }, ${reason && "cancel reason:" + reason}`,
        user_id: req.user.id,
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

  async addItemInOrder(req, res) {
    try {
      const { orderId, items } = req.body;
      if (!orderId || (items && items.length < 1)) {
        return sendErrorResponse(res, 404, "No data found with this id.");
      }
      await Promise.all(
        items.map(async ({ id, name, quantity, price }) => {
          const existed = await OrderItem.findOne({
            where: { order_id: orderId, name: name },
          });
          if (existed) {
            await OrderItem.update(
              { quantity: existed.quantity + quantity },
              {
                where: {
                  id: existed.id,
                  order_id: orderId,
                },
              }
            );
            await OrderHistory.create({
              order_id: orderId,
              user_id: req.user.id,
              event: "order item quantity increased!",
            });
          } else {
            await OrderItem.create({
              name,
              quantity,
              price,
              product_id: id,
              order_id: orderId,
            });
            await OrderHistory.create({
              order_id: orderId,
              user_id: req.user.id,
              event: "new item added in order!",
            });
          }
          await Order.increment(["total_price", "subtotal_price"], {
            by: price * quantity,
            where: { id: orderId },
          });
        })
      );
      const order = await _orderService.loadFullOrder(orderId);
      return sendSuccessResponse(
        res,
        200,
        {
          order,
        },
        "Operation successful."
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
        remarks,
        payments,
        items: itemsArray,
      } = req.body || {};
      const order = await Order.findByPk(id);
      if (!order) {
        return sendErrorResponse(res, 404, "No data found with this id.");
      }
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
      let pendingPayments = 0,
        receivedPayments = 0;
      if (payments && payments.length) {
        payments.forEach(({ type, amount }) => {
          switch (type) {
            case "received":
              receivedPayments += amount;
              break;
            case "pending":
              pendingPayments += amount;
              break;
          }
        });
      }
      if (payments && payments.length) {
        await Payments.bulkCreate(
          payments.map((payment) => ({ ...payment, order_id: order.id }))
        );
      }
      await order.update(
        {
          chanel_id: chanel_id || order.chanel_id,
          brand_id: brand_id || order.brand_id,
          subtotal_price: subtotal_price - receivedPayments + pendingPayments,
          total_price: total_price - receivedPayments + pendingPayments,
          total_tax: total_tax || order.total_tax,
          total_discounts: total_discounts || order.total_discounts,
          remarks: remarks || order.remarks,
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
      await order.setItems([]);
      await OrderItem.destroy({ where: { order_id: order.id } });
      await OrderItem.bulkCreate(
        itemsArray.map((item) => {
          delete item.id;
          return { ...item, order_id: order.id };
        })
      );
      await order.createHistory({
        user_id: req.user.id,
        event: "order update",
      });
      const completeOrder = await _orderService.loadFullOrder(order.id);
      return sendSuccessResponse(
        res,
        200,
        {
          order: completeOrder,
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

  async updatePartial(req, res) {
    try {
      const orderId = req.params.id;
      const {
        status,
        customerId,
        first_name,
        last_name,
        phone,
        remarks,
        addressId,
        address,
        city,
      } = req.body;
      const order = await Order.findByPk(orderId, {
        attributes: {
          exclude: ["data"],
        },
      });
      if (!order) {
        return sendErrorResponse(res, 404, "Order not found!");
      }
      let customer;
      if (customerId) {
        await Customer.update(
          { first_name, last_name, phone },
          {
            where: {
              id: customerId,
            },
          }
        );
      } else {
        customer = await Customer.create({
          first_name,
          last_name,
          phone,
        });
      }
      if (addressId) {
        await Address.update(
          { address1: address, city },
          {
            where: {
              id: addressId,
            },
          }
        );
      } else {
        await Address.create({
          address1: address,
          city,
          order_id: orderId,
          customer_id: customerId || customer.id || null,
        });
      }
      let orderUpdateData = { status, remarks };
      if (customer) {
        orderUpdateData["customer_id"] = customer.id;
      }
      if (status === "Duplicate") {
        orderUpdateData["assignedAt"] = null;
        orderUpdateData["user_id"] = null;
      }
      if ((order.status = "No Pick" && status === "Confirmed")) {
        orderUpdateData = {
          ...orderUpdateData,
          assignedAt: new Date().toISOString(),
          user_id: req.user.id,
        };
      }
      await order.update(orderUpdateData);
      await order.createHistory({
        user_id: req.user.id,
        event: "order updated",
      });
      const completeOrder = await _orderService.loadFullOrder(order.id);
      return sendSuccessResponse(
        res,
        200,
        {
          order: completeOrder,
        },
        "Order updated successfully!"
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
      await OrderHistory.destroy(
        {
          where: {
            order_id: orderIds,
          },
        },
        { transaction: t }
      );
      await OrderItem.destroy(
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
