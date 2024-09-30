import model from '../models';
import { Op, Sequelize } from 'sequelize';
import { sendErrorResponse, sendSuccessResponse } from '../utils/sendResponse';

const { CityNameMaping, DeliveryServiceAccounts } = model;

export default {
  async cities(req, res) {
    try {
      const cities = await CityNameMaping.findAll({
        attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('city')), 'city']],
      });
      return sendSuccessResponse(
        res,
        200,
        { cities: cities.map((c) => c.city) },
        'All available cities.'
      );
    } catch (e) {
      console.error(e);
      return sendErrorResponse(
        res,
        500,
        'Could not perform operation at this time, kindly try again later.',
        e
      );
    }
  },

  async search(req, res) {
    try {
      const { city } = req.body;
      const result = await CityNameMaping.findAll({
        where: {
          city: {
            [Op.iLike]: `%${city}%`,
          },
        },
        order: [['city', 'asc']],
      });
      return sendSuccessResponse(
        res,
        200,
        { cities: result },
        'All available cities.'
      );
    } catch (e) {
      console.error(e);
      return sendErrorResponse(
        res,
        500,
        'Could not perform operation at this time, kindly try again later.',
        e
      );
    }
  },

  async create(req, res) {
    try {
      const cities = req.body;
      await Promise.all(
        cities.map(({ id, ...rest }) => {
          if (id) {
            return CityNameMaping.update(rest, { where: { id } });
          } else {
            return CityNameMaping.create(rest);
          }
        })
      );
      return sendSuccessResponse(res, 200, {}, 'Operation successful!');
    } catch (e) {
      console.error(e);
      return sendErrorResponse(
        res,
        500,
        'Could not perform operation at this time, kindly try again later.',
        e
      );
    }
  },

  async update(req, res) {},

  async destroy(req, res) {},
};
