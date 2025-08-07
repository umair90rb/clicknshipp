import { Worker } from 'bullmq';
import { Op } from 'sequelize';
import connection from '../config/redis';
import {
  address_data_keys,
  address_data_keys_from_notes,
  customer_data_keys,
  customer_data_keys_from_notes,
  item_data_keys,
  order_data_keys,
} from '../constants/constants';
import formatPhoneNumber from '../helpers/formatPhone';
import model from '../models';
import { ORDER_PROCESSING_QUEUE_NAME } from '../queues/orderProcessingQueue';
import _orderService from '../services/OrderService';
import { extract } from '../utils/extract';

const { Order, OrderItem, Customer, Chanel, ShopifyWebhookLog } = model;

const orderFulfillWorker = new Worker(
  ORDER_PROCESSING_QUEUE_NAME,
  async (job) => {
    const { logId, payload, shopDomain, topic, webhookId } = job.data;
    let order_number;

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
      order_number = order_data?.order_number;

      const notes_attributes = payload?.note_attributes?.reduce(
        (pv, { name, value }) => ({
          [name.toLowerCase().replaceAll(' ', '_')]: value,
          ...pv,
        }),
        {}
      );

      let address_data = extract(payload?.shipping_address, address_data_keys);
      let customer_data = extract(payload?.customer, customer_data_keys);

      if (!customer_data || !Object.keys(customer_data).length) {
        const customerDataFromNotes = extract(
          notes_attributes,
          customer_data_keys_from_notes
        );
        customer_data = {
          first_name: customerDataFromNotes?.full_name,
          ...customerDataFromNotes,
        };
      }

      if (!address_data || !Object.keys(address_data).length) {
        const addressDataFromNotes = extract(
          notes_attributes,
          address_data_keys_from_notes
        );
        address_data = {
          address1: addressDataFromNotes?.address,
          ...addressDataFromNotes,
        };
      }

      customer_data = { shopify_id: customer_data?.id, ...customer_data };
      delete customer_data?.id;

      if (Boolean(customer_data?.phone)) {
        customer_data['phone'] = formatPhoneNumber(customer_data?.phone);
      } else if (Boolean(address_data?.phone)) {
        customer_data['phone'] = formatPhoneNumber(address_data?.phone);
      } else if (Boolean(address_data?.phone)) {
        customer_data['phone'] = formatPhoneNumber(address_data?.phone);
      }

      let [customer] = await Customer.findOrCreate({
        where: { phone: customer_data?.phone },
        defaults: customer_data,
        raw: true,
      });

      let order = await Order.create({
        ...order_data,
        chanel_id: chanel?.id,
        brand_id: chanel?.brand_id,
        customer_id: customer.id,
      });

      await order.createAddress({
        ...address_data,
        customer_id: customer.id,
      });

      const order_items_data = payload['line_items'].map((item) => ({
        ...extract(item, item_data_keys),
        order_id: order.id,
      }));

      await OrderItem.bulkCreate(order_items_data);

      await order.createHistory({ event: 'order create via shopify web hook' });

      // need to optimize this both or more necessary is checkOrderDuplication
      order = await _orderService.loadFullOrder(order.id);
      await _orderService.checkOrderDuplication(order);

      await ShopifyWebhookLog.update(
        {
          status: 'processed',
          processed_at: new Date(),
          order_id: `id:${order.id}-#${order_number}`,
          error: null
        },
        { where: { id: logId } }
      );
    } catch (err) {
      console.log(err);
      await ShopifyWebhookLog.update(
        {
          status: 'failed',
          error_message: `${err.stack}`,
          order_id: `#${order_number}`,
        },
        { where: { id: logId } }
      );
      throw err;
    }
  },
  {
    connection,
  }
);

export default orderFulfillWorker;
