import { Op, QueryTypes, literal, fn, col, Sequelize } from 'sequelize';
import { sequelize } from '../models';
import model from '../models';
import { PERMISSIONS } from '../constants/constants';
import {
  CONFIRMED_LIST,
  CONFIRMED,
  GENERATED,
} from '../constants/orderStatuses';
const { Order, OrderItem, Delivery, User, Chanel, Role, Permission } = model;
class ReportingService {
  constructor() {}

  getAgentReport(startPeriod, endPeriod, reportBrand, reportChanel) {
    let where = {
      assigned_at: {
        [Op.gte]: startPeriod,
        [Op.lte]: endPeriod,
      },
      user_id: {
        [Op.ne]: null,
      },
    };
    if (reportBrand && reportBrand.length) {
      where['brand_id'] = {
        [Op.in]: reportBrand,
      };
    }

    if (reportChanel && reportChanel.length) {
      where['chanel_id'] = {
        [Op.in]: reportChanel,
      };
    }
    return Order.findAll({
      attributes: [
        'user_id',
        [
          fn(
            'SUM',
            literal(
              `CASE WHEN "Order"."status" IN ${GENERATED} THEN 1 ELSE 0 END`
            )
          ),
          'total',
        ],
        [
          fn(
            'SUM',
            literal(
              `CASE WHEN "Order"."status" IN ${CONFIRMED} THEN 1 ELSE 0 END`
            )
          ),
          'confirmed',
        ],
        [
          fn(
            'SUM',
            literal(
              'CASE WHEN "Order"."status" = \'Assigned\' THEN 1 ELSE 0 END'
            )
          ),
          'assigned',
        ],
        [
          fn(
            'SUM',
            literal(
              'CASE WHEN "Order"."status" = \'No Pick\' THEN 1 ELSE 0 END'
            )
          ),
          'no_pick',
        ],
        [
          fn(
            'SUM',
            literal(
              'CASE WHEN "Order"."status" = \'Payment Pending\' THEN 1 ELSE 0 END'
            )
          ),
          'payment_pending',
        ],
        [
          fn(
            'SUM',
            literal('CASE WHEN "Order"."status" = \'Cancel\' THEN 1 ELSE 0 END')
          ),
          'cancel',
        ],
      ],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name'],
        },
      ],
      where,
      group: ['Order.user_id', 'user.id'],
    });
  }

  getUnitReport(startPeriod, endPeriod, reportBrand, reportChanel) {
    let where = {
      assigned_at: {
        [Op.gte]: startPeriod,
        [Op.lte]: endPeriod,
      },
      user_id: {
        [Op.ne]: null,
      },
    };
    if (reportBrand && reportBrand.length) {
      where['brand_id'] = {
        [Op.in]: reportBrand,
      };
    }

    if (reportChanel && reportChanel.length) {
      where['chanel_id'] = {
        [Op.in]: reportChanel,
      };
    }
    return Order.findAll({
      attributes: [
        [col('items.name'), 'name'],
        // [
        //   fn(
        //     'COUNT',
        //     literal(
        //       `DISTINCT CASE WHEN "Order"."status" IN ${GENERATED} THEN "Order"."id" ELSE NULL END`
        //     )
        //   ),
        //   'generated',
        // ],
        // [
        //   fn(
        //     'COUNT',
        //     literal(
        //       `DISTINCT CASE WHEN "Order"."status" IN ${CONFIRMED} THEN "Order"."id" ELSE NULL END`
        //     )
        //   ),
        //   'confirmed',
        // ],
        [
          fn(
            'SUM',
            literal(
              `CASE WHEN "Order"."status" IN ${GENERATED} THEN "items"."quantity" ELSE 0 END`
            )
          ),
          'unit_generated',
        ],
        [
          fn(
            'SUM',
            literal(
              `CASE WHEN "Order"."status" IN ${CONFIRMED} THEN "items"."quantity" ELSE 0 END`
            )
          ),
          'unit_confirmed',
        ],
        // [
        //   fn(
        //     'SUM',
        //     literal(
        //       `CASE WHEN "Order"."status" IN ${BOOKED} THEN "items"."quantity" ELSE 0 END`
        //     )
        //   ),
        //   'unit_booked',
        // ],
        [
          fn(
            'SUM',
            literal(
              'CASE WHEN "Order"."status" = \'No Pick\' THEN "items"."quantity" ELSE 0 END'
            )
          ),
          'unit_no_pick',
        ],
        [
          fn(
            'SUM',
            literal(
              'CASE WHEN "Order"."status" = \'Cancel\' THEN "items"."quantity" ELSE 0 END'
            )
          ),
          'unit_cancel',
        ],
        // [
        //   fn(
        //     'SUM',
        //     literal(
        //       `CASE WHEN "delivery"."courier" = 'postex' THEN "items"."quantity" ELSE 0 END`
        //     )
        //   ),
        //   'postex',
        // ],
        // [
        //   fn(
        //     'SUM',
        //     literal(
        //       `CASE WHEN "delivery"."courier" = 'tcs' THEN "items"."quantity" ELSE 0 END`
        //     )
        //   ),
        //   'tcs',
        // ],
        // [
        //   fn(
        //     'SUM',
        //     literal(
        //       `CASE WHEN "delivery"."courier" = 'trax' THEN "items"."quantity" ELSE 0 END`
        //     )
        //   ),
        //   'trax',
        // ],
        // [
        //   fn(
        //     'SUM',
        //     literal(
        //       `CASE WHEN "delivery"."courier" = 'deawoo' THEN "items"."quantity" ELSE 0 END`
        //     )
        //   ),
        //   'deawoo',
        // ],
        // [
        //   fn(
        //     'SUM',
        //     literal(
        //       `CASE WHEN "delivery"."courier" = 'leopard' THEN "items"."quantity" ELSE 0 END`
        //     )
        //   ),
        //   'leapard',
        // ],
        // [
        //   fn(
        //     'SUM',
        //     literal(
        //       `CASE WHEN "delivery"."courier" = 'callcourier' THEN "items"."quantity" ELSE 0 END`
        //     )
        //   ),
        //   'callcourier',
        // ],
        // [
        //   fn(
        //     'SUM',
        //     literal(
        //       `CASE WHEN "delivery"."courier" = 'mnp' THEN "items"."quantity" ELSE 0 END`
        //     )
        //   ),
        //   'mnp',
        // ],
        // [
        //   fn(
        //     'SUM',
        //     literal(
        //       `CASE WHEN "delivery"."courier" = 'manual' THEN "items"."quantity" ELSE 0 END`
        //     )
        //   ),
        //   'manual',
        // ],
      ],
      include: [
        {
          model: OrderItem,
          as: 'items',
          attributes: [],
        },
        {
          model: Delivery,
          as: 'delivery',
          attributes: [],
        },
      ],
      where,
      group: ['items.name'],
      raw: true,
    });
  }
  getFOCReport(startPeriod, endPeriod, reportBrand, reportChanel) {
    return sequelize.query(
      `select
      oi.name,
      count(oi.name) as foc,
      sum(case when d."courier" = 'callcourier' then oi."quantity" else 0 end) as callcourier,
      sum(case when d."courier" = 'trax' then oi."quantity" else 0 end) as trax,
      sum(case when d."courier" = 'tcs' then oi."quantity" else 0 end) as tcs,
      sum(case when d."courier" = 'deawoo' then oi."quantity" else 0 end) as deawoo,
      sum(case when d."courier" = 'leopard' then oi."quantity" else 0 end) as leopard,
      sum(case when d."courier" = 'postex' then oi."quantity" else 0 end) as postex,
      sum(case when d."courier" = 'mnp' then oi."quantity" else 0 end) as mnp,
      sum(case when d."courier" = 'manual' then oi."quantity" else 0 end) as manual
    from
      "OrderItems" oi
    join "Deliveries" d on
      d.order_id = oi.order_id
    join "Orders" o on 
      o.id = oi.order_id 
    where
      oi.price = 0
      and d."createdAt" >= :startPeriod
      and d."createdAt" <= :endPeriod
      ${
        reportChanel && reportChanel.length
          ? 'and o.chanel_id in (:reportChanel)'
          : ''
      }
      ${
        reportBrand && reportBrand.length
          ? 'and o.brand_id in (:reportBrand)'
          : ''
      }
    group by
      oi.name;`,
      {
        replacements: { startPeriod, endPeriod, reportChanel, reportBrand },
        type: QueryTypes.SELECT,
      }
    );
  }

  getBookingUnitReport(startPeriod, endPeriod, reportBrand, reportChanel) {
    let where = {
      '$delivery.createdAt$': {
        [Op.gte]: startPeriod,
        [Op.lte]: endPeriod,
      },
    };
    if (reportBrand && reportBrand.length) {
      where['brand_id'] = {
        [Op.in]: reportBrand,
      };
    }

    if (reportChanel && reportChanel.length) {
      where['chanel_id'] = {
        [Op.in]: reportChanel,
      };
    }
    return Order.findAll({
      attributes: [
        [col('items.name'), 'name'],
        [
          fn(
            'SUM',
            literal(
              `CASE WHEN "Order"."status" IN ${GENERATED} THEN 1 ELSE 0 END`
            )
          ),
          'generated',
        ],
        [
          fn(
            'SUM',
            literal(
              `CASE WHEN "Order"."status" IN ${CONFIRMED} THEN 1 ELSE 0 END`
            )
          ),
          'confirmed',
        ],
        [
          fn(
            'SUM',
            literal(
              `CASE WHEN "Order"."status" IN ${GENERATED} THEN "items"."quantity" ELSE 0 END`
            )
          ),
          'unit_generated',
        ],
        [
          fn(
            'SUM',
            literal(
              `CASE WHEN "Order"."status" IN ${CONFIRMED}  THEN "items"."quantity" ELSE 0 END`
            )
          ),
          'unit_confirmed',
        ],
        [
          fn(
            'SUM',
            literal(
              'CASE WHEN  "Order"."status" = \'Booked\' OR "delivery"."status" IS NOT NULL THEN "items"."quantity" ELSE 0 END'
            )
          ),
          'unit_booked',
        ],
        [
          fn(
            'SUM',
            literal(
              'CASE WHEN  "Order"."status" = \'Booking Error\' THEN "items"."quantity" ELSE 0 END'
            )
          ),
          'unit_booking_error',
        ],
        [
          fn(
            'SUM',
            literal(
              'CASE WHEN "Order"."status" = \'No Pick\' THEN "items"."quantity" ELSE 0 END'
            )
          ),
          'unit_no_pick',
        ],
        [
          fn(
            'SUM',
            literal(
              'CASE WHEN "Order"."status" = \'Cancel\' THEN "items"."quantity" ELSE 0 END'
            )
          ),
          'unit_cancel',
        ],
        [
          fn(
            'SUM',
            literal(
              `CASE WHEN "delivery"."status" != 'Booking Error' AND "delivery"."courier" = 'postex' THEN "items"."quantity" ELSE 0 END`
            )
          ),
          'postex',
        ],
        [
          fn(
            'SUM',
            literal(
              `CASE WHEN "delivery"."status" != 'Booking Error' AND "delivery"."courier" = 'tcs' THEN "items"."quantity" ELSE 0 END`
            )
          ),
          'tcs',
        ],
        [
          fn(
            'SUM',
            literal(
              `CASE WHEN "delivery"."status" != 'Booking Error' AND "delivery"."courier" = 'trax' THEN "items"."quantity" ELSE 0 END`
            )
          ),
          'trax',
        ],
        [
          fn(
            'SUM',
            literal(
              `CASE WHEN "delivery"."status" != 'Booking Error' AND "delivery"."courier" = 'deawoo' THEN "items"."quantity" ELSE 0 END`
            )
          ),
          'deawoo',
        ],
        [
          fn(
            'SUM',
            literal(
              `CASE WHEN "delivery"."status" != 'Booking Error' AND "delivery"."courier" = 'leopard' THEN "items"."quantity" ELSE 0 END`
            )
          ),
          'leopard',
        ],
        [
          fn(
            'SUM',
            literal(
              `CASE WHEN "delivery"."status" != 'Booking Error' AND "delivery"."courier" = 'callcourier' THEN "items"."quantity" ELSE 0 END`
            )
          ),
          'callcourier',
        ],
        [
          fn(
            'SUM',
            literal(
              `CASE WHEN "delivery"."status" != 'Booking Error' AND "delivery"."courier" = 'mnp' THEN "items"."quantity" ELSE 0 END`
            )
          ),
          'mnp',
        ],
        [
          fn(
            'SUM',
            literal(
              `CASE WHEN "delivery"."status" != 'Booking Error' AND "delivery"."courier" = 'digi' THEN "items"."quantity" ELSE 0 END`
            )
          ),
          'digi',
        ],
        [
          fn(
            'SUM',
            literal(
              `CASE WHEN "delivery"."status" != 'Booking Error' AND "delivery"."courier" = 'manual' THEN "items"."quantity" ELSE 0 END`
            )
          ),
          'manual',
        ],
      ],
      include: [
        {
          model: OrderItem,
          as: 'items',
          required: true,
          attributes: [],
        },
        {
          model: Delivery,
          as: 'delivery',
          required: true,
          attributes: [],
        },
      ],
      where,
      group: ['items.name'],
      raw: true,
    });
  }

  getChannelReport(startPeriod, endPeriod, reportBrand, reportChanel) {
    let where = {
      assigned_at: {
        [Op.gte]: startPeriod,
        [Op.lte]: endPeriod,
      },
      user_id: {
        [Op.ne]: null,
      },
    };
    if (reportBrand && reportBrand.length) {
      where['brand_id'] = {
        [Op.in]: reportBrand,
      };
    }
    if (reportChanel && reportChanel.length) {
      where['chanel_id'] = {
        [Op.in]: reportChanel,
      };
    }
    return Order.findAll({
      attributes: [
        [col('chanel.name'), 'chanel'],
        [col('user.name'), 'agent'],
        // [fn('COUNT', col('Order.id')), 'orders'],
        [
          fn(
            'COUNT',
            literal(
              `DISTINCT CASE WHEN "Order"."status" IN ${GENERATED} THEN "Order"."id" ELSE NULL END`
            )
          ),
          'orders',
        ],
        [
          fn(
            'COUNT',
            literal(
              `DISTINCT CASE WHEN "Order"."status" IN ${CONFIRMED} THEN "Order"."id" ELSE NULL END`
            )
          ),
          'confirmed',
        ],
        [
          fn(
            'COUNT',
            literal(
              'DISTINCT CASE WHEN "Order"."status" = \'No Pick\' THEN "Order"."id" ELSE NULL END'
            )
          ),
          'no_pick',
        ],
        [
          fn(
            'COUNT',
            literal(
              'DISTINCT CASE WHEN "Order"."status" = \'Cancel\' THEN "Order"."id" ELSE NULL END'
            )
          ),
          'cancel',
        ],
        [
          fn(
            'SUM',
            literal(
              `CASE WHEN "Order"."status" IN ${GENERATED} THEN "items"."quantity" ELSE 0 END`
            )
          ),
          'unit_generated',
        ],
        [
          fn(
            'SUM',
            literal(
              `CASE WHEN "Order"."status" IN ${CONFIRMED} THEN "items"."quantity" ELSE 0 END`
            )
          ),
          'unit_confirmed',
        ],
      ],
      include: [
        {
          model: Chanel,
          as: 'chanel',
          attributes: [],
        },
        {
          model: OrderItem,
          as: 'items',
          attributes: [],
        },
        {
          model: User,
          as: 'user',
          attributes: [],
        },
      ],
      where,
      group: ['Order.chanel_id', 'chanel.name', 'user.name'],
      raw: true,
    });
  }

  async getIncentiveReport(startPeriod, endPeriod, reportBrand, reportChanel) {
    let where = {
      assigned_at: {
        [Op.gte]: startPeriod,
        [Op.lte]: endPeriod,
      },
      user_id: {
        [Op.ne]: null,
      },
      status: {
        [Op.in]: CONFIRMED_LIST,
      },
    };
    if (reportBrand && reportBrand.length) {
      where['brand_id'] = {
        [Op.in]: reportBrand,
      };
    }

    if (reportChanel && reportChanel.length) {
      where['chanel_id'] = {
        [Op.in]: reportChanel,
      };
    }
    const users = await User.findAll({
      attributes: ['id', 'name'],
      include: {
        model: Role,
        as: 'roles',
        through: {
          attributes: [],
        },
        required: true,
        include: [
          {
            as: 'permissions',
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
    const columns = [[col('items.name'), 'name']];
    for (let index = 0; index < users.length; index++) {
      const user = users[index];
      columns.push(
        [
          fn(
            'SUM',
            literal(
              `CASE WHEN "Order"."user_id" = ${user.id} AND "Order"."status" IN ${CONFIRMED} THEN "items"."quantity" ELSE 0 END`
            )
          ),
          `${user.name.toLowerCase().split(' ').join('_')}_confirmed`,
        ],
        [
          fn(
            'SUM',
            literal(
              `CASE WHEN "Order"."user_id" = ${user.id} AND "Order"."status" = 'Delivered' THEN "items"."quantity" ELSE 0 END`
            )
          ),
          `${user.name.toLowerCase().split(' ').join('_')}_delivered`,
        ]
      );
    }

    return Order.findAll({
      attributes: columns,
      include: [
        {
          model: OrderItem,
          as: 'items',
          attributes: [],
        },
        {
          model: User,
          as: 'user',
          attributes: [],
        },
      ],
      where,
      group: ['items.name'],
      raw: true,
    });
  }
}

export const _reportingService = new ReportingService();
