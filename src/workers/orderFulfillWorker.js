import { Worker } from 'bullmq';
import connection from '../config/redis';
import _orderService from '../services/OrderService';

const orderFulfillWorker = new Worker(
  'bookingQueue',
  async (job) => {
    await _orderService.fulfillOrder(...job.data);
  },
  {
    connection,
  }
);

export default orderFulfillWorker;
