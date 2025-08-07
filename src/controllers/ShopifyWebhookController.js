import model from '../models/index';
import addToOrderProcessingQueue from '../queues/orderProcessingQueue';
const { ShopifyWebhookLog } = model;
// required
// const SHOPIFY_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET;

// function verifyHmac(req) {
//   const hmacHeader = req.get('X-Shopify-Hmac-Sha256');
//   const generatedHmac = createHmac('sha256', SHOPIFY_SECRET)
//     .update(req.rawBody, 'utf8')
//     .digest('base64');

//   return timingSafeEqual(Buffer.from(generatedHmac), Buffer.from(hmacHeader));
// }
export default {
  async createOrder(req, res) {
    try {
      // Verify HMAC
      // if (!verifyHmac(req)) {
      //   return res.status(401).send('Unauthorized');
      // }

      const topic = req.get('X-Shopify-Topic');
      const webhookId = req.get('X-Shopify-Webhook-Id');
      const shopDomain = req.get('X-Shopify-Shop-Domain');
      const payload = req.body;

      // Log webhook
      const log = await ShopifyWebhookLog.create({
        shop_domain: shopDomain,
        topic,
        webhook_id: webhookId,
        payload,
      });

      // Add job to Bull queue
      await addToOrderProcessingQueue([{
        logId: log.id,
        shopDomain,
        topic,
        webhookId,
        payload,
      }])

      return res.status(200).send('OK');
    } catch (err) {
      console.error('Webhook error:', err);
      return res.status(500).send('Server error');
    }
  },
};
