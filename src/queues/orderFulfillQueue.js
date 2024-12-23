import connection from '../config/redis';
import { Queue } from 'bullmq';

const orderFulfillQueue = new Queue('orderFulfillQueue', {
  connection,
});

export default orderFulfillQueue;
