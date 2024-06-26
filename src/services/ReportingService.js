import { Sequelize, Op, literal, fn, col } from "sequelize";
import model from "../models";
const { Order, OrderItem, Delivery, User, Chanel } = model;

class ReportingService {
  constructor() {}

  async getAgentReport(startPeriod, endPeriod, reportBrand) {
    let where = {
      assignedAt: {
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
        [fn("COUNT", col("Order.id")), "total"],
        [
          fn(
            "SUM",
            literal(
              'CASE WHEN "Order"."status" = \'Confirmed\' THEN 1 ELSE 0 END'
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

  async getUnitReport(startPeriod, endPeriod, reportBrand) {
    let where = {
      "$order.created_at$": {
        [Op.gte]: startPeriod,
        [Op.lte]: endPeriod,
      },
    };
    if (reportBrand && reportBrand !== "All") {
      where["$order.brand_id$"] = reportBrand;
    }
    return OrderItem.findAll({
      attributes: [
        "name",
        [fn("COUNT", col("OrderItem.id")), "generated"],
        [
          fn(
            "SUM",
            literal("CASE WHEN 'Order.status' = 'Confirmed' THEN 1 ELSE 0 END")
          ),
          "confirmed",
        ],
        [
          fn(
            "SUM",
            literal("CASE WHEN 'Order.status' = 'Cancel' THEN 1 ELSE 0 END")
          ),
          "cancel",
        ],
        [
          fn(
            "SUM",
            literal("CASE WHEN 'Order.status' = 'No Pick' THEN 1 ELSE 0 END")
          ),
          "no_pick",
        ],
        [
          fn(
            "SUM",
            literal("CASE WHEN 'Delivery.courier' = 'postex' THEN 1 ELSE 0 END")
          ),
          "postex",
        ],
        [
          fn(
            "SUM",
            literal("CASE WHEN 'Delivery.courier' = 'tcs' THEN 1 ELSE 0 END")
          ),
          "tcs",
        ],
        [
          fn(
            "SUM",
            literal("CASE WHEN 'Delivery.courier' = 'deawoo' THEN 1 ELSE 0 END")
          ),
          "deawoo",
        ],
        [
          fn(
            "SUM",
            literal("CASE WHEN 'Delivery.courier' = 'trax' THEN 1 ELSE 0 END")
          ),
          "trax",
        ],
        [
          fn(
            "SUM",
            literal(
              "CASE WHEN 'Delivery.courier' = 'leapard' THEN 1 ELSE 0 END"
            )
          ),
          "leapard",
        ],
        [
          fn(
            "SUM",
            literal(
              "CASE WHEN 'Delivery.courier' = 'callcourier' THEN 1 ELSE 0 END"
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
            },
          ],
        },
      ],
      where,
      group: ["name"],
    });
  }

  async getChannelReport(startPeriod, endPeriod, reportBrand) {
    let where = {
      created_at: {
        [Op.gte]: startPeriod,
        [Op.lte]: endPeriod,
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
