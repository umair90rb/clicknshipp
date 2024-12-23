import { Op } from 'sequelize';
import model, { sequelize } from '../models';
import { sendErrorResponse, sendSuccessResponse } from '../utils/sendResponse';
import _stockService from '../services/StockService';
import _billOfMaterialService from '../services/BillOfMaterialService';
const { Item, SalesOrder, SalesOrderItem } = model;

export default {
  async salesOrders(req, res) {
    try {
      const billOfMaterials = await BOM.findAll({
        attributes: [
          'id',
          'name',
          'quantity',
          'unit_of_measure',
          'status',
          'createdAt',
        ],
        include: [
          {
            model: Item,
            as: 'item',
            attributes: ['id', 'name'],
          },
        ],
      });
      return sendSuccessResponse(
        res,
        200,
        { billOfMaterials },
        'All bill of materials list'
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

  async salesOrder(req, res) {
    try {
      return sendSuccessResponse(res, 200, {}, 'Empty response');
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
      const { product_id, name, quantity, unit_of_measure } = req.body;
      const billOfMaterialData = {
        product_id: product_id.id,
        name,
        quantity,
        unit_of_measure,
        status: 'Opened',
        materials: materials.map(({ raw_material_id, ...rest }) => ({
          ...rest,
          raw_material_id: raw_material_id.id,
        })),
      };
      const billOfMaterial = await BOM.create(billOfMaterialData, {
        include: { model: BOMItem, as: 'materials' },
      });
      return sendSuccessResponse(
        res,
        200,
        { billOfMaterial },
        'Bill of material created successfully'
      );
    } catch (error) {
      return sendErrorResponse(
        res,
        500,
        'Could not perform operation at this time, kindly try again later.',
        error
      );
    }
  },

  async update(req, res) {},

  async destroy(req, res) {},
};
