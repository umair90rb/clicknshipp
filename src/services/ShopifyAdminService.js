import getAxiosInstance from './AxiosService';

const API_VERSION = '2024-10';

export default class ShopifyAdminService {
  constructor(store, token) {
    const url = `https://${store}/admin/api/${API_VERSION}/`;
    const headers = {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json',
    };
    this.http = getAxiosInstance(url, headers);
  }

  getOrderFulfillments(orderId) {
    try {
      if (!orderId) {
        throw new Error('Order id is required!');
      }
      return this.http.get(`orders/${orderId}/fulfillment_orders.json`);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  createOrderFulfillment(orderFulfillmentId) {
    try {
      if (!orderFulfillmentId) {
        throw new Error('Order fulfillment id is required!');
      }
      const body = {
        fulfillment: {
          line_items_by_fulfillment_order: [
            {
              fulfillment_order_id: orderFulfillmentId,
            },
          ],
        },
      };
      return this.http.post(`fulfillments.json`, body);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  fulfillOrder(orderId) {
    return this.getOrderFulfillments(orderId)
      .then((orderFulfillmentsRes) =>
        this.createOrderFulfillment(
          orderFulfillmentsRes?.data?.fulfillment_orders[0]['id']
        )
      )
      .catch((e) => {
        console.log(e?.message, 'in shopify fulfill order');
      });
  }
}
