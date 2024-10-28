import model from '../models';
import { sendErrorResponse, sendSuccessResponse } from '../utils/sendResponse';

const { UnitOfMeasure } = model;

export default {
  async all(req, res) {
    try {
      const units = await UnitOfMeasure.findAll();
      return sendSuccessResponse(
        res,
        200,
        { units },
        'All registered units of measure'
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

  async unit(req, res) {
    try {
      const { id } = req.params;
      const unit = await UnitOfMeasure.findByPk(id);
      if (unit) {
        return sendSuccessResponse(
          res,
          200,
          { unit },
          'Unit of measure with id'
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

  async create(req, res) {
    const { name } = req.body;
    try {
      let existingUnit = await UnitOfMeasure.findOne({
        where: { unit: name },
      });
      if (existingUnit) {
        return sendErrorResponse(
          res,
          422,
          'Unit of measure with this name already exists.'
        );
      }
      const newUnit = await UnitOfMeasure.create({ unit: name });
      return sendSuccessResponse(
        res,
        201,
        {
          unit: newUnit.get(),
        },
        'Unit of measure created successfully'
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
      const { name } = req.body;
      const existingUnit = await UnitOfMeasure.findByPk(id);
      if (existingUnit) {
        existingUnit.set({
          unit: name,
          updatedAt: new Date().toISOString(),
        });
        await existingUnit.save();
        return sendSuccessResponse(
          res,
          200,
          {
            unit: existingUnit.get(),
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
      const unit = await UnitOfMeasure.findByPk(id);
      if (unit) {
        await unit.destroy();
        return sendSuccessResponse(
          res,
          200,
          {},
          'Unit of measure deleted successfully'
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
