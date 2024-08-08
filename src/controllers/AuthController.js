import models from "../models";
import { hash, hash_compare } from "../utils/hashing";
import { sendErrorResponse, sendSuccessResponse } from "../utils/sendResponse";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const { User, Role, Permission, Brand } = models;

export default {
  async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await User.scope("withPassword").findOne({
        where: { email, status: "active" },
      });
      if (!user)
        return sendErrorResponse(
          res,
          400,
          "No user with this email. Kindly check credentials and try again"
        );

      const passwordMatch = await bcrypt.compare(password, user.password);
      console.log(passwordMatch, password, user.password);
      if (!passwordMatch) {
        return sendErrorResponse(
          res,
          400,
          "Incorrect login credentials or account is not active!"
        );
      }

      const token = jwt.sign({ userId: user.id }, "your-secret-key", {
        expiresIn: "12h",
      });
      return sendSuccessResponse(
        res,
        200,
        {
          token,
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
        attributes: ["id", "name", "email", "phone", "settings"],
        include: [
          {
            model: Brand,
            as: "brands",
            attributes: ["id", "name"],
            through: {
              attributes: [],
            },
          },
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
              ...userData.get(),
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
