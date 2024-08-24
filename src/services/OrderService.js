import formatPhone from "../helpers/formatPhone";
import {
  getEndOfDay,
  getStartOfDay,
  subtractDaysFromToday,
} from "../helpers/pgDateFormat";
import splitName from "../helpers/splitName";
import model from "../models";
import Sequelize, { Op } from "sequelize";
const {
  Order,
  OrderItem,
  Customer,
  Address,
  User,
  Chanel,
  Payments,
  Delivery,
  DeliveryServiceAccounts,
  OrderHistory,
  Tokens,
} = model;

class OrderService {
  async createSubmissionOrder(_order, userId) {
    try {
      const {
        order: orderData,
        items: itemsData,
        address: addressData,
        customer: customerData,
      } = _order;
      const order = await Order.create(orderData);
      const address = await order.createAddress(addressData);
      const nameObj = splitName(customerData.name);
      let [customer, created] = await Customer.findOrCreate({
        where: { phone: customerData.phone },
        defaults: {
          phone: customerData.phone,
          ...nameObj,
        },
      });
      if (!created) {
        await customer.update(nameObj);
      }
      await order.setCustomer(customer.id);
      await address.setCustomer(customer.id);
      const itemsArray = await OrderItem.bulkCreate(itemsData);
      await order.addItems(itemsArray);
      await order.createHistory({
        user_id: userId,
        event: "order created via submission file upload",
      });
      await order.reload();
      return order;
    } catch (error) {
      console.log(error, "error in create submission order in order service");
      return error.message;
    }
  }

  async loadFullOrder(id) {
    try {
      const order = await Order.findByPk(id, {
        attributes: {
          include: [["delivery_account_id", "courier"]],
          exclude: ["data", "CustomerId", "user_id", "chanel_id", "brand_id"],
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
            // include: {
            //   attributes: ["id", "order_number", "status"],
            //   model: Order,
            //   as: "orders",
            //   where: {
            //     status: ["Confirmed", "Booked"],
            //   },
            // },
          },
          {
            model: OrderHistory,
            as: "history",
          },
          {
            model: Payments,
            as: "payments",
            attributes: {
              exclude: ["order_id", "updatedAt"],
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
          {
            model: Delivery,
            as: "delivery",
            attributes: {
              exclude: ["slip_link", "createdAt", "updatedAt", "order_id"],
            },
          },
        ],
      });
      return order;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  loadTodayReadyForBookingOrders() {
    try {
      return Order.findAll({
        attributes: {
          exclude: ["data", "CustomerId", "user_id", "chanel_id", "brand_id"],
        },
        where: {
          status: "Confirmed",
          delivery_account_id: { [Op.ne]: null },
          assignedAt: {
            [Op.and]: [
              { [Op.lte]: getStartOfDay() },
              { [Op.gte]: getEndOfDay() },
            ],
          },
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
            model: Payments,
            as: "payments",
            attributes: {
              exclude: ["order_id", "updatedAt"],
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
          {
            model: Delivery,
            as: "delivery",
            attributes: {
              exclude: ["slip_link", "createdAt", "updatedAt", "order_id"],
            },
          },
          {
            model: DeliveryServiceAccounts,
            as: "courier",
            include: {
              model: Tokens,
              as: "tokens",
              attributes: ["token", "expiry", "type"],
            },
            attributes: {
              exclude: ["createdAt", "updatedAt", "order_id"],
            },
          },
        ],
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async addDuplicateOrder(order) {
    try {
      if (order) {
        const duplicate = await this.findDuplications(order);
        order.setDataValue("duplicate", duplicate);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async checkOrderDuplication(order) {
    try {
      if (order) {
        const duplicates = await this.findDuplications(order);
        if (duplicates && duplicates.length) {
          await order.update({ tags: "Duplicate" });
          duplicates.map(async (duplicate) => {
            const tags = (duplicate?.tags || "").split(",");
            if (!tags.includes("Duplicate")) {
              const tags =
                duplicate.tags && duplicate.tags.length
                  ? `Duplicate,${duplicate.tags}`
                  : "Duplicate";
              await duplicate.update({ tags });
            }
          });
        }
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async getOrderStats(chanel, brand, startPeriod, endPeriod) {
    try {
      const query = {
          attributes: [
            [Sequelize.fn("COUNT", Sequelize.col("Order.id")), "total"],
            [
              Sequelize.fn(
                "ARRAY_AGG",
                Sequelize.literal(
                  'CASE WHEN "Order"."user_id" IS NULL THEN "Order"."id" ELSE NULL END'
                )
              ),
              "unassigned",
            ],
            [
              Sequelize.fn(
                "ARRAY_AGG",
                Sequelize.literal(
                  '"Order"."id" FILTER (WHERE "Order"."user_id" IS NOT NULL)'
                )
              ),
              "assigned",
            ],
            [
              Sequelize.fn(
                "ARRAY_AGG",
                Sequelize.literal(
                  '"Order"."id" FILTER (WHERE "Order"."user_id" IS NOT NULL AND "Order"."status" = \'Assigned\')'
                )
              ),
              "assigned_not_confirmed",
            ],
          ],
        },
        where = {};
      if (chanel && chanel.length) {
        where["chanel_id"] = { [Op.in]: chanel };
      }
      if (brand && brand.length) {
        where["brand_id"] = { [Op.in]: brand };
      }
      if (startPeriod) {
        where["createdAt"] = { [Op.gte]: startPeriod };
      }
      if (endPeriod) {
        where["createdAt"] = { ...where["createdAt"], [Op.lte]: endPeriod };
      }
      if (Object.keys(where).length) {
        query["where"] = where;
      }
      const orders = await Order.findAll(query);
      return orders;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  findOrdersBy(
    tag,
    query,
    orderFields = ["id", "order_number", "status", "createdAt"]
  ) {
    try {
      const sqlQuery = {
        attributes: orderFields,
        where:
          tag === "Order Number"
            ? {
                order_number: query,
              }
            : undefined,
        include: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name"],
          },
          {
            model: Address,
            as: "address",
            attributes: ["address1", "city"],
          },
          {
            model: Customer,
            as: "customer",
            attributes: ["first_name", "last_name", "name"],
            where:
              tag === "Phone"
                ? {
                    phone: formatPhone(query),
                  }
                : undefined,
          },
          {
            model: OrderItem,
            as: "items",
            attributes: ["id", "name", "quantity"],
            where:
              tag === "Item"
                ? {
                    name: {
                      [Op.iLike]: query,
                    },
                  }
                : undefined,
          },
        ],
      };
      return Order.findAll(sqlQuery);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  findSameDayOrderByPhone(phone) {
    try {
      const sqlQuery = {
        attributes: ["id", "status", "createdAt"],
        where: {
          createdAt: {
            [Op.gt]: getStartOfDay(),
            [Op.lt]: getEndOfDay(new Date()),
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
            attributes: ["first_name", "last_name", "name", "phone"],
            where: {
              phone: formatPhone(phone),
            },
          },
          {
            model: OrderItem,
            as: "items",
            attributes: ["id", "name", "quantity"],
          },
        ],
      };
      return Order.findOne(sqlQuery);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async findDuplications(order) {
    try {
      if (
        order &&
        order.items &&
        order.items.length > 0 &&
        order.customer.phone
      ) {
        const duplicateOrderItemWhere = order.items.map((item) => ({
          [Op.and]: [
            { product_id: item?.product_id },
            { variant_id: item?.variant_id },
          ],
        }));
        return Order.findAll({
          attributes: ["id", "order_number", "status"],
          where: {
            id: {
              [Op.ne]: order.id,
            },
            createdAt: {
              [Op.gte]: subtractDaysFromToday(30),
            },
          },
          include: [
            {
              attributes: [],
              model: Customer,
              as: "customer",
              where: {
                phone: order?.customer?.phone || order?.address?.phone,
              },
            },
            {
              attributes: [],
              model: OrderItem,
              as: "items",
              where: duplicateOrderItemWhere,
            },
          ],
        });
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

export const _orderService = new OrderService();
