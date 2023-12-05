import { Op } from "sequelize";
import model from "../models";
import { sendErrorResponse, sendSuccessResponse } from "../utils/sendResponse";
import { hash } from "../utils/hashing";

const { User, Role, Permission } = model;

export default {
  async users(req, res) {
    try {
      const users = await User.scope("clean").findAll({
        include: {
          model: Role,
          as: "roles",
          through: {
            attributes: [],
          },
        },
      });
      return sendSuccessResponse(res, 200, { users }, "All registered users");
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
  async user(req, res) {
    try {
      const { id } = req.params;
      const user = await User.scope("clean").findByPk(id, {
        include: [
          {
            model: Role,
            as: "roles",
            through: { attributes: [] },
          },
        ],
      });
      if (user) {
        return sendSuccessResponse(res, 200, { user }, "User with id");
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

  async create(req, res) {
    const { name, email, password, phone, roles } = req.body;
    try {
      let user = await User.findOne({
        where: { [Op.or]: [{ email }, { phone }] },
      });
      if (user) {
        return sendErrorResponse(
          res,
          422,
          "User with email or phone already exists."
        );
      }
      user = await User.create({
        email,
        password: hash(password),
        name,
        phone,
      });
      await user.addRoles(roles);
      const assignedRoles = await user.getRoles();
      return sendSuccessResponse(
        res,
        201,
        {
          user: {
            email: user.email,
            id: user.id,
            name: user.name,
            phone: user.phone,
            status: user.status,
            roles: assignedRoles.map((r) => ({ name: r.name, id: r.id })),
          },
        },
        "Account created successfully"
      );
    } catch (error) {
      return sendErrorResponse(
        res,
        500,
        "Could not perform operation at this time, kindly try again later.",
        error
      );
    }
  },

  async update(req, res) {
    try {
      const id = req.params.id;
      const { name, email, phone, password, roles } = req.body;
      const user = await User.findByPk(id, {
        include: [
          {
            model: Role,
            as: "roles",
            through: { attributes: [] },
          },
        ],
      });
      if (user) {
        user.set({
          email,
          name,
          phone,
          password: hash(password),
          updatedAt: new Date().toISOString(),
        });
        if (roles && roles.length) {
          const currentRoles = await user.getRoles();
          await user.removeRoles(currentRoles.map((r) => r.id));
          await user.addRoles(roles);
        }
        const newRoles = await user.getRoles();
        await user.save();
        return sendSuccessResponse(
          res,
          200,
          {
            user: {
              email: user.email,
              id: user.id,
              name: user.name,
              phone: user.phone,
              status: user.status,
              roles: newRoles,
            },
          },
          "Operation successful."
        );
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

  async destroy(req, res) {
    try {
      const id = req.params.id;
      const user = await User.findByPk(id);
      if (user) {
        //user deleted but not linked data e.g roles, permission onDelete 'cascade' not working yet
        await user.destroy();
        return sendSuccessResponse(res, 200, {}, "Operation successful.");
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
};
