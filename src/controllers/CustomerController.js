import model from "../models";
import { sendErrorResponse, sendSuccessResponse } from "../utils/sendResponse";

const { Customer, Address } = model;

export default {
  async customers(req, res) {
    try {
      const customers = await Customer.findAll({ limit: 25 });
      return sendSuccessResponse(res, 200, { customers });
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
  async customer(req, res) {
    try {
      const { id } = req.params;
      const customer = await Customer.findByPk(id, {
        include: [
          {
            model: Address,
            as: "Addresses",
            attributes: {
              exclude: ["CustomerId", "latitude", "longitude"],
            },
          },
        ],
      });
      if (customer) {
        const orders = await customer.getOrders({
          attributes: [
            "id",
            "order_number",
            "total_price",
            "total_discounts",
            "createdAt",
            "total_tax",
            "subtotal_price",
          ],
        });
        return sendSuccessResponse(res, 200, {
          customer,
          orders,
        });
      }
      return sendErrorResponse(res, 404, "No data found with this id.");
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

  //   async create(req, res) {
  //     const { name, email, password, phone, roles } = req.body;
  //     try {
  //       let user = await User.findOne({
  //         where: { [Op.or]: [{ email }, { phone }] },
  //       });
  //       if (user) {
  //         return sendErrorResponse(
  //           res,
  //           422,
  //           "User with email or phone already exists."
  //         );
  //       }
  //       user = await User.create({
  //         email,
  //         password: hash(password),
  //         name,
  //         phone,
  //       });
  //       await user.addRoles(roles);
  //       const assignedRoles = await user.getRoles();
  //       return sendSuccessResponse(
  //         res,
  //         201,
  //         {
  //           user: {
  //             email: user.email,
  //             id: user.id,
  //             name: user.name,
  //             phone: user.phone,
  //             status: user.status,
  //             roles: assignedRoles.map((r) => ({ name: r.name, id: r.id })),
  //           },
  //         },
  //         "Account created successfully"
  //       );
  //     } catch (error) {
  //       return sendErrorResponse(
  //         res,
  //         500,
  //         "Could not perform operation at this time, kindly try again later.",
  //         error
  //       );
  //     }
  //   },

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
