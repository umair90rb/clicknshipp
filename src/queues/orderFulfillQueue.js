import connection from '../config/redis';
import { Queue } from 'bullmq';

const orderFulfillQueue = new Queue('orderFulfillQueue', {
  connection,
});

function addToOrderFulfillQueue(data) {
  const jobId = `orderFulfillQueue-${data.orderId}${data.chanelId}`;
  return orderFulfillQueue
    .getJob(jobId)
    .then(
      (job) =>
        !job &&
        orderFulfillQueue.add('orderFulfillQueue', data, {
          jobId,
          removeOnComplete: true,
          removeOnFail: true,
        })
    )
    .catch((error) => console.log(error, 'in addToOrderFulfillQueue'));
}

export default addToOrderFulfillQueue;
