import { Op, Sequelize } from "sequelize";
import model from "../models";
import { sendErrorResponse, sendSuccessResponse } from "../utils/sendResponse";

const { DeliveryServiceAccounts } = model;

export default {
  async accounts(req, res) {
    try {
      const accounts = await DeliveryServiceAccounts.findAll({
        attributes: ["id", "service", "active", "key", "password"],
      });
      return sendSuccessResponse(
        res,
        200,
        { accounts },
        "All service accounts!"
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
  async account(req, res) {},

  async create(req, res) {
    const { service, key, password } = req.body;
    try {
      let account = await DeliveryServiceAccounts.findOne({
        where: { key },
      });
      if (account) {
        return sendErrorResponse(
          res,
          422,
          "Service key already exists, add different key!"
        );
      }
      account = await DeliveryServiceAccounts.create({
        service,
        key,
        password,
        active: true,
      });
      return sendSuccessResponse(
        res,
        201,
        {
          account: {
            id: account.id,
            service: account.service,
            active: account.active,
            key: account.key,
            password: account.password,
          },
        },
        "Service created successfully"
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
      const { service, key, active, password } = req.body;
      const account = await DeliveryServiceAccounts.findByPk(id);
      if (account) {
        account.set({
          service: service || account.service,
          key: key || account.key,
          password: password || account.password,
          active: active || account.active,
          updatedAt: new Date().toISOString(),
        });
        await account.save();
        return sendSuccessResponse(
          res,
          200,
          {
            account: {
              id: account.id,
              service: account.service,
              active: account.active,
              key: account.key,
              password: account.password,
            },
          },
          "Operation successful"
        );
      }
      return sendErrorResponse(res, 404, "No data found with this id");
    } catch (e) {
      console.error(e);
      return sendErrorResponse(
        res,
        500,
        "Could not perform operation at this time, kindly try again later",
        e
      );
    }
  },

  async destroy(req, res) {
    try {
      const id = req.params.id;
      const account = await DeliveryServiceAccounts.findByPk(id);
      if (account) {
        await account.destroy();
        return sendSuccessResponse(res, 200, {}, "Operation successful");
      }
      return sendErrorResponse(res, 404, "No data found with this id");
    } catch (e) {
      console.error(e);
      return sendErrorResponse(
        res,
        500,
        "Could not perform operation at this time, kindly try again later",
        e
      );
    }
  },
};
