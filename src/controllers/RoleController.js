import model from "../models";
import { sendErrorResponse, sendSuccessResponse } from "../utils/sendResponse";

const { Role } = model;

export default {
  async roles(req, res) {
    try {
      const roles = await Role.findAll();
      return sendSuccessResponse(res, 200, { roles });
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
  async role(req, res) {
    try {
      const { id } = req.params;
      const role = await Role.findByPk(id);
      if (role) {
        const permissions = await role.getPermissions();
        const data = {
          id: role.id,
          name: role.name,
          permissions: permissions.map((p) => p.name),
        };
        return sendSuccessResponse(res, 200, { role: data });
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
    try {
      const { name, permissions } = req.body;
      let role = await Role.findOne({ where: { name } });
      if (role) {
        return sendErrorResponse(res, 422, "Role already exists.");
      }
      role = await Role.create({
        name,
      });
      await role.addPermissions(permissions);
      const assignedPermission = await role.getPermissions();
      return sendSuccessResponse(
        res,
        201,
        {
          role: {
            ...role.dataValues,
            permissions: assignedPermission.map((p) => p.name),
          },
        },
        "Role created successfully"
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
      const { permissions } = req.body;
      const role = await Role.findByPk(id);
      if (!role) {
        return sendErrorResponse(res, 404, "No data found with this id.");
      }
      if (permissions && permissions.length) {
        const exitingPermission = await role.getPermissions();
        await role.removePermissions(exitingPermission.map((p) => p.id));
        await role.addPermissions(permissions);
      }
      const newPermissions = await role.getPermissions();
      return sendSuccessResponse(
        res,
        200,
        {
          role: {
            ...role.dataValues,
            permissions: newPermissions.map((p) => p.name),
          },
        },
        "Operation successful."
      );
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
      const role = await Role.findByPk(id);
      if (role) {
        await role.destroy();
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
