import model from '../models';
import { sendErrorResponse, sendSuccessResponse } from '../utils/sendResponse';
import _stockService from '../services/StockService';
const { Item, SalesOrder, SalesOrderItem } = model;

export default {
  async salesOrders(req, res) {
    try {
      const salesOrders = await SalesOrder.findAll({
        attributes: ['id', 'name', 'comment', 'createdAt'],
        include: {
          model: SalesOrderItem,
          as: 'items',
          attributes: ['id', 'quantity', 'price'],
          include: {
            model: Item,
            as: 'item',
            attributes: ['name'],
          },
        },
      });
      return sendSuccessResponse(
        res,
        200,
        { salesOrders },
        'All sales order list'
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
      const id = req.params.id;
      const salesOrder = await SalesOrder.findByPk(id, {
        include: {
          model: SalesOrderItem,
          as: 'items',
          attributes: ['id', 'price', 'quantity'],
          include: {
            model: Item,
            as: 'item',
            attributes: ['name'],
          },
        },
      });
      if (!salesOrder) {
        return sendErrorResponse(res, 404, 'No data found for this id!', null);
      }
      return sendSuccessResponse(
        res,
        200,
        { salesOrder },
        'Sales order with id'
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
      const { location_id, comment, name, items } = req.body;
      const salesOrder = await SalesOrder.create({
        comment,
        name,
      });
      await SalesOrderItem.bulkCreate(
        items.map((item) => ({ ...item, sales_order_id: salesOrder.id }))
      );
      await Promise.all(
        items.map((item) =>
          _stockService.decreaseAndCreateHistory(
            'finished_product',
            item.item_id,
            'out',
            location_id,
            item.quantity,
            comment || ''
          )
        )
      );
      return sendSuccessResponse(
        res,
        200,
        { salesOrder },
        'Sales order created successfully'
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
