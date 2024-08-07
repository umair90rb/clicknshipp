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

  async getUnitReport(startPeriod, endPeriod, reportBrand) {
    let query = `select
      "OrderItem"."name", "OrderItem"."quantity", "order"."status", "order->delivery"."courier",
      SUM("OrderItem"."quantity") as "generated",
      SUM(case when  	"order"."status" = 'Confirmed' or "order"."status" = 'Booked' then "OrderItem"."quantity" else 0 end) as "confirmed",
      SUM(case when 	"order"."status" = 'Cancel' then "OrderItem"."quantity" else 0 end) as "cancel",
      SUM(case when 	"order"."status" = 'No Pick' then "OrderItem"."quantity" else 0 end) as "no_pick",
      SUM(case when "order->delivery"."courier" = 'postex' then "OrderItem"."quantity" else 0 end) as "postex",
      SUM(case when "order->delivery"."courier" = 'tcs' then "OrderItem"."quantity" else 0 end) as "tcs",
      SUM(case when "order->delivery"."courier" = 'deawoo' then "OrderItem"."quantity" else 0 end) as "deawoo",
      SUM(case when "order->delivery"."courier" = 'trax' then "OrderItem"."quantity" else 0 end) as "trax",
      SUM(case when "order->delivery"."courier" = 'leapard' then "OrderItem"."quantity" else 0 end) as "leapard",
      SUM(case when "order->delivery"."courier" = 'callcourier' then "OrderItem"."quantity" else 0 end) as "callcourier"
    from
      "OrderItems" as "OrderItem"
    left outer join "Orders" as "order" on
      "OrderItem"."order_id" = "order"."id"
      and ("order"."deleted_at" is null)
    left outer join "Deliveries" as "order->delivery" on
      "order"."id" = "order->delivery"."order_id"
    where
      ("order"."assigned_at" >= :start
        and "order"."assigned_at" <= :end)
    group by
      "name", "quantity", "order"."status", "order->delivery"."courier"`;
    if (reportBrand && reportBrand !== "All") {
      query = `select
      "OrderItem"."name", "OrderItem"."quantity", "order"."status", "order->delivery"."courier",
      SUM("OrderItem"."quantity") as "generated",
      SUM(case when  	"order"."status" = 'Confirmed' or "order"."status" = 'Booked' then "OrderItem"."quantity" else 0 end) as "confirmed",
      SUM(case when 	"order"."status" = 'Cancel' then "OrderItem"."quantity" else 0 end) as "cancel",
      SUM(case when 	"order"."status" = 'No Pick' then "OrderItem"."quantity" else 0 end) as "no_pick",
      SUM(case when "order->delivery"."courier" = 'postex' then "OrderItem"."quantity" else 0 end) as "postex",
      SUM(case when "order->delivery"."courier" = 'tcs' then "OrderItem"."quantity" else 0 end) as "tcs",
      SUM(case when "order->delivery"."courier" = 'deawoo' then "OrderItem"."quantity" else 0 end) as "deawoo",
      SUM(case when "order->delivery"."courier" = 'trax' then "OrderItem"."quantity" else 0 end) as "trax",
      SUM(case when "order->delivery"."courier" = 'leapard' then "OrderItem"."quantity" else 0 end) as "leapard",
      SUM(case when "order->delivery"."courier" = 'callcourier' then "OrderItem"."quantity" else 0 end) as "callcourier"
    from
      "OrderItems" as "OrderItem"
    left outer join "Orders" as "order" on
      "OrderItem"."order_id" = "order"."id"
      and ("order"."deleted_at" is null)
    left outer join "Deliveries" as "order->delivery" on
      "order"."id" = "order->delivery"."order_id"
    where
      ("order"."assigned_at" >= :start
        and "order"."assigned_at" <= :end
        and "order"."brand_id" = :brand)
    group by
      "name", "quantity", "order"."status", "order->delivery"."courier"`;
    }
    return sequelize.query(query, {
      replacements: { start: startPeriod, end: endPeriod, brand: reportBrand },
      type: QueryTypes.SELECT,
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
