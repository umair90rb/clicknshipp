import { schedule } from 'node-cron';
import { Op, literal } from 'sequelize';
import logger from '../middleware/logger';
import model from '../models';
import addToOrderProcessingQueue, {
  orderProcessingQueue,
} from '../queues/orderProcessingQueue';
const { ShopifyWebhookLog } = model;

const every5Sec = '*/5 * * * * *';
const every10Min = ' */10 * * * *';

// schedule(every5Sec, async () => {
  schedule(every10Min, async () => {
  try {
    if (process.env.NODE_ENV !== 'production') {
      return;
    }
    const pendingJobs = await orderProcessingQueue.count();
    if (pendingJobs) {
      return;
    }

    const failedWebhooks = await ShopifyWebhookLog.findAll({
      attributes: ['id', 'shop_domain', 'topic', 'webhook_id', 'payload'],
      where: { [Op.and]: [{ status: 'failed' }, { retries: { [Op.lte]: 2 } }] },
      order: [['received_at', 'DESC']],
      limit: 10,
      raw: true,
    });
    console.log(failedWebhooks.length);

    if (!failedWebhooks?.length) {
      console.log('No failed order to retry!');
      return;
    }
    await addToOrderProcessingQueue(
      failedWebhooks.map((failedWebhook) => ({
        logId: failedWebhook.id,
        shopDomain: failedWebhook.shop_domain,
        topic: failedWebhook.topic,
        webhookId: failedWebhook.webhook_id,
        payload: failedWebhook.payload,
      }))
    );

    await ShopifyWebhookLog.update(
      { retries: literal('retries + 1') },
      { where: { id: { [Op.in]: failedWebhooks.map((f) => f.id) } } }
    );
  } catch (error) {
    logger.error('Error in orders retryFailedOrder jobs');
    console.log(error);
  }
});
