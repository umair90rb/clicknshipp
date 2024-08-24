import model from "../models";
import { sendErrorResponse, sendSuccessResponse } from "../utils/sendResponse";
import BookingService from "../services/BookingService";

import logger from "../middleware/logger";
import { _orderService } from "../services/OrderService";
import { Server } from "socket.io";

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
      const deliveryAccount = await DeliveryServiceAccounts.findByPk(
        accountId,
        {
          include: {
            model: Tokens,
            as: "tokens",
            attributes: ["token", "expiry", "type"],
          },
        }
      );
      if (!deliveryAccount) {
        return sendErrorResponse(res, 404, "No account found with this id");
      }
      const order = await Order.findByPk(orderId, {
        attributes: {
          exclude: [
            "data",
            "CustomerId",
            "updatedAt",
            "customer_id",
            "user_id",
          ],
        },
        include: [
          {
            model: Customer,
            as: "customer",
          },
          {
            model: Brand,
            as: "brand",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
          },
          {
            model: Address,
            as: "address",
            attributes: {
              exclude: [
                "order_id",
                "customer_id",
                "CustomerId",
                "OrderId",
                "company",
                "longitude",
                "latitude",
                "country_code",
                "province_code",
              ],
            },
          },
          {
            model: OrderItem,
            as: "items",
            attributes: {
              exclude: ["OrderId", "createdAt", "updatedAt"],
            },
          },
        ],
      });
      if (!order) {
        return sendErrorResponse(res, 404, "No data found with this id.");
      }
      if (order.status === "Booked") {
        return sendErrorResponse(res, 400, "Order already booked!");
      }
      const bookingService = new BookingService();
      const bookingResponse = await bookingService.bookParcelWithCourier(
        order,
        deliveryAccount.get()
      );
      const { cn, slip, isSuccess, error, response } = bookingResponse || {};
      console.log(bookingResponse, "bookingResponse");
      if (isSuccess) {
        let delivery = await Delivery.findOne({
          where: { order_id: order.id },
        });
        console.log(delivery?.get(), "delivery found for order");
        if (delivery) {
          await delivery.update({
            courier: deliveryAccount.service,
            account_id: deliveryAccount.id,
            cn,
            slip_link: slip,
            status: "Booked",
          });
        } else {
          delivery = await Delivery.create({
            courier: deliveryAccount.service,
            account_id: deliveryAccount.id,
            cn,
            slip_link: slip,
            status: "Booked",
            order_id: order.id,
          });
        }
        await order.update({ status: "Booked" });
        await order.createHistory({
          user_id: req.user.id,
          event: `order booked with ${deliveryAccount?.service}, tracking number: ${cn}, brand no: ${order?.brand?.shipment_series}`,
        });
        await Brand.update(
          { shipment_series: order.brand.shipment_series + 1 },
          {
            where: {
              id: order.brand.id,
            },
          }
        );
        return sendSuccessResponse(
          res,
          200,
          { delivery },
          "Operation successful"
        );
      }
      return sendErrorResponse(res, 500, error, response);
    } catch (error) {
      console.error(error);
      return sendErrorResponse(
        res,
        500,
        "Could not perform operation at this time, kindly try again later.",
        error
      );
    }
  },

  async bulkBooking(socket) {
    try {
      const orders = await _orderService.loadTodayReadyForBookingOrders();
      socket.emit("booking:count", orders.length);
      const bookingService = new BookingService();
      for (const order of orders) {
        const bookingResponse = await bookingService.bookParcelWithCourier(
          order,
          order.courier.get()
        );
        const { cn, slip, isSuccess, error, response } = bookingResponse || {};
        console.log(bookingResponse, "bookingResponse");
        if (isSuccess) {
          let delivery = await Delivery.findOne({
            where: { order_id: order.id },
          });
          console.log(delivery?.get(), "delivery found for order");
          if (delivery) {
            await delivery.update({
              courier: deliveryAccount.service,
              account_id: deliveryAccount.id,
              cn,
              slip_link: slip,
              status: "Booked",
            });
          } else {
            delivery = await Delivery.create({
              courier: deliveryAccount.service,
              account_id: deliveryAccount.id,
              cn,
              slip_link: slip,
              status: "Booked",
              order_id: order.id,
            });
          }
          await order.update({ status: "Booked" });
          await order.createHistory({
            user_id: req.user.id,
            event: `order booked with ${deliveryAccount?.service}, tracking number: ${cn}, brand no: ${order?.brand?.shipment_series}`,
          });
          await Brand.update(
            { shipment_series: order.brand.shipment_series + 1 },
            {
              where: {
                id: order.brand.id,
              },
            }
          );
          socket.emit("booking:single:success", {
            courier: order.courier.service,
          });
        } else {
          await order.update({ status: `${order.status}/ErrorInBooking` });
          await order.createHistory({
            user_id: req.user.id,
            event: `Error while booking order, not booked with ${deliveryAccount?.service}. error ${error}`,
          });
          socket.emit("booking:single:error", {
            courier: order.courier.service,
          });
        }
      }
    } catch (error) {
      console.error(error);
    }
  },

  async cancelBooking(req, res) {
    try {
      const orderId = req.params.id;
      const order = await Order.findByPk(orderId, {
        attributes: ["id", "status"],
      });
      if (!order || order.status !== "Booked") {
        return sendErrorResponse(res, 500, "Order is not in booking!");
      }
      const delivery = await Delivery.findOne({
        where: {
          order_id: order.id,
        },
        include: {
          model: DeliveryServiceAccounts,
          as: "account",
          include: {
            model: Tokens,
            as: "tokens",
            attributes: ["token", "expiry", "type"],
          },
        },
      });
      if (!delivery) {
        return sendErrorResponse(
          res,
          500,
          "Delivery not found for this order!"
        );
      }
      const bookingService = new BookingService();
      const cancelBookingResponse =
        await bookingService.cancelBookingWithCourier(
          delivery.cn,
          delivery.account.get()
        );
      const { isSuccess, error, response } = cancelBookingResponse || {};
      console.log(cancelBookingResponse, "cancelBookingResponse");
      if (isSuccess) {
        await delivery.update({
          slip_link: "",
          status: "Booking Canceled",
          updatedAt: new Date().toISOString(),
        });
        await order.update({ status: "Booking Canceled" });
        await order.createHistory({
          user_id: req.user.id,
          event: "order booking cancel",
        });
        return sendSuccessResponse(res, 200, {}, "Operation successful");
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
        attributes: ["id", "status"],
      });
      if (!order || order?.status !== "Booked") {
        return sendErrorResponse(res, 500, "Order is not in booking!");
      }
      const delivery = await Delivery.findOne({
        where: {
          order_id: order.id,
        },
        include: {
          model: DeliveryServiceAccounts,
          as: "account",
          include: {
            model: Tokens,
            as: "tokens",
            attributes: ["token", "expiry", "type"],
          },
        },
      });
      console.log(delivery.get());
      if (!delivery) {
        return sendErrorResponse(
          res,
          500,
          "Delivery not found for this order!"
        );
      }
      const bookingService = new BookingService();
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
      console.log(bookingStatusResponse, "status response");
      if (isSuccess) {
        return sendSuccessResponse(
          res,
          200,
          { data, history, status, date, remarks, error, response },
          "Operation successful"
        );
      }
      return sendErrorResponse(res, 500, error, response);
    } catch (error) {
      logger.error("error", error, {
        stack: "in delivery status function order controller",
      });
      return sendErrorResponse(
        res,
        500,
        "Could not perform operation at this time, kindly try again later.",
        error
      );
    }
  },
};
