import { Op, QueryTypes, literal, fn, col } from "sequelize";
import { sequelize } from "../models";
import model from "../models";
const { Order, OrderItem, Delivery, User, Chanel } = model;

class ReportingService {
  constructor() {}

  async getAgentReport(startPeriod, endPeriod, reportBrand) {
    let where = {
      assigned_at: {
        [Op.gte]: startPeriod,
        [Op.lte]: endPeriod,
      },
      user_id: {
        [Op.ne]: null,
      },
    };
    if (reportBrand && reportBrand !== "All") {
      where["brand_id"] = reportBrand;
    }
    return Order.findAll({
      attributes: [
        "user_id",
        // [fn("COUNT", col("Order.id")), "total"],
        [
          fn(
            "SUM",
            literal(
              'CASE WHEN "Order"."status" != \'Duplicate\' THEN 1 ELSE 0 END'
            )
          ),
          "total",
        ],
        [
          fn(
            "SUM",
            literal(
              'CASE WHEN "Order"."status" = \'Confirmed\' OR "Order"."status" = \'Booked\' THEN 1 ELSE 0 END'
            )
          ),
          "confirmed",
        ],
        [
          fn(
            "SUM",
            literal(
              'CASE WHEN "Order"."status" = \'No Pick\' OR "Order"."status" = \'Payment Pending\' THEN 1 ELSE 0 END'
            )
          ),
          "no_pick",
        ],
        [
          fn(
            "SUM",
            literal('CASE WHEN "Order"."status" = \'Cancel\' THEN 1 ELSE 0 END')
          ),
          "cancel",
        ],
      ],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name"],
        },
      ],
      where,
      group: ["Order.user_id", "user.id"],
    });
  }

  getUnitReport(startPeriod, endPeriod, reportBrand) {
    return OrderItem.findAll({
      attributes: [
        "name",
        [sequelize.fn("SUM", sequelize.col("quantity")), "generated"],
      ],
      include: [
        {
          model: Order,
          as: "order",
          // where: {
          //   order_date: {
          //     [Op.eq]: new Date().toISOString().split("T")[0], // Today's date
          //   },
          // },
        },
      ],
      group: ["name", "order.id"],
    });
  }

  getUnitReport(startPeriod, endPeriod, reportBrand) {
    let where = {
      "$order.assigned_at$": {
        [Op.gte]: startPeriod,
        [Op.lte]: endPeriod,
      },
      "$order.user_id$": {
        [Op.ne]: null,
      },
    };
    if (reportBrand && reportBrand !== "All") {
      where["$order.brand_id$"] = reportBrand;
    }
    return OrderItem.findAll({
      attributes: [
        "name",
        [fn("SUM", col("quantity")), "generated"],
        [
          fn(
            "SUM",
            literal(
              `CASE WHEN "order"."status" = 'Confirmed' OR "order"."status" = 'Booked' THEN "OrderItem"."quantity" ELSE 0 END`
            )
          ),
          "confirmed",
        ],
        [
          fn(
            "SUM",
            literal(
              `CASE WHEN "order"."status" = 'Cancel' THEN "OrderItem"."quantity" ELSE 0 END`
            )
          ),
          "cancel",
        ],
        [
          fn(
            "SUM",
            literal(
              `CASE WHEN "order"."status" = 'No Pick' THEN "OrderItem"."quantity" ELSE 0 END`
            )
          ),
          "no_pick",
        ],
        [
          fn(
            "SUM",
            literal(
              `CASE WHEN "order->delivery"."courier" = 'postex' THEN "OrderItem"."quantity" ELSE 0 END`
            )
          ),
          "postex",
        ],
        [
          fn(
            "SUM",
            literal(
              `CASE WHEN "order->delivery"."courier" = 'tcs' THEN "OrderItem"."quantity" ELSE 0 END`
            )
          ),
          "tcs",
        ],
        [
          fn(
            "SUM",
            literal(
              `CASE WHEN "order->delivery"."courier" = 'trax' THEN "OrderItem"."quantity" ELSE 0 END`
            )
          ),
          "trax",
        ],
        [
          fn(
            "SUM",
            literal(
              `CASE WHEN "order->delivery"."courier" = 'deawoo' THEN "OrderItem"."quantity" ELSE 0 END`
            )
          ),
          "deawoo",
        ],
        [
          fn(
            "SUM",
            literal(
              `CASE WHEN "order->delivery"."courier" = 'leapard' THEN "OrderItem"."quantity" ELSE 0 END`
            )
          ),
          "leapard",
        ],
        [
          fn(
            "SUM",
            literal(
              `CASE WHEN "order->delivery"."courier" = 'callcourier' THEN "OrderItem"."quantity" ELSE 0 END`
            )
          ),
          "callcourier",
        ],
      ],
      include: [
        {
          model: Order,
          as: "order",
          attributes: [],
          include: [
            {
              model: Delivery,
              as: "delivery",
              attributes: [],
              required: false,
            },
          ],
        },
      ],
      where,
      group: ["OrderItem.name"],
    });
  }

  async getChannelReport(startPeriod, endPeriod, reportBrand) {
    let where = {
      assigned_at: {
        [Op.gte]: startPeriod,
        [Op.lte]: endPeriod,
      },
      user_id: {
        [Op.ne]: null,
      },
    };
    if (reportBrand && reportBrand !== "All") {
      where["brand_id"] = reportBrand;
    }

    return Order.findAll({
      attributes: [
        [col("chanel.name"), "chanel"],
        [col("user.name"), "agent"],
        [fn("COUNT", col("Order.id")), "orders"],
        [
          fn(
            "SUM",
            literal(
              'CASE WHEN "Order"."status" = \'Confirmed\' OR "Order"."status" = \'Booked\' THEN 1 ELSE 0 END'
            )
          ),
          "confirmed",
        ],
        [
          fn(
            "SUM",
            literal(
              'CASE WHEN "Order"."status" = \'No Pick\' THEN 1 ELSE 0 END'
            )
          ),
          "no_pick",
        ],
        [
          fn(
            "SUM",
            literal('CASE WHEN "Order"."status" = \'Cancel\' THEN 1 ELSE 0 END')
          ),
          "cancel",
        ],
        [fn("SUM", col("items.quantity")), "units"],
      ],
      include: [
        {
          model: Chanel,
          as: "chanel",
          attributes: [],
        },
        {
          model: OrderItem,
          as: "items",
          attributes: [],
        },
        {
          model: User,
          as: "user",
          attributes: [],
        },
      ],
      where,
      group: ["Order.chanel_id", "chanel.name", "user.name"],
      raw: true,
    });
  }
}

export const _reportingService = new ReportingService();
