import { Op } from "sequelize";
import model from "../models";
import { sendErrorResponse, sendSuccessResponse } from "../utils/sendResponse";
const bcrypt = require("bcrypt");

const {
  User,
  Role,
  Permission,
  UserRole,
  UserPermission,
  PersonalAccessToken,
} = model;

export default {
  async users(req, res) {
    try {
      const usersWithRolesAndPermissions = await User.scope("clean").findAll({
        include: [
          {
            model: Role,
            as: "roles",
            through: {
              attributes: [],
            },
          },
          {
            model: Permission,
            as: "permissions",
            through: {
              attributes: [],
            },
          },
        ],
      });
      const users = usersWithRolesAndPermissions.map((user) => ({
        ...user.dataValues,
        roles: user.roles.map((role) => role.name),
      }));
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
            through: {
              attributes: [],
            },
          },
          {
            model: Permission,
            as: "permissions",
            through: {
              attributes: [],
            },
          },
        ],
      });
      if (user) {
        return sendSuccessResponse(
          res,
          200,
          {
            user: {
              ...user.dataValues,
              roles: user.roles.map((role) => role.name),
              permissions: user.permissions.map(
                (permission) => permission.name
              ),
            },
          },
          "User with id"
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
      const hashedPassword = await bcrypt.hash(password, 10);
      user = await User.create({
        email,
        password: hashedPassword,
        name,
        phone,
      });
      await user.addRoles(roles);

      const assignedRoles = await user.getRoles();

      const rolesWithPermissions = await Promise.all(
        assignedRoles.map((role) => role.getPermissions())
      );
      const permissions = [];
      rolesWithPermissions.forEach((rolePermissions) => {
        rolePermissions.forEach((permission) =>
          permissions.push({ id: permission.id, name: permission.name })
        );
      });
      await user.addPermissions(permissions.map((permission) => permission.id));
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
            roles: assignedRoles.map((role) => role.name),
            permissions: permissions.map((permission) => permission.name),
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
      const userUpdatedData = req.body;
      const { name, email, phone, password, roles, status } =
        userUpdatedData || {};
      if (email && phone) {
        const userWithEmailOrPhone = await User.findOne({
          where: { [Op.or]: [{ email }, { phone }] },
        });
        if (userWithEmailOrPhone && userWithEmailOrPhone.id !== id) {
          return sendErrorResponse(
            res,
            409,
            "Email or phone number already registered!"
          );
        }
      }
      const user = await User.findByPk(id, {
        include: [
          {
            model: Role,
            as: "roles",
            through: { attributes: [] },
          },
          {
            model: Permission,
            as: "permissions",
            through: { attributes: [] },
          },
        ],
      });
      if (user) {
        const hashedPassword = await bcrypt.hash(password, 10);
        user.set({
          email: email || user.email,
          name: name || user.name,
          phone: phone || user.phone,
          status: status || user.status,
          password: password ? hashedPassword : user.password,
          updatedAt: new Date().toISOString(),
        });
        let assignedRoles, permissions;
        if (roles && roles.length) {
          // const currentRoles = await user.getRoles();
          const currentRoles = user.roles;
          const currentPermissions = user.permissions;
          await user.removeRoles(currentRoles.map((r) => r.id));
          await user.addRoles(roles);
          assignedRoles = await user.getRoles();

          const rolesWithPermissions = await Promise.all(
            assignedRoles.map((role) => role.getPermissions())
          );
          permissions = [];
          rolesWithPermissions.forEach((rolePermissions) => {
            rolePermissions.forEach((permission) =>
              permissions.push({ id: permission.id, name: permission.name })
            );
          });
          await user.removePermissions(
            currentPermissions.map((permission) => permission.id)
          );
          await user.addPermissions(
            permissions.map((permission) => permission.id)
          );
        }
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
              roles: assignedRoles?.length
                ? assignedRoles.map((r) => r.name)
                : [],
              permissions: permissions?.length
                ? permissions.map((p) => p.name)
                : [],
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
      if (id === req.user.id) {
        return sendErrorResponse(
          res,
          400,
          "Logged in user could not delete himself!"
        );
      }
      const user = await User.findByPk(id);
      if (user) {
        await PersonalAccessToken.destroy({
          where: { user_id: user.id },
        });
        await UserRole.destroy({
          where: { user_id: user.id },
        });
        await UserPermission.destroy({
          where: { user_id: user.id },
        });
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
