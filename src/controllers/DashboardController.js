import sequelize from "sequelize";
import model from "../models";
import { sendErrorResponse, sendSuccessResponse } from "../utils/sendResponse";

const Op = sequelize.Op;
const { Order, OrderItem } = model;

export default {
  async stats(req, res) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const orders = await Order.findAll({
        attributes: ["id", "status", "total_price"],
        include: [
          {
            model: OrderItem,
            as: "items",
            attributes: {
              exclude: ["OrderId", "createdAt", "updatedAt"],
            },
          },
        ],
        where: {
          createdAt: {
            [Op.gte]: today,
          },
        },
      });
      const totalOrders = orders.length;
      let confirmedOrders = 0,
        bookedOrders = 0,
        totalSalesValue = 0,
        ordersGroupedByItem = {};
      for (let index = 0; index < orders.length; index++) {
        const order = orders[index];
        const items = order.items;
        for (let index = 0; index < items.length; index++) {
          const item = items[index];
          if (ordersGroupedByItem[item.name] === undefined) {
            ordersGroupedByItem[item.name] = {
              name: item.name + (item.sku ? ` (${item.sku})` : ""),
              generated: item.quantity || 0,
              confirmed: order.status === "Confirmed" ? 1 : 0,
            };
          } else {
            ordersGroupedByItem[item.name] = {
              ...ordersGroupedByItem[item.name],
              generated:
                ordersGroupedByItem[item.name].generated + item.quantity,
              confirmed:
                order.status === "Confirmed"
                  ? ordersGroupedByItem[item.name].confirmed + 1
                  : ordersGroupedByItem[item.name].confirmed,
            };
          }
        }
        totalSalesValue += order.total_price || 0;
        if (order.status == "Confirmed") {
          confirmedOrders++;
        }
        if (order.status == "Booked") {
          bookedOrders++;
        }
      }
      const response = {
        totalOrders,
        confirmedOrders,
        bookedOrders,
        totalSalesValue,
        ordersByItem: Object.values(ordersGroupedByItem),
      };
      return sendSuccessResponse(
        res,
        201,
        { stats: response },
        "All registered users"
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
};
