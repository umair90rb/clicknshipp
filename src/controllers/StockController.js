import { Op, literal, col } from 'sequelize';
import model from '../models';
import { sendErrorResponse, sendSuccessResponse } from '../utils/sendResponse';
import _stockService from '../services/StockService';
import { PERMISSIONS } from '../constants/constants';
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
      console.log(req.user);
      const { type, stock_less_than } = req.query;
      const where = {};
      if (
        !req.user.permissions.includes(
          PERMISSIONS.PERMISSION_ACCESS_TO_ALL_STORES
        )
      ) {
        where.location_id = { [Op.in]: req.user?.stores };
      }
      if (type !== 'all') {
        where.item_type = type;
      }
      if (stock_less_than && stock_less_than !== 'false') {
        where.current_level = { [Op.lte]: parseFloat(stock_less_than) };
      }
      const stocks = await StockLevel.findAll({
        attributes: ['id', 'current_level', 'item_id', 'item_type'],
        ...(Object.entries(where).length ? { where } : {}),
        include: [
          {
            model: Location,
            as: 'location',
            attributes: ['id', 'name'],
          },
          {
            model: RawMaterial,
            as: 'raw',
            attributes: ['id', 'name', 'id', 'unit_of_measure'],
          },
          {
            model: Item,
            as: 'item',
            attributes: ['name', 'id'],
          },
        ],
      });
      return sendSuccessResponse(
        res,
        200,
        {
          stocks,
          type,
          stock_less_than,
        },
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
      // need to add location_id to fetch only specific location stock histories. crucial
      const history = await StockHistory.findAll({
        attributes: [
          'id',
          'quantity',
          'comment',
          'gate_pass_no',
          'gate_pass_date',
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
      const {
        item_type,
        location_id,
        gate_pass_no,
        gate_pass_date,
        comment,
        inventory,
      } = req.body;
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
            comment,
            gate_pass_no,
            gate_pass_date
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

  async return(req, res) {
    try {
      const { item_type, location_id, comment, inventory } = req.body;
      const batchPromises = [],
        historyPromises = [];
      inventory.map(
        ({ item_id: item, quantity, batch_number, unit_of_measure }) => {
          batchPromises.push(
            _stockService.increment(item_type, item.id, quantity, location_id)
          );
          historyPromises.push(
            _stockService.createHistory(
              item_type,
              item.id,
              'return',
              location_id,
              quantity,
              comment
            )
          );
        }
      );
      return Promise.all(batchPromises)
        .then(() => Promise.all(historyPromises))
        .then(() =>
          sendSuccessResponse(res, 201, {}, 'Stock return added successfully')
        );
    } catch (error) {
      return sendErrorResponse(
        res,
        500,
        'Could not perform operation at this time, kindly try again later',
        error
      );
    }
  },

  async damage(req, res) {
    try {
      const { item_type, location_id, comment, inventory } = req.body;
      const batchPromises = [],
        historyPromises = [];
      inventory.map(
        ({
          item_id: item,
          quantity,
          batch_number,
          unit_of_measure,
          deduct_stock,
        }) => {
          if (deduct_stock) {
            batchPromises.push(
              _stockService.decrement(item_type, item.id, quantity, location_id)
            );
          }
          historyPromises.push(
            _stockService.createHistory(
              item_type,
              item.id,
              'damage',
              location_id,
              quantity,
              comment
            )
          );
        }
      );
      return Promise.all(batchPromises)
        .then(() => Promise.all(historyPromises))
        .then(() =>
          sendSuccessResponse(res, 201, {}, 'Stock return added successfully')
        );
    } catch (error) {
      return sendErrorResponse(
        res,
        500,
        'Could not perform operation at this time, kindly try again later',
        error
      );
    }
  },

  async damageReport(req, res) {
    try {
      const { item_id, item_type, location_id, from, to } = req.body;
      const history = await StockHistory.findAll({
        attributes: [
          'id',
          'quantity',
          'comment',
          // 'gate_pass_no',
          // 'gate_pass_date',
          'movement_type',
          'item_type',
          'createdAt',
        ],
        include: {
          model: Location,
          as: 'location',
          attributes: ['name'],
        },
        where: {
          [Op.and]: [
            { item_id },
            { item_type },
            { location_id },
            { movement_type: 'damage' },
            { createdAt: { [Op.between]: [from, to] } },
          ],
        },
      });
      return sendSuccessResponse(
        res,
        201,
        { history },
        'Stock return added successfully'
      );
    } catch (error) {
      return sendErrorResponse(
        res,
        500,
        'Could not perform operation at this time, kindly try again later',
        error
      );
    }
  },

  async import(req, res) {
    try {
      const { store_id, stock_type } = req.body;
      const json = await excelToJson(req.file.buffer);
      await _stockService.importOpeningStock(json, store_id, stock_type);
      return sendSuccessResponse(res, 201, {}, 'Stock imported successfully');
    } catch (error) {
      return sendErrorResponse(
        res,
        500,
        'Could not perform operation at this time, kindly try again later',
        error
      );
    }
  },

  async update(req, res) {},

  async destroy(req, res) {},
};
