import { Worker } from 'bullmq';
import connection from '../config/redis';
import _orderService from '../services/OrderService';
import deliveryServiceAccountService from '../services/DeliveryServiceAccountService';
import bookingService from '../services/BookingService';

const bookingWorker = new Worker(
  'deliveryStatusSyncQueue',
  async (job) => {
    const { id, cn, account_id, order_id } = job.data;
    console.log(
      `tracking delivery ${id} with cn ${cn} and delivery account ${account_id} and order id is ${order_id}`
    );
    if (!account_id) {
      console.log(`tracking delivery stopped, no delivery account id provided`);
      await _orderService.updateOrderDeliveryStatus(
        {
          isSuccess: false,
          error: 'No courier id provided',
          history: null,
          status: null,
        },
        id
      );
      return;
    }
    if (!cn) {
      console.log(`tracking delivery stopped, no cn provided`);
      await _orderService.updateOrderDeliveryStatus(
        {
          isSuccess: false,
          error: 'No CN provided',
          history: null,
          status: null,
        },
        id,
        order_id
      );
      return;
    }
    const deliveryAccount =
      await deliveryServiceAccountService.getAccountWithToken(account_id);
    if (!deliveryAccount) {
      console.log(`tracking delivery stopped, delivery account not found`);
    }
    const parcelStatusRes = await bookingService.checkParcelStatusWithCourier(
      cn,
      deliveryAccount
    );
    await _orderService.updateOrderDeliveryStatus(
      parcelStatusRes,
      id,
      order_id
    );
  },
  {
    connection,
  }
);

export default bookingWorker;
