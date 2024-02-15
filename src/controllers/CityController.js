import model from "../models";
import { Sequelize } from "sequelize";
import { sendErrorResponse, sendSuccessResponse } from "../utils/sendResponse";

const { CityNameMaping } = model;

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

  async create(req, res) {},

  async update(req, res) {},

  async destroy(req, res) {},
};
