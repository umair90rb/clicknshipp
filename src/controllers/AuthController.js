import { Op } from "sequelize";
import models from "../models";
import { hash, hash_compare } from "../utils/hashing";
import { sendErrorResponse, sendSuccessResponse } from "../utils/sendResponse";

const { User } = models;

export default {
  async signUp(req, res) {
    const { name, email, password, phone } = req.body;
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
      return sendSuccessResponse(
        res,
        201,
        {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
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
  async login(req, res) {
    const { email, password, device_name } = req.body;

    try {
      const user = await User.findOne({ where: { email } });

      if (!user)
        return sendErrorResponse(
          res,
          404,
          "Incorrect login credentials. Kindly check and try again"
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
      return sendSuccessResponse(
        res,
        200,
        {
          token: token.plainTextToken,
          user: {
            name: user.name,
            id: user.id,
            email: user.email,
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
