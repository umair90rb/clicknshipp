import { Worker } from "bullmq";
import connection from "../config/redis";
import _orderService from "../services/OrderService";
import deliveryServiceAccountService from "../services/DeliveryServiceAccountService";
import bookingService from "../services/BookingService";

const bookingWorker = new Worker(
  "bookingQueue",
  async (job) => {
    const { orderId, deliveryAccountId } = job.data;
    const order = await _orderService.loadOrderForBooking(orderId);
    console.log(order?.get());
    const deliveryAccount =
      await deliveryServiceAccountService.getAccountWithToken(
        deliveryAccountId
      );
    console.log(deliveryAccount?.get());
    const bookingRes = await bookingService.bookParcelWithCourier(
      order,
      deliveryAccount
    );
    console.log(bookingRes);
    await _orderService.updateOrderAfterBooking(
      bookingRes,
      order,
      deliveryAccount
    );
  },
  {
    connection,
  }
);

export default bookingWorker;
