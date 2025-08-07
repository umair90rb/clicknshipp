import { Queue } from 'bullmq';
import connection from '../config/redis';

export const ORDER_PROCESSING_QUEUE_NAME = 'orderProcessingQueue';

export const orderProcessingQueue = new Queue(ORDER_PROCESSING_QUEUE_NAME, {
  connection,
});

export default async function addToOrderProcessingQueue(data) {
  try {
    return orderProcessingQueue.addBulk(
      data.map((d) => ({
        name: ORDER_PROCESSING_QUEUE_NAME,
        data: d,
        opts: {
          removeOnComplete: true,
          removeOnFail: true,
        },
      }))
    );
  } catch (error) {
    return console.log(error, 'in', ORDER_PROCESSING_QUEUE_NAME);
  }
}
