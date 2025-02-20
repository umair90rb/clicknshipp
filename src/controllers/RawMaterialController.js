import { Op } from 'sequelize';
import excelToJson from '../helpers/excelToJson';
import model from '../models';
import { sendErrorResponse, sendSuccessResponse } from '../utils/sendResponse';

const { RawMaterial, Supplier } = model;

export default {
  async all(req, res) {
    try {
      const rawMaterials = await RawMaterial.findAll({
        include: {
          model: Supplier,
          as: 'supplier',
          attributes: ['name', 'id'],
        },
      });
      return sendSuccessResponse(res, 200, { rawMaterials }, 'All materials');
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
          'Material with id'
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
    const {
      name,
      description,
      type,
      re_order_level,
      unit_of_measure,
      code,
      cost_price,
      supplier,
    } = req.body;
    try {
      let rawMaterial = await RawMaterial.findOne({
        where: { type, [Op.or]: { name, code } },
      });
      if (rawMaterial) {
        return sendErrorResponse(
          res,
          422,
          'Material with this name or code already exists.'
        );
      }
      rawMaterial = await RawMaterial.create({
        name,
        description,
        unit_of_measure,
        re_order_level,
        type,
        code,
        cost_price,
        supplier_id: supplier,
      });
      await rawMaterial.reload({
        include: {
          model: Supplier,
          as: 'supplier',
          attributes: ['id', 'name'],
        },
      });
      return sendSuccessResponse(
        res,
        201,
        { rawMaterial },
        'Material created successfully'
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
      const { type } = req.body;
      const json = await excelToJson(req.file.buffer);
      console.log(json, type);
      if (!json.length) {
        return sendErrorResponse(res, 500, 'Seems like file is empty!', null);
      }
      await RawMaterial.bulkCreate(json.map((item) => ({ ...item, type })));
      return sendSuccessResponse(
        res,
        200,
        {},
        'Materials imported successfully!'
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
      const {
        name,
        description,
        unit_of_measure,
        re_order_level,
        type,
        code,
        cost_price,
      } = req.body;
      const rawMaterial = await RawMaterial.findByPk(id);
      if (rawMaterial) {
        rawMaterial.set({
          name,
          description,
          unit_of_measure,
          re_order_level,
          type,
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
          'Material deleted successfully'
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
