import sequelize from "sequelize";
import model from "../models";
import { sendErrorResponse, sendSuccessResponse } from "../utils/sendResponse";

const Op = sequelize.Op;
const { Order, OrderItem, Delivery } = model;

export default {
  async stats(req, res) {
    try {
      const { startPeriod, endPeriod } = req.query;
      console.log(startPeriod, endPeriod, "startPeriod, endPeriod");
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
          {
            model: Delivery,
            as: "delivery",
            attributes: { include: ["courier", "status", "order_id", "id"] },
          },
        ],
        where: {
          createdAt: {
            [Op.and]: {
              [Op.gte]: startPeriod,
              [Op.lte]: endPeriod,
            },
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
              confirmed: order.status === "Confirmed" || "Booked" ? 1 : 0,
              tcs: 0,
              callcourier: 0,
              deawoo: 0,
              trax: 0,
              postex: 0,
              leapard: 0,
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
          if (order.status === "Booked" && order.delivery !== null) {
            ordersGroupedByItem[item.name][order.delivery.courier] =
              ordersGroupedByItem[item.name][order.delivery.courier] + 1;
          }
        }
        totalSalesValue += order.total_price || 0;
        if (order.status == "Confirmed") {
          confirmedOrders++;
        }
        if (order.status == "Booked") {
          confirmedOrders++;
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
