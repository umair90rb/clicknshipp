import { Op } from 'sequelize';
import model from '../models';
import { sendErrorResponse, sendSuccessResponse } from '../utils/sendResponse';
import bookingService from '../services/BookingService';

import logger from '../middleware/logger';
import _orderService from '../services/OrderService';
import { Server } from 'socket.io';
import deliveryServiceAccountService from '../services/DeliveryServiceAccountService';
import { getEndOfDay, getStartOfDay } from '../helpers/pgDateFormat';
import bookingQueue from '../queues/bookingQueue';

const {
  Order,
  OrderItem,
  Customer,
  Address,
  Brand,
  DeliveryServiceAccounts,
  Delivery,
  Tokens,
} = model;

export default {
  async book(req, res) {
    try {
      const { orderId, accountId } = req.body;
      const deliveryAccount =
        await deliveryServiceAccountService.getAccountWithToken(accountId);
      if (!deliveryAccount) {
        return sendErrorResponse(res, 404, 'No account found with this id');
      }
      const order = await _orderService.loadOrderForBooking(orderId);
      if (!order) {
        return sendErrorResponse(res, 404, 'No data found with this id.');
      }
      if (order.status === 'Booked') {
        return sendErrorResponse(res, 400, 'Order already booked!');
      }
      const bookingResponse = await bookingService.bookParcelWithCourier(
        order,
        deliveryAccount.get()
      );
      const delivery = await _orderService.updateOrderAfterBooking(
        bookingResponse,
        order,
        deliveryAccount
      );
      if (delivery) {
        return sendSuccessResponse(
          res,
          200,
          { delivery },
          'Operation successful'
        );
      }
      return sendErrorResponse(
        res,
        500,
        'Could not perform operation at this time, kindly try again later.',
        null
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

  async bulkBook(req, res) {
    const { deliveryAccountId, orderIds } = req.body;
    try {
      const unconfirmedOrder = await Order.findOne({
        where: {
          id: { [Op.in]: orderIds },
          status: { [Op.not]: 'Confirmed' },
        },
      });
      if (unconfirmedOrder) {
        return sendErrorResponse(
          res,
          500,
          'Please select all confirmed orders to book!'
        );
      }
      await bookingQueue.addBulk(
        orderIds.map((orderId) => ({
          name: 'bookingJob',
          data: { orderId, deliveryAccountId },
          opts: {
            jobId: `${orderId}-${deliveryAccountId}`,
            removeOnComplete: true,
            removeOnFail: true,
          },
        }))
      );
      await Order.update(
        { status: 'Booked', delivery_account_id: deliveryAccountId },
        { where: { id: { [Op.in]: orderIds } } }
      );
      return sendSuccessResponse(
        res,
        200,
        {},
        'Orders added to queue for booking'
      );
    } catch (error) {
      console.log(error);
      return sendErrorResponse(res, 500, 'Something goes wrong!');
    }
  },

  async downloadParcelReceipt(req, res) {
    try {
      const { accountId } = req.body;
      const deliveryServiceAccount = await DeliveryServiceAccounts.findByPk(
        accountId
      );
      if (
        !deliveryServiceAccount ||
        deliveryServiceAccount.service !== 'postex'
      ) {
        return sendErrorResponse(
          res,
          500,
          'Error! Either account not found or only postex account is allowed'
        );
      }
      const deliveries = await Delivery.findAll({
        attributes: ['cn'],
        where: {
          account_id: accountId,
          createdAt: {
            [Op.and]: [
              { [Op.gte]: getStartOfDay() },
              { [Op.lte]: getEndOfDay() },
            ],
          },
        },
        raw: true,
      });
      if (!deliveries || !deliveries.length) {
        return sendErrorResponse(
          res,
          404,
          'No delivery booked with this account!'
        );
      }
      const bookingServiceRes =
        await bookingService.downloadParcelReceiptWithCourier(
          deliveries.map((d) => d.cn),
          deliveryServiceAccount
        );
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=Air Ways Bill.pdf'
      );
      return res.send(bookingServiceRes.data);
    } catch (error) {
      logger.error(error);
      return sendErrorResponse(res, 500, 'Something goes wrong!', error);
    }
  },

  async cancelBooking(req, res) {
    try {
      const orderId = req.params.id;
      const order = await Order.findByPk(orderId, {
        attributes: ['id', 'status'],
      });
      if (!order || order.status !== 'Booked') {
        return sendErrorResponse(res, 500, 'Order is not in booking!');
      }
      const delivery = await Delivery.findOne({
        where: {
          order_id: order.id,
        },
        include: {
          model: DeliveryServiceAccounts,
          as: 'account',
          include: {
            model: Tokens,
            as: 'tokens',
            attributes: ['token', 'expiry', 'type'],
          },
        },
      });
      if (!delivery) {
        return sendErrorResponse(
          res,
          500,
          'Delivery not found for this order!'
        );
      }
      const cancelBookingResponse =
        await bookingService.cancelBookingWithCourier(
          delivery.cn,
          delivery.account.get()
        );
      const { isSuccess, error, response } = cancelBookingResponse || {};
      console.log(cancelBookingResponse, 'cancelBookingResponse');
      if (isSuccess) {
        await delivery.update({
          slip_link: '',
          status: 'Booking Canceled',
          updatedAt: new Date().toISOString(),
        });
        await order.update({ status: 'Booking Canceled' });
        await order.createHistory({
          user_id: req.user.id,
          event: 'order booking cancel',
        });
        return sendSuccessResponse(res, 200, {}, 'Operation successful');
      }
      return sendErrorResponse(res, 500, error, response);
    } catch (error) {
      return sendErrorResponse(res, 500, error);
    }
  },

  async deliveryStatus(req, res) {
    try {
      const orderId = req.params.id;
      const order = await Order.findByPk(orderId, {
        attributes: ['id', 'status'],
      });
      if (!order || order?.status !== 'Booked') {
        return sendErrorResponse(res, 500, 'Order is not in booking!');
      }
      const delivery = await Delivery.findOne({
        where: {
          order_id: order.id,
        },
        include: {
          model: DeliveryServiceAccounts,
          as: 'account',
          include: {
            model: Tokens,
            as: 'tokens',
            attributes: ['token', 'expiry', 'type'],
          },
        },
      });
      console.log(delivery.get());
      if (!delivery) {
        return sendErrorResponse(
          res,
          500,
          'Delivery not found for this order!'
        );
      }
      const bookingStatusResponse =
        await bookingService.checkParcelStatusWithCourier(
          delivery?.cn,
          delivery?.account?.get()
        );
      const {
        isSuccess,
        data,
        history,
        status,
        date,
        remarks,
        error,
        response,
      } = bookingStatusResponse || {};
      console.log(bookingStatusResponse, 'status response');
      if (isSuccess) {
        return sendSuccessResponse(
          res,
          200,
          { data, history, status, date, remarks, error, response },
          'Operation successful'
        );
      }
      return sendErrorResponse(res, 500, error, response);
    } catch (error) {
      logger.error('error', error, {
        stack: 'in delivery status function order controller',
      });
      return sendErrorResponse(
        res,
        500,
        'Could not perform operation at this time, kindly try again later.',
        error
      );
    }
  },
};
