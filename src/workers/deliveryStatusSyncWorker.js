import { Worker } from 'bullmq';
import connection from '../config/redis';
import _orderService from '../services/OrderService';
import deliveryServiceAccountService from '../services/DeliveryServiceAccountService';
import bookingService from '../services/BookingService';

const bookingWorker = new Worker(
  'deliveryStatusSyncQueue',
  async (job) => {
    const { id, cn, deliveryAccountId } = job.data;
    const deliveryAccount =
      await deliveryServiceAccountService.getAccountWithToken(
        deliveryAccountId
      );
    const parcelStatusRes = await bookingService.checkParcelStatusWithCourier(
      cn,
      deliveryAccount
    );
    await _orderService.updateOrderDeliveryStatus(parcelStatusRes, id, cn);
  },
  {
    connection,
  }
);

export default bookingWorker;
