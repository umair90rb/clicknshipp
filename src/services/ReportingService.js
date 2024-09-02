import { Op, QueryTypes, literal, fn, col } from "sequelize";
import { sequelize } from "../models";
import model from "../models";
import { PERMISSIONS } from "../constants/constants";
const { Order, OrderItem, Delivery, User, Chanel, Role, Permission } = model;

class ReportingService {
  constructor() {}

  getAgentReport(startPeriod, endPeriod, reportBrand) {
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
              'CASE WHEN "Order"."status" = \'Assigned\' THEN 1 ELSE 0 END'
            )
          ),
          "assigned",
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
        [col("items.name"), "name"],
        [fn("SUM", col("items.quantity")), "generated"],
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
        [
          fn(
            "SUM",
            literal(
              `CASE WHEN "delivery"."courier" = 'postex' THEN "items"."quantity" ELSE 0 END`
            )
          ),
          "postex",
        ],
        [
          fn(
            "SUM",
            literal(
              `CASE WHEN "delivery"."courier" = 'tcs' THEN "items"."quantity" ELSE 0 END`
            )
          ),
          "tcs",
        ],
        [
          fn(
            "SUM",
            literal(
              `CASE WHEN "delivery"."courier" = 'trax' THEN "items"."quantity" ELSE 0 END`
            )
          ),
          "trax",
        ],
        [
          fn(
            "SUM",
            literal(
              `CASE WHEN "delivery"."courier" = 'deawoo' THEN "items"."quantity" ELSE 0 END`
            )
          ),
          "deawoo",
        ],
        [
          fn(
            "SUM",
            literal(
              `CASE WHEN "delivery"."courier" = 'leapard' THEN "items"."quantity" ELSE 0 END`
            )
          ),
          "leapard",
        ],
        [
          fn(
            "SUM",
            literal(
              `CASE WHEN "delivery"."courier" = 'callcourier' THEN "items"."quantity" ELSE 0 END`
            )
          ),
          "callcourier",
        ],
      ],
      include: [
        {
          model: OrderItem,
          as: "items",
          attributes: [],
        },
        {
          model: Delivery,
          as: "delivery",
          attributes: [],
        },
      ],
      where,
      group: ["items.name"],
      raw: true,
    });
  }

  getChannelReport(startPeriod, endPeriod, reportBrand) {
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

  async getIncentiveReport(startPeriod, endPeriod, reportBrand) {
    let where = {
      assigned_at: {
        [Op.gte]: startPeriod,
        [Op.lte]: endPeriod,
      },
      user_id: {
        [Op.ne]: null,
      },
      status: {
        [Op.in]: ["Confirmed", "Booked"],
      },
    };
    if (reportBrand && reportBrand !== "All") {
      where["brand_id"] = reportBrand;
    }

    const users = await User.findAll({
      attributes: ["id", "name"],
      include: {
        model: Role,
        as: "roles",
        through: {
          attributes: [],
        },
        required: true,
        include: [
          {
            as: "permissions",
            model: Permission,
            required: true,
            where: { name: PERMISSIONS.PERMISSION_ASSIGN_ORDERS },
            through: {
              attributes: [],
            },
          },
        ],
      },
    });
    const columns = [[col("items.name"), "name"]];
    for (let index = 0; index < users.length; index++) {
      const user = users[index];
      columns.push(
        [
          fn(
            "SUM",
            literal(
              `CASE WHEN "Order"."user_id" = ${user.id} AND "Order"."status" IN ('Confirmed', 'Booked') THEN "items"."quantity" ELSE 0 END`
            )
          ),
          `${user.name.toLowerCase().split(" ").join("_")}_confirmed`,
        ],
        [
          fn(
            "SUM",
            literal(
              `CASE WHEN "Order"."user_id" = ${user.id} AND "Order"."status" = 'Booked' THEN "items"."quantity" ELSE 0 END`
            )
          ),
          `${user.name.toLowerCase().split(" ").join("_")}_delivered`,
        ]
      );
    }

    return Order.findAll({
      attributes: columns,
      // [
      //   [col("items.name"), "name"],
      //   [
      //     fn(
      //       "SUM",
      //       literal(
      //         'CASE WHEN "Order"."status" = \'Confirmed\' OR "Order"."status" = \'Booked\' THEN "items"."quantity" ELSE 0 END'
      //       )
      //     ),
      //     "confirmed",
      //   ],
      //   [
      //     fn(
      //       "SUM",
      //       literal(
      //         'CASE WHEN "Order"."status" = \'Booked\' THEN "items"."quantity" ELSE 0 END'
      //       )
      //     ),
      //     "delivered",
      //   ],
      // ],
      include: [
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
      group: ["items.name"],
      raw: true,
    });

    // return OrderItem.findAll({
    //   attributes: columns,
    //   include: [
    //     {
    //       model: Order,
    //       as: "order",
    //       attributes: [],
    //       include: {
    //         model: Chanel,
    //         as: "chanel",
    //         attributes: [["name", "chanel_name`"]],
    //       },
    //     },
    //   ],
    //   where,
    //   group: ["OrderItem.name", "quantity", "order.id", "order->chanel.id"],
    // });
  }
}

export const _reportingService = new ReportingService();
