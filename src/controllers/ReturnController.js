import { Op } from 'sequelize';
import model from '../models';
import { sendErrorResponse, sendSuccessResponse } from '../utils/sendResponse';
import logger from '../middleware/logger';
import _orderService from '../services/OrderService';

const { Order, Delivery, OrderHistory } = model;
export default {
  async return(req, res) {
    try {
      const { identifier } = req.params;
      let order = await Order.findOne(
        {
          attributes: ['id', 'status'],
          where: {
            [Op.or]: [
              { order_number: `${identifier}` },
              { '$delivery.cn$': `${identifier}` },
            ],
          },
          include: {
            model: Delivery,
            as: 'delivery',
            attributes: ['id'],
          },
        },
        { raw: true }
      );
      if (!order) {
        return sendErrorResponse(
          res,
          404,
          'No data found with this identifier'
        );
      }
      if (order.status === 'Returned') {
        return sendErrorResponse(res, 422, 'Order already returned');
      }
      await Order.update({ status: 'Returned' }, { where: { id: order.id } });
      await OrderHistory.create({
        user_id: req.user.id,
        event: `order returned`,
        order_id: order.id,
      });
      return sendSuccessResponse(
        res,
        200,
        { order },
        'Order return added successfully!'
      );
    } catch (e) {
      logger.error(e);
      return sendErrorResponse(
        res,
        500,
        'Could not perform operation at this time, kindly try again later.',
        e
      );
    }
  },
};
