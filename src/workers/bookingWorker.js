import { Worker } from "bullmq";
import connection from "../config/redis";
import _orderService from "../services/OrderService";
import deliveryServiceAccountService from "../services/DeliveryServiceAccountService";
import bookingService from "../services/BookingService";

const bookingWorker = new Worker(
  "bookingQueue",
  async (job) => {
    console.log(`Processing booking order: ${job.id} with data:`, job.data);
    const { orderId, deliveryAccountId } = job.data;
    const order = await _orderService.loadOrderForBooking(orderId);
    console.log(`Order found: ${order.id} `);
    const deliveryAccount =
      await deliveryServiceAccountService.getAccountWithToken(
        deliveryAccountId
      );
    console.log(`delivery account found: ${order.id} `);
    const bookingRes = await bookingService.bookParcelWithCourier(
      order,
      deliveryAccount
    );
    console.log(`Order booked: ${bookingRes}`);
    const delivery = await _orderService.updateOrderAfterBooking(
      bookingRes,
      order,
      deliveryAccount
    );
    console.log(`Order updated, here is delivery: ${delivery.get()}`);
  },
  {
    connection,
  }
);

export default bookingWorker;
