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
    if (!deliveryAccountId) {
      console.log(`tracking delivery stopped, no delivery account id provided`);
      return;
    }
    if (!cn) {
      console.log(`tracking delivery stopped, no cn provided`);
      return;
    }
    const deliveryAccount =
      await deliveryServiceAccountService.getAccountWithToken(
        deliveryAccountId
      );
    if (!deliveryAccount) {
      console.log(`tracking delivery stopped, delivery account not found`);
    }
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
