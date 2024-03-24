import models from "../models";
import { hash, hash_compare } from "../utils/hashing";
import { sendErrorResponse, sendSuccessResponse } from "../utils/sendResponse";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const { User, Role, Permission } = models;

export default {
  async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await User.scope("withPassword").findOne({
        where: { email },
        include: [
          {
            model: Role,
            as: "roles",
            include: [
              {
                model: Permission,
                as: "permissions",
              },
            ],
          },
        ],
      });
      if (!user)
        return sendErrorResponse(
          res,
          400,
          "No user with this email. Kindly check credentials and try again"
        );
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return sendErrorResponse(
          res,
          400,
          "Incorrect login credentials. Kindly check and try again"
        );
      }

      if (user.status !== "active") {
        return sendErrorResponse(
          res,
          401,
          "Your account has been suspended. Contact admin"
        );
      }

      const token = jwt.sign({ userId: user.id }, "your-secret-key", {
        expiresIn: "12h",
      });
      const userRoles = [];
      const userPermissions = [];
      user.roles.forEach((role) => {
        userRoles.push(role.name);
        userPermissions.push(
          ...role.permissions.map((permission) => permission.name)
        );
      });
      return sendSuccessResponse(
        res,
        200,
        {
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            roles: userRoles,
            permissions: userPermissions,
          },
        },
        "Login successfully"
      );
    } catch (e) {
      return sendErrorResponse(
        res,
        500,
        "Server error, contact admin to resolve issue",
        e
      );
    }
  },

  async profile(req, res) {
    try {
      const { user } = req;
      const userData = await User.scope("withPassword").findByPk(user.id, {
        include: [
          {
            model: Role,
            as: "roles",
            include: [
              {
                model: Permission,
                as: "permissions",
              },
            ],
          },
        ],
      });
      if (userData) {
        const userRoles = [];
        const userPermissions = [];
        userData.roles.forEach((role) => {
          userRoles.push(role.name);
          userPermissions.push(
            ...role.permissions.map((permission) => permission.name)
          );
        });
        return sendSuccessResponse(
          res,
          200,
          {
            user: {
              id: userData.id,
              name: userData.name,
              email: userData.email,
              roles: userRoles,
              permissions: userPermissions,
            },
          },
          "User profile!"
        );
      }
      return sendErrorResponse(res, 400, "No user found!");
    } catch (e) {
      return sendErrorResponse(
        res,
        500,
        "Server error, contact admin to resolve issue",
        e
      );
    }
  },
};
