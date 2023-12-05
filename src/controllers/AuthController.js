import { Op } from "sequelize";
import models from "../models";
import { hash, hash_compare } from "../utils/hashing";
import { sendErrorResponse, sendSuccessResponse } from "../utils/sendResponse";

const { User } = models;

export default {
  async login(req, res) {
    const { email, password, device_name } = req.body;

    try {
      const user = await User.scope("withPassword").findOne({
        where: { email },
      });
      if (!user)
        return sendErrorResponse(
          res,
          400,
          "No user with this email. Kindly check credentials and try again"
        );
      const checkPassword = hash_compare(hash(password), user.password);
      if (!checkPassword) {
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

      const token = await user.newToken();
      const roles = await user.getRoles();
      return sendSuccessResponse(
        res,
        200,
        {
          token: token.plainTextToken,
          user: {
            name: user.name,
            id: user.id,
            email: user.email,
            roles: roles.map((r) => r.name),
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
};
