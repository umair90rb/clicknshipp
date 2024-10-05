import { Op, Sequelize } from 'sequelize';
import model from '../models';
import { sendErrorResponse, sendSuccessResponse } from '../utils/sendResponse';
import { subtractDaysFromToday } from '../helpers/pgDateFormat';
import formatPhone from '../helpers/formatPhone';
const { Customer, Address, Order, OrderItem, User } = model;

export default {
  async customers(req, res) {
    try {
      const { page, pageSize, sort } = req.body;
      const customers = await Customer.findAndCountAll({
        attributes: {
          include: [
            [
              Sequelize.literal(
                '(SELECT COUNT(*) FROM "Orders" o WHERE o.customer_id = "Customer"."id")'
              ),
              'totalOrders',
            ],
          ],
        },
        limit: pageSize,
        offset: page * pageSize,
        ...(sort.length
          ? {
              order: [sort.map((s) => [`${s.field}`, s.sort.toUpperCase()])],
            }
          : {}),
      });
      return sendSuccessResponse(res, 200, {
        customers: { ...customers, ...req.body },
      });
    } catch (e) {
      console.error(e);
      return sendErrorResponse(
        res,
        500,
        'Could not perform operation at this time, kindly try again later.',
        e
      );
    }
  },
  async customer(req, res) {
    try {
      const { id } = req.params;
      const customer = await Customer.findByPk(id, {
        include: [
          {
            model: Address,
            as: 'addresses',
            attributes: {
              exclude: ['CustomerId', 'latitude', 'longitude'],
            },
          },
          {
            model: Order,
            as: 'orders',
            include: [
              {
                model: OrderItem,
                as: 'items',
                attributes: ['name', 'quantity'],
              },
            ],
            attributes: ['id', 'total_price', 'total_discounts', 'createdAt'],
          },
        ],
      });
      if (customer) {
        return sendSuccessResponse(res, 200, {
          customer,
        });
      }
      return sendErrorResponse(res, 404, 'No data found with this id.');
    } catch (e) {
      console.error(e);
      return sendErrorResponse(
        res,
        500,
        'Could not perform operation at this time, kindly try again later.',
        e
      );
    }
  },

  async search(req, res) {
    const query = req.body;
    try {
      if ('phone' in query) {
        query.phone = formatPhone(query.phone);
      }
      let customer = await Customer.findOne({
        where: { ...query },
        include: {
          attributes: [
            'id',
            'order_number',
            'status',
            'createdAt',
            'remarks',
            'total_price',
          ],
          model: Order,
          as: 'orders',
          required: false,
          where: {
            createdAt: {
              [Op.gte]: subtractDaysFromToday(30),
            },
          },
          include: [
            {
              model: OrderItem,
              as: 'items',
            },
            {
              model: User,
              as: 'user',
              attributes: ['name'],
            },
          ],
        },
        order: [[{ model: Order, as: 'orders' }, 'createdAt', 'DESC']],
      });
      if (!customer) {
        return sendErrorResponse(res, 404, 'Customer not found!');
      }
      const address = await Address.findOne({
        attributes: ['id', 'address1', 'address2', 'city', 'zip', 'province'],
        where: { customer_id: customer.id },
      });
      return sendSuccessResponse(
        res,
        200,
        {
          ...customer.get(),
          address,
        },
        'Customer found.'
      );
    } catch (error) {
      return sendErrorResponse(
        res,
        500,
        'Could not perform operation at this time, kindly try again later.',
        error
      );
    }
  },

  //   async update(req, res) {
  //     try {
  //       const id = req.params.id;
  //       const { name, email, phone, password, roles } = req.body;
  //       const user = await User.findByPk(id, {
  //         include: [
  //           {
  //             model: Role,
  //             as: "roles",
  //             through: { attributes: [] },
  //           },
  //         ],
  //       });
  //       if (user) {
  //         user.set({
  //           email,
  //           name,
  //           phone,
  //           password: hash(password),
  //           updatedAt: new Date().toISOString(),
  //         });
  //         if (roles && roles.length) {
  //           const currentRoles = await user.getRoles();
  //           await user.removeRoles(currentRoles.map((r) => r.id));
  //           await user.addRoles(roles);
  //         }
  //         const newRoles = await user.getRoles();
  //         await user.save();
  //         return sendSuccessResponse(
  //           res,
  //           200,
  //           {
  //             user: {
  //               email: user.email,
  //               id: user.id,
  //               name: user.name,
  //               phone: user.phone,
  //               status: user.status,
  //               roles: newRoles,
  //             },
  //           },
  //           "Operation successful."
  //         );
  //       }
  //       return sendErrorResponse(res, 404, "No data found with this id.");
  //     } catch (e) {
  //       console.error(e);
  //       return sendErrorResponse(
  //         res,
  //         500,
  //         "Could not perform operation at this time, kindly try again later.",
  //         e
  //       );
  //     }
  //   },

  //   async destroy(req, res) {
  //     try {
  //       const id = req.params.id;
  //       const user = await User.findByPk(id);
  //       if (user) {
  //         //user deleted but not linked data e.g roles, permission onDelete 'cascade' not working yet
  //         await user.destroy();
  //         return sendSuccessResponse(res, 200, {}, "Operation successful.");
  //       }
  //       return sendErrorResponse(res, 404, "No data found with this id.");
  //     } catch (e) {
  //       console.error(e);
  //       return sendErrorResponse(
  //         res,
  //         500,
  //         "Could not perform operation at this time, kindly try again later.",
  //         e
  //       );
  //     }
  //   },
};
