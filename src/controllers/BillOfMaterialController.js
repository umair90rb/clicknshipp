import { Op } from 'sequelize';
import model, { sequelize } from '../models';
import { sendErrorResponse, sendSuccessResponse } from '../utils/sendResponse';
import _stockService from '../services/StockService';
import _billOfMaterialService from '../services/BillOfMaterialService';
const { Item, RawMaterial, BOM, BOMItem, BOMMaterialQuantityUpdateReason } =
  model;

export default {
  async billOfMaterials(req, res) {
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
          // {
          //   model: BOMItems,
          //   as: 'materials',
          //   attributes: ['id', 'quantity', 'unit_of_measure'],
          //   include: {
          //     model: RawMaterial,
          //     as: 'raw',
          //     attributes: ['id', 'name'],
          //   },
          // },
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

  async billOfMaterial(req, res) {
    try {
      const { id } = req.params;
      const billOfMaterial = await _billOfMaterialService.get(id);
      return sendSuccessResponse(
        res,
        200,
        { billOfMaterial },
        'Bill of material with id'
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
      const { product_id, name, quantity, unit_of_measure, materials } =
        req.body;
      // materials[0] => raw_material_id, quantity, unit_of_measure
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

  async material(req, res) {
    try {
      const { id } = req.params;
      const { quantity, reason, previousQuantity } = req.body;
      const t = await sequelize.transaction();
      const [isUpdated, [bomItem]] = await BOMItem.update(
        { quantity },
        {
          where: { id },
          returning: true,
          include: {
            model: RawMaterial,
            as: 'raw',
            attributes: ['id', 'name'],
          },
          transaction: t,
        }
      );
      await BOMMaterialQuantityUpdateReason.create(
        {
          bom_id: bomItem.bom_id,
          bom_item_id: bomItem.id,
          requested_quantity: previousQuantity,
          reason,
        },
        { transaction: t }
      );
      await t.commit();
      return sendSuccessResponse(
        res,
        200,
        { bomItem },
        'Material quantity update successfully'
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

  async fullfil(req, res) {
    try {
      const { id, locationId } = req.params;
      const billOfMaterial = await _billOfMaterialService.get(id);
      if (billOfMaterial && billOfMaterial.materials.length) {
        const materialBatchPromises = billOfMaterial.materials.map((bom) => {
          _stockService.decrement(
            'raw_material',
            bom.raw.id,
            bom.quantity,
            locationId
          );
          _stockService.createHistory(
            'raw_material',
            bom.raw.id,
            'out',
            locationId,
            bom.quantity,
            `Stock send to production against BOM# ${billOfMaterial.id}`
          );
        });
        await Promise.allSettled(materialBatchPromises);
        await _billOfMaterialService.setStatus(id, 'Fulfilled');
        return sendSuccessResponse(
          res,
          200,
          { billOfMaterial },
          'Bill of Material fulfilled!'
        );
      }
      return sendErrorResponse(
        res,
        500,
        'Could not perform operation at this time, kindly try again later.',
        error
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
