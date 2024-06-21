import { Sequelize, Op, literal, fn } from "sequelize";
import model from "../models";
import moment from "moment";
const { Order, OrderItem, Delivery, User } = model;

class ReportingService {
  constructor() {}

  async getAgentReport(startPeriod, endPeriod) {
    return Order.findAll({
      attributes: [
        "user_id",
        [Sequelize.fn("COUNT", Sequelize.col("Order.id")), "total"],
        [
          Sequelize.fn(
            "SUM",
            Sequelize.literal(
              'CASE WHEN "Order"."status" = \'Confirmed\' THEN 1 ELSE 0 END'
            )
          ),
          "confirmed",
        ],
        [
          Sequelize.fn(
            "SUM",
            Sequelize.literal(
              'CASE WHEN "Order"."status" = \'No Pick\' THEN 1 ELSE 0 END'
            )
          ),
          "no_pick",
        ],
        [
          Sequelize.fn(
            "SUM",
            Sequelize.literal(
              'CASE WHEN "Order"."status" = \'Cancel\' THEN 1 ELSE 0 END'
            )
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
      where: {
        assignedAt: {
          [Op.gte]: startPeriod,
          [Op.lte]: endPeriod,
        },
        user_id: {
          [Op.ne]: null,
        },
      },
      group: ["Order.user_id", "user.id"],
    });
  }

  async getUnitReport(startPeriod, endPeriod) {
    return OrderItem.findAll({
      attributes: [
        "name",
        [Sequelize.fn("COUNT", Sequelize.col("OrderItem.id")), "generated"],
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
      where: {
        "$order.created_at$": {
          [Op.gte]: startPeriod,
          [Op.lte]: endPeriod,
        },
      },
      group: ["name"],
    });
  }
}

export const _reportingService = new ReportingService();
