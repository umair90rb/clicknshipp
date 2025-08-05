import { Worker } from 'bullmq';
import { Op } from 'sequelize';
import connection from '../config/redis';
import {
  address_data_keys,
  customer_data_keys,
  item_data_keys,
  order_data_keys,
} from '../constants/constants';
import formatPhoneNumber from '../helpers/formatPhone';
import model from '../models';
import { ORDER_PROCESSING_QUEUE_NAME } from '../queues/orderProcessingQueue';
import _orderService from '../services/OrderService';
import { extract } from '../utils/extract';

const {
  Order,
  OrderItem,
  Customer,
  Chanel,
  ShopifyWebhookLog
} = model;

const orderFulfillWorker = new Worker(
  ORDER_PROCESSING_QUEUE_NAME,
  async (job) => {
    const { logId, payload, shopDomain, topic, webhookId } = job.data;

    try {
      let chanel;
      if (shopDomain) {
        chanel = await Chanel.findOne({
          where: {
            source: {
              [Op.iLike]: shopDomain,
            },
          },
        });
      }

      const order_data = extract(payload, order_data_keys);
      const address_data = extract(payload['shipping_address'], address_data_keys);
      let customer_data = extract(payload['customer'], customer_data_keys);
      customer_data.phone = formatPhoneNumber(
        !!customer_data.phone ? customer_data.phone : address_data.phone
      );
      customer_data = { shopify_id: customer_data.id, ...customer_data };
      delete customer_data.id;
      const order_items_data = payload['line_items'].map((item) =>
        extract(item, item_data_keys)
      );
      let order = await Order.create({
        ...order_data,
        chanel_id: chanel?.id,
        brand_id: chanel?.brand_id,
      });

      let [customer, created] = await Customer.findOrCreate({
        where: { phone: customer_data?.phone },
        defaults: customer_data,
        raw: true,
      });
      await order.setCustomer(customer.id);
      const address = await order.createAddress(address_data);
      await address.setCustomer(customer.id);
      const items = await OrderItem.bulkCreate(order_items_data);
      await order.addItems(items);
      await order.createHistory({ event: 'order create via shopify web hook' });
      order = await _orderService.loadFullOrder(order.id);
      await _orderService.checkOrderDuplication(order);
      const result = await ShopifyWebhookLog.update(
        { status: 'processed', processed_at: new Date() },
        { where: { id: logId } }
      );
      console.log('Order processing completed +++++++++++++++++++++', result)

    } catch (err) {
      console.log('Order processing completed +++++++++++++++++++++', err)
      await ShopifyWebhookLog.update(
        {
          status: 'failed',
          error_message: err.message,
        },
        { where: { id: logId } }
      );
      throw err; // allow Bull to retry
    }
  },
  {
    connection,
  }
);

export default orderFulfillWorker;
