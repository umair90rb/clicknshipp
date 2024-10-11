import { Worker } from 'bullmq';
import connection from '../config/redis';
import _orderService from '../services/OrderService';
import deliveryServiceAccountService from '../services/DeliveryServiceAccountService';
import bookingService from '../services/BookingService';

const bookingWorker = new Worker(
  'deliveryStatusSyncQueue',
  async (job) => {
    const { id, cn, deliveryAccountId } = job.data;
    console.log(
      `tracking delivery ${id} with cn ${cn} and delivery account ${deliveryAccountId}`
    );
    const deliveryAccount =
      await deliveryServiceAccountService.getAccountWithToken(
        deliveryAccountId
      );
    console.log(`delivery account found ${deliveryAccount.get()}`);
    const parcelStatusRes = await bookingService.checkParcelStatusWithCourier(
      cn,
      deliveryAccount
    );
    console.log(`parcel status ${parcelStatusRes}`);
    await _orderService.updateOrderDeliveryStatus(parcelStatusRes, id);
  },
  {
    connection,
  }
);

export default bookingWorker;
