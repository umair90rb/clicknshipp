import connection from '../config/redis';
import { Queue } from 'bullmq';

const deliveryStatusSyncQueue = new Queue('deliveryStatusSyncQueue', {
  connection,
});

export default deliveryStatusSyncQueue;
