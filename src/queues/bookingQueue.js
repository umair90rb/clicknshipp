import connection from '../config/redis';
import { Queue } from 'bullmq';

const bookingQueue = new Queue('bookingQueue', {
  connection,
  removeOnComplete: true,
  removeOnFail: true,
});

export default bookingQueue;
