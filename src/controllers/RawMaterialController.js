import excelToJson from '../helpers/excelToJson';
import model from '../models';
import { sendErrorResponse, sendSuccessResponse } from '../utils/sendResponse';

const { RawMaterial } = model;

export default {
  async all(req, res) {
    try {
      const rawMaterials = await RawMaterial.findAll();
      return sendSuccessResponse(
        res,
        200,
        { rawMaterials },
        'All raw materials'
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

  async rawMaterial(req, res) {
    try {
      const { id } = req.params;
      const rawMaterial = await RawMaterial.findByPk(id);
      if (rawMaterial) {
        return sendSuccessResponse(
          res,
          200,
          { rawMaterial },
          'Raw material with id'
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
    const { name, description, unit_of_measure, code, cost_price } = req.body;
    try {
      let rawMaterial = await RawMaterial.findOne({
        where: { name },
      });
      if (rawMaterial) {
        return sendErrorResponse(
          res,
          422,
          'Raw material with this name already exists.'
        );
      }
      rawMaterial = await RawMaterial.create({
        name,
        description,
        unit_of_measure,
        code,
        cost_price,
      });
      return sendSuccessResponse(
        res,
        201,
        { rawMaterial },
        'Raw material created successfully'
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

  async import(req, res) {
    try {
      const json = await excelToJson(req.file.buffer);
      console.log(json);
      await RawMaterial.bulkCreate(json);
      return sendSuccessResponse(
        res,
        200,
        {},
        'Raw materials imported successfully!'
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
      const { id } = req.params;
      const { name, description, unit_of_measure, code, cost_price } = req.body;
      const rawMaterial = await RawMaterial.findByPk(id);
      if (rawMaterial) {
        rawMaterial.set({
          name,
          description,
          unit_of_measure,
          code,
          cost_price,
          updatedAt: new Date().toISOString(),
        });
        await rawMaterial.save();
        return sendSuccessResponse(
          res,
          200,
          { rawMaterial },
          'Operation successful'
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

  async destroy(req, res) {
    try {
      const { id } = req.params;
      const rawMaterial = await RawMaterial.findByPk(id);
      if (rawMaterial) {
        await rawMaterial.destroy();
        return sendSuccessResponse(
          res,
          200,
          {},
          'Raw material deleted successfully'
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
