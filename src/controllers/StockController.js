import { Op } from 'sequelize';
import model from '../models';
import { sendErrorResponse, sendSuccessResponse } from '../utils/sendResponse';
import _stockService from '../services/StockService';
const {
  Item,
  RawMaterial,
  Batch,
  Location,
  Category,
  StockLevel,
  StockHistory,
} = model;

export default {
  async stocks(req, res) {
    try {
      const type = req.query.type || 'finished_product';
      const includes = [
        {
          model: Location,
          as: 'location',
          attributes: ['name'],
        },
      ];
      if (type === 'raw_material' || type === 'packaging_material') {
        includes.push({
          model: RawMaterial,
          as: 'raw',
          attributes: ['name', 'id', 'unit_of_measure'],
          where: { type },
        });
      }
      if (type === 'finished_product') {
        includes.push({
          model: Item,
          as: 'item',
          attributes: ['name', 'id'],
        });
      }
      if (type === 'all') {
        includes.push({
          model: RawMaterial,
          as: 'raw',
          attributes: ['name', 'id', 'unit_of_measure'],
        });
        includes.push({
          model: Item,
          as: 'item',
          attributes: ['name', 'id'],
        });
      }
      const stocks = await StockLevel.findAll({
        attributes: ['id', 'current_level'],
        include: includes,
      });
      return sendSuccessResponse(
        res,
        200,
        { stocks },
        'All items current stock'
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

  async history(req, res) {
    try {
      const { item_id, item_type } = req.body;
      const history = await StockHistory.findAll({
        attributes: [
          'id',
          'quantity',
          'comment',
          'movement_type',
          'item_type',
          'createdAt',
        ],
        include: {
          model: Location,
          as: 'location',
          attributes: ['name'],
        },
        where: { [Op.and]: [{ item_id }, { item_type }] },
      });
      if (history) {
        return sendSuccessResponse(
          res,
          200,
          { history },
          'Stock history of item with id'
        );
      }
      return sendErrorResponse(res, 404, 'No data found with this id.');
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
      const { item_type, location_id, comment, inventory } = req.body;
      const batches = [],
        batchPromises = [],
        historyPromises = [];
      inventory.map(({ item_id: item, quantity, ...rest }) => {
        batches.push({
          item_type,
          item_id: item.id,
          quantity,
          location_id,
          ...rest,
        });
        batchPromises.push(
          _stockService.increment(item_type, item.id, quantity, location_id)
        );
        historyPromises.push(
          _stockService.createHistory(
            item_type,
            item.id,
            'in',
            location_id,
            quantity,
            comment
          )
        );
      });
      return Batch.bulkCreate(batches)
        .then(() => Promise.all(batchPromises))
        .then(() => Promise.all(historyPromises))
        .then(() =>
          sendSuccessResponse(res, 201, {}, 'Stock added successfully')
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
