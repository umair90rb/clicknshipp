import { Worker } from 'bullmq';
import connection from '../config/redis';
import _orderService from '../services/OrderService';

const orderFulfillWorker = new Worker(
  'orderFulfillQueue',
  async (job) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('order fulfill stopped due to development');
      return;
    }
    console.log(`${job.id} started with ${JSON.stringify(job)}`);
    return _orderService
      .fulfillOrder(job.data)
      .catch((e) => console.log(e, 'in fullfil worker'));
  },
  {
    connection,
  }
);

export default orderFulfillWorker;
