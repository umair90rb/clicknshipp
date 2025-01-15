import model from '../models';
import { sendErrorResponse, sendSuccessResponse } from '../utils/sendResponse';

const { Location } = model;

export default {
  async all(req, res) {
    try {
      const locations = await Location.findAll();
      return sendSuccessResponse(
        res,
        200,
        { locations },
        'All registered locations'
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

  async location(req, res) {
    try {
      const { id } = req.params;
      const location = await Location.findByPk(id);
      if (location) {
        return sendSuccessResponse(res, 200, { location }, 'Location with id');
      }
      return sendErrorResponse(res, 404, 'No data found with this id');
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
    const { name, type, address } = req.body;
    try {
      let location = await Location.findOne({
        where: { name },
      });
      if (location) {
        return sendErrorResponse(
          res,
          422,
          'Location with this name already exists.'
        );
      }
      location = await Location.create({
        name,
        type,
        address,
      });
      return sendSuccessResponse(
        res,
        201,
        {
          location: location.get(),
        },
        'Location created successfully'
      );
    } catch (error) {
      console.error(error);
      return sendErrorResponse(
        res,
        500,
        'Could not perform operation at this time, kindly try again later.',
        error
      );
    }
  },

  async update(req, res) {
    try {
      const id = req.params.id;
      const { name, address } = req.body;
      const location = await Location.findByPk(id);
      if (location) {
        location.set({
          name,
          address,
          updatedAt: new Date().toISOString(),
        });
        await location.save();
        return sendSuccessResponse(
          res,
          200,
          {
            location: location.get(),
          },
          'Operation successful'
        );
      }
      return sendErrorResponse(res, 404, 'No data found with this id');
    } catch (e) {
      console.error(e);
      return sendErrorResponse(
        res,
        500,
        'Could not perform operation at this time, kindly try again later',
        e
      );
    }
  },

  async destroy(req, res) {
    try {
      const id = req.params.id;
      const location = await Location.findByPk(id);
      if (location) {
        await location.destroy();
        return sendSuccessResponse(
          res,
          200,
          {},
          'Location deleted successfully'
        );
      }
      return sendErrorResponse(res, 404, 'No data found with this id');
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
};
