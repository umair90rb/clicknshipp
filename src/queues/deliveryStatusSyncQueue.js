import connection from '../config/redis';
import { Queue } from 'bullmq';

const deliveryStatusSyncQueue = new Queue('deliveryStatusSyncQueue', {
  connection,
  removeOnComplete: true,
  removeOnFail: true,
});

export default deliveryStatusSyncQueue;
