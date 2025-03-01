import connection from '../config/redis';
import { Queue } from 'bullmq';

const orderFulfillQueue = new Queue('orderFulfillQueue', {
  connection,
});

export default async function addToOrderFulfillQueue(data) {
  try {
    const jobId = `orderFulfillQueue-${data.orderId}${data.chanelId}`;
    const job = await orderFulfillQueue.getJob(jobId);
    if (!job) {
      return orderFulfillQueue.add('orderFulfillQueue', data, {
        jobId,
        removeOnComplete: true,
        removeOnFail: true,
      });
    }
  } catch (error) {
    return console.log(error, 'in addToOrderFulfillQueue');
  }
}
