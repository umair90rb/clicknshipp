import { Worker } from 'bullmq';
import connection from '../config/redis';
import _orderService from '../services/OrderService';
import deliveryServiceAccountService from '../services/DeliveryServiceAccountService';
import bookingService from '../services/BookingService';

const bookingWorker = new Worker(
  'deliveryStatusSyncQueue',
  async (job) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('sync completed in development');
      return;
    }
    const { id, cn, account_id, order_id } = job.data;
    if (!account_id) {
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
      return;
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
