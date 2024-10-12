import { Worker } from 'bullmq';
import connection from '../config/redis';
import _orderService from '../services/OrderService';
import deliveryServiceAccountService from '../services/DeliveryServiceAccountService';
import bookingService from '../services/BookingService';

const bookingWorker = new Worker(
  'deliveryStatusSyncQueue',
  async (job) => {
    const { id, cn, account_id } = job.data;
    console.log(
      `tracking delivery ${id} with cn ${cn} and delivery account ${account_id}`
    );
    if (!account_id) {
      console.log(`tracking delivery stopped, no delivery account id provided`);
      return;
    }
    if (!cn || typeof parseInt(cn) !== 'number') {
      console.log(`tracking delivery stopped, no cn provided`);
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
    await _orderService.updateOrderDeliveryStatus(parcelStatusRes, id);
  },
  {
    connection,
  }
);

export default bookingWorker;
