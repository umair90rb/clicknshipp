import model from "../models";
import { Op, Sequelize } from "sequelize";
import { sendErrorResponse, sendSuccessResponse } from "../utils/sendResponse";

const { CityNameMaping, DeliveryServiceAccounts } = model;

export default {
  async cities(req, res) {
    try {
      const cities = await CityNameMaping.findAll({
        attributes: [[Sequelize.fn("DISTINCT", Sequelize.col("city")), "city"]],
      });
      return sendSuccessResponse(
        res,
        200,
        { cities: cities.map((c) => c.city) },
        "All available cities."
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

  async city(req, res) {},

  async create(req, res) {
    try {
      const { city, maped, assigned_id, service_id, code } = req.body;
      const deliveryAccount = await DeliveryServiceAccounts.findByPk(
        service_id,
        { raw: true }
      );
      const existed = await CityNameMaping.findOne({
        where: {
          [Op.and]: {
            city,
            maped,
            courier: deliveryAccount.service,
          },
        },
      });
      console.log(existed, "existed");
      if (existed) {
        return sendErrorResponse(res, 500, "City with details already added.");
      }

      const addedCity = await CityNameMaping.create({
        city,
        maped,
        assigned_id: assigned_id === "" ? null : assigned_id,
        courier: deliveryAccount.service,
        code,
      });
      return sendSuccessResponse(
        res,
        200,
        { city: addedCity.get() },
        "New city added."
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

  async update(req, res) {},

  async destroy(req, res) {},
};
