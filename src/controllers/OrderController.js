import model from "../models";
import { sendErrorResponse, sendSuccessResponse } from "../utils/sendResponse";
import { extract } from "../utils/extract";
import excelToJson from "../helpers/excelToJson";
const { Order, OrderItem } = model;

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

export default {
  async orders(req, res) {
    try {
      const orders = await Order.findAll({
        limit: 30,
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["data", "CustomerId", "updatedAt"],
        },
      });
      return sendSuccessResponse(res, 200, { orders });
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
      const role = await Order.findByPk(id);
      if (role) {
        const permissions = await role.getPermissions();
        const data = {
          id: role.id,
          name: role.name,
          permissions: permissions.map((p) => p.name),
        };
        return sendSuccessResponse(res, 200, { role: data });
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
      const order_data = extract(body, order_data_keys);
      const address_data = extract(body["billing_address"], address_data_keys);
      const customer_data = extract(body["customer"], customer_data_keys);
      const order_items_data = body["line_items"].map((item) =>
        extract(item, item_data_keys)
      );

      const order = await Order.create({
        ...order_data,
        data: JSON.stringify(body),
      });
      const customer = await order.createCustomer(customer_data);
      await customer.createAddress(address_data);
      const items = await OrderItem.bulkCreate(order_items_data);
      await order.addOrderItems(items);
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

  async create(req, res) {
    try {
      const {
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
        items: itemsArray,
      } = req.body || {};
      const orderItems = [];
      let subtotal_price = 0;
      for (const item of itemsArray) {
        const { id, name, price, quantity } = item || {};
        orderItems.push({ name, price, quantity });
        subtotal_price += price * quantity;
      }
      const total_tax = 0,
        total_discounts = 0;
      const total_price = subtotal_price + total_tax;
      const order = await Order.create({
        subtotal_price,
        total_price,
        total_tax,
        total_discounts,
        order_number: Math.random().toString().split(".")[1],
      });
      const customer = await order.createCustomer({
        first_name,
        last_name,
        note,
        email,
        phone,
      });
      await customer.createAddress({
        address1,
        address2,
        city,
        zip,
        province,
        country: "Pakistan",
        country_code: "PK",
      });
      const items = await OrderItem.bulkCreate(orderItems);
      await order.addOrderItems(items);
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

  async update(req, res) {
    try {
      const id = req.params.id;
      const { permissions } = req.body;
      const role = await Order.findByPk(id);
      if (!role) {
        return sendErrorResponse(res, 404, "No data found with this id.");
      }
      if (permissions && permissions.length) {
        const exitingPermission = await role.getPermissions();
        await role.removePermissions(exitingPermission.map((p) => p.id));
        await role.addPermissions(permissions);
      }
      const newPermissions = await role.getPermissions();
      return sendSuccessResponse(
        res,
        200,
        {
          role: {
            ...role.dataValues,
            permissions: newPermissions.map((p) => p.name),
          },
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
      const role = await Order.findByPk(id);
      if (role) {
        await role.destroy();
        return sendSuccessResponse(res, 200, {}, "Operation successful.");
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
};
