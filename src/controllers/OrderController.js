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
import getNameFromSubmissionLink, {
  getSizeAndPrice,
} from "../helpers/getNameFromLink";
import orderService from "../services/OrderService";

const {
  Order,
  OrderItem,
  Customer,
  Address,
  User,
  Chanel,
  Payments,
  Brand,
  DeliveryServiceAccounts,
  Delivery,
  OrderHistory,
} = model;

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
  "name",
  "phone",
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
  "id",
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

function parseValue(value, type) {
  switch (type) {
    case "string":
      return value || null;
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
  customer: { column: "$customer.first_name$", type: "string" },
  phone: { column: "$customer.phone$", type: "string" },
  agent: { column: "$user.name$", type: "string" },
  address: { column: "$address.address1$", type: "string" },
  city: { column: "$address.city$", type: "string" },
  total_price: { column: "total_price", type: "number" },
  total_tax: { column: "total_tax", type: "number" },
  total_discounts: { column: "total_discounts", type: "number" },
  createdAt: { column: "createdAt", type: "date" },
  chanel: { column: "$chanel.name$", type: "string" },
};

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
};

export default {
  async orders(req, res) {
    try {
      const { page, pageSize, filters, sort } = req.body;
      const permissions = req.user.permissions;
      const query = {
        where: {
          user_id: req.user.id,
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
            model: Chanel,
            as: "chanel",
            attributes: ["id", "name"],
          },
          {
            model: Address,
            as: "address",
            attributes: ["name", "phone", "city", "address1"],
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
      if (pageSize > -1) {
        query.limit = pageSize;
        if (page > -1) {
          query.offset = page * pageSize;
        }
      }
      if (sort && sort.length) {
        const order = sort.map((s) => [s.field, s.sort.toUpperCase()]);
        query.order = [order];
      }
      if (permissions.includes(PERMISSIONS.PERMISSION_VIEW_ALL_ORDERS)) {
        delete query.where.user_id;
      } else if (
        "settings" in req.user &&
        req.user?.settings?.hasOwnProperty("default_brand_id")
      ) {
        query.where.brand_id = req.user.settings.default_brand_id;
      } else if ("brands" in req.user) {
        query.where.brand_id = req.user?.brands[0]?.id;
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
            [FILTER_OP[op]]: value || null,
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
          exclude: ["data"],
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
            model: OrderHistory,
            as: "history",
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
      const order = await Order.create({
        ...order_data,
        chanel_id: chanel?.id,
        brand_id: chanel?.brand_id,
        data: JSON.stringify(body),
      });
      let customer;
      if (
        customer_data &&
        "phone" in customer_data &&
        customer_data.phone !== null
      ) {
        customer = await Customer.findOne({
          where: { phone: customer_data?.phone },
        });
      }
      if (!customer) {
        const cus = { shopify_id: customer_data.id, ...customer_data };
        delete cus.id;
        if (cus.phone === null) {
          cus.phone = address_data.phone;
        }
        customer = await order.createCustomer(cus);
      }
      await order.setCustomer(customer);
      const address = await order.createAddress(address_data);
      await address.setCustomer(customer.id);
      const items = await OrderItem.bulkCreate(order_items_data);
      await order.addItems(items);
      await order.createHistory({ event: "order create via shopify web hook" });
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
      await order.createHistory({
        event: "order created",
        user_id: req.user.id,
      });
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
          await Promise.all(
            duplicateOrders.map((orderId) =>
              OrderHistory.create({
                order_id: orderId,
                event:
                  "order status updated to deleted by system due to duplication",
              })
            )
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

  async importOrders(req, res) {
    try {
      const { submission, chanel_id } = req.body;
      const json = await excelToJson(req.file.buffer);
      if (!json.length) {
        return sendErrorResponse(res, 500, "File is empty.");
      }
      const chanel = await Chanel.findByPk(chanel_id);
      const brand_id = chanel.brand_id || null;
      if (submission && submission == "true") {
        const orders = json.map(
          ({ ID, Page, Account, Name, Address, City, Quantity, ...rest }) => {
            const created_at = rest["created at"];
            const sizeText = rest["Size: "];
            const phone = rest["Phone Number"];
            const { name, abri } = getNameFromSubmissionLink(Page.formula);
            const { price, size } = getSizeAndPrice(sizeText);
            const items = [
              {
                product_id: null,
                name: name || abri,
                price,
                total_discount: 0,
                quantity: parseInt(Quantity),
                sku: `${abri}-${size}`,
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
              status: "Submission",
              subtotal_price: price,
              total_price: price,
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
            orderService.createSubmissionOrder(order, req.user.id)
          )
        );
        return sendSuccessResponse(
          res,
          200,
          {},
          "Orders imported successfully!"
        );
      }
      return sendErrorResponse(
        res,
        500,
        "Only bulk order can create via submission files."
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

      await order.update({
        status,
        remarks: remarks || order.remarks,
        cancel_reason: reason || order.cancel_reason,
      });
      await order.createHistory({
        event: `order status updated to ${status}, remarks: ${remarks}, cancel reason: ${reason}`,
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

  async book(req, res) {
    try {
      const { orderId, accountId } = req.body;
      const deliveryAccount = await DeliveryServiceAccounts.findByPk(
        accountId,
        { raw: true }
      );
      if (!deliveryAccount) {
        return sendErrorResponse(res, 404, "No account found with this id");
      }
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
            model: Customer,
            as: "customer",
          },
          {
            model: Brand,
            as: "brand",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
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
      const bookingResponse = await bookingService.bookParcelWithCourier(
        order,
        deliveryAccount
      );
      const { cn, slip, isSuccess, error, response } = bookingResponse || {};
      console.log(bookingResponse, "bookingResponse");
      if (isSuccess) {
        await Delivery.findOrCreate({
          where: {
            order_id: order.id,
          },
          defaults: {
            courier: deliveryAccount.service,
            account_id: deliveryAccount.id,
            cn,
            slip_link: slip,
            status: "Booked",
          },
        });
        await order.update({ status: "Booked" });
        await order.createHistory({
          user_id: req.user.id,
          event: `order booked with ${deliveryAccount.service}`,
        });
        await Brand.update(
          { shipment_series: order.brand.shipment_series + 1 },
          {
            where: {
              id: order.brand.id,
            },
          }
        );
        return sendSuccessResponse(res, 200, {}, "Operation successful");
      }
      return sendErrorResponse(res, 500, error, response);
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

  async cancelBooking(req, res) {
    try {
      const orderId = req.params.id;
      const order = await Order.findByPk(orderId, {
        attributes: ["id", "status"],
      });
      if (!order || order.status !== "Booked") {
        return sendErrorResponse(res, 500, "Order is not in booking!");
      }
      const delivery = await Delivery.findOne({
        where: {
          order_id: order.id,
        },
        include: {
          model: DeliveryServiceAccounts,
          as: "account",
        },
      });
      if (!delivery) {
        return sendErrorResponse(
          res,
          500,
          "Delivery not found for this order!"
        );
      }
      const bookingService = new BookingService();
      const cancelBookingResponse =
        await bookingService.cancelBookingWithCourier(
          delivery.cn,
          delivery.account.get()
        );
      const { isSuccess, error, response } = cancelBookingResponse || {};
      console.log(cancelBookingResponse, "cancelBookingResponse");
      if (isSuccess) {
        await delivery.update({
          slip_link: "",
          status: "Booking Canceled",
          updatedAt: new Date().toISOString(),
        });
        await order.update({ status: "Booking Canceled" });
        await order.createHistory({
          user_id: req.user.id,
          event: "order booking cancel",
        });
        return sendSuccessResponse(res, 200, {}, "Operation successful");
      }
      return sendErrorResponse(res, 500, error, response);
    } catch (error) {
      return sendErrorResponse(res, 500, error);
    }
  },

  async deliveryStatus(req, res) {
    try {
      const orderId = req.params.id;
      const order = await Order.findByPk(orderId, {
        attributes: ["id", "status"],
      });
      if (!order || order.status !== "Booked") {
        return sendErrorResponse(res, 500, "Order is not in booking!");
      }
      const delivery = await Delivery.findOne({
        where: {
          order_id: order.id,
        },
        include: {
          model: DeliveryServiceAccounts,
          as: "account",
        },
      });
      if (!delivery) {
        return sendErrorResponse(
          res,
          500,
          "Delivery not found for this order!"
        );
      }
      const bookingService = new BookingService();
      const bookingStatusResponse =
        await bookingService.checkParcelStatusWithCourier(
          delivery?.cn,
          delivery?.account?.get()
        );
      const {
        isSuccess,
        data,
        history,
        status,
        date,
        remarks,
        error,
        response,
      } = bookingStatusResponse || {};
      console.log(bookingStatusResponse, "status response");
      if (isSuccess) {
        return sendSuccessResponse(
          res,
          200,
          { data, history, status, date, remarks, error, response },
          "Operation successful"
        );
      }
      return sendErrorResponse(res, 500, error, response);
    } catch (error) {
      logger.error(error);
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
      await order.createHistory({
        user_id: req.user.id,
        event: "order update",
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
        await order.createHistory({
          user_id: req.user.id,
          event: "order deleted",
        });
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
      await Promise.all(
        orderIds.map((id) =>
          OrderHistory.create({
            user_id: req.user.id,
            order_id: id,
            event: "order deleted via bulk order delete",
          })
        )
      );
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
