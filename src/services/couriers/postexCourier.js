import { Op } from 'sequelize';
import CourierInterface from '../../interfaces/courierInterface';
import logger from '../../middleware/logger';
import models from '../../models';
import getAxiosInstance from '../AxiosService';
const { CityNameMaping } = models;

class PostexCourier extends CourierInterface {
  constructor() {
    super();
    this.http = getAxiosInstance(
      'https://api.postex.pk/services/integration/api/order/v3/',
      {
        'Content-Type': 'application/json',
      }
    );
  }

  async bookParcel(order, deliveryAccount) {
    let response, body;
    try {
      const destinationCity = await CityNameMaping.findOne({
        where: {
          city: {
            [Op.iLike]: order.address.city,
          },
          courier: deliveryAccount.service,
        },
        raw: true,
      });
      if (!destinationCity) {
        return {
          cn: null,
          slip: null,
          isSuccess: false,
          error: 'City not found in the database, contact admin',
          response: 'destination not found in the db',
        };
      }
      body = {
        cityName: destinationCity.maped,
        customerName: order.customer.name,
        customerPhone: `0${order.customer.phone}`,
        customerEmail: order.customer.email || 'customer@mail.com',
        deliveryAddress: `${order.address.address1}, ${order.address.city}`,
        invoiceDivision: 0,
        invoicePayment: order.total_price,
        items: order.items.length,
        orderDetail: order.items.reduce(
          (p, c, i) =>
            i > 0 ? `${c.name}/${c.quantity}-${p}` : `${c.name}/${c.quantity}`,
          ''
        ),
        orderRefNumber: `${order.order_number}`,
        orderType: 'Normal',
        transactionNotes: 'Rush Delivery',
        pickupAddressCode: '001', //required
        // storeAddressCode: "001", //required
      };
      const response = await this.http.post('create-order', body, {
        headers: { token: deliveryAccount.key },
      });
      logger.log('info', 'postex book api response', {
        data: response.data,
      });
      const { statusCode, statusMessage, dist } = response.data || {};
      const { trackingNumber, orderStatus, orderDate } = dist;
      return {
        cn: trackingNumber,
        slip: JSON.stringify({ orderDate, orderStatus }),
        isSuccess: statusCode !== '400',
        error: statusCode === '400' ? statusMessage : null,
        response: statusMessage,
      };
    } catch (error) {
      const { statusMessage } = response || {};
      logger.log('error', error.message, {
        body,
        res: response?.data,
        stack: 'in postex booking function',
      });
      return {
        cn: null,
        slip: null,
        isSuccess: false,
        error: error,
        response: statusMessage || 'Error: Something goes wrong!',
      };
    }
  }

  async checkParcelStatus(trackingNumber, deliveryAccount) {
    let response;
    try {
      response = await this.http.get(
        `https://api.postex.pk/services/integration/api/order/v1/track-order/${trackingNumber}`,
        {
          headers: { token: deliveryAccount.key },
        }
      );
      const { statusCode, statusMessage, dist } = response.data || {};
      const {
        transactionStatusHistory,
        transactionNotes,
        transactionStatus,
        transactionDate,
        ...rest
      } = dist || {};
      logger.log('info', 'postex booking status,s api response', {
        res: response.data,
      });
      return {
        history: transactionStatusHistory,
        status: transactionStatus,
        date: transactionDate,
        remarks: transactionNotes,
        data: {
          ...rest,
        },
        isSuccess: statusCode !== '400',
        error: statusCode === '400' ? statusMessage : null,
        response: statusMessage,
      };
    } catch (error) {
      logger.log('error', 'postex booking status api response', {
        body,
        res: response.data,
        stack: 'in postex checkparcel status function',
      });
      const { statusCode, statusMessage, dist } = response.data || {};
      return {
        isSuccess: false,
        data: {},
        history: [],
        status: null,
        date: null,
        remarks: null,
        error,
        response: statusMessage || 'Error in getting booking status!',
      };
    }
  }

  async cancelBooking(trackingNumber, deliveryAccount) {
    let response;
    try {
      const body = { trackingNumber };
      response = await this.http.put(
        'https://api.postex.pk/services/integration/api/order/v1/cancel-order',
        body,
        {
          headers: { token: deliveryAccount.key },
        }
      );
      console.log(response, 'postex cancel response');
      // logger.log('info', 'postex cancel booking parcel api response', {
      //   body,
      //   res: response?.data,
      // });
      const { statusCode, statusMessage } = response?.data || {};
      return {
        isSuccess: statusCode == '200' ? true : false,
        error: statusCode != '200' ? statusMessage : null,
        response: statusMessage,
      };
    } catch (error) {
      console.log(error, 'postex cancel error');
      logger.log('error', 'postex cancel booking parcel api error', {
        res: response?.data,
        stack: 'in postex cancel booking function',
      });
      return {
        isSuccess: false,
        error,
        response,
      };
    }
  }

  async downloadReceipt(trackingNumbers, deliveryAccount) {
    let trackingNumbersStr = '';
    try {
      if (trackingNumbers && trackingNumbers.length === 1) {
        trackingNumbersStr = `${trackingNumbers[0]}`;
      }
      if (trackingNumbers && trackingNumbers.length > 1) {
        trackingNumbersStr = trackingNumbers.reduce(
          (numbers, trackingNo) => `${trackingNo}, ${numbers}`,
          ''
        );
      }
      if (!trackingNumbersStr) {
        return {
          isSuccess: false,
          error: 'Empty tracking no! Enter at least one tracking id.',
          response: null,
        };
      }
      return this.http.get(
        `https://api.postex.pk/services/integration/api/order/v1/get-invoice?trackingNumbers=${trackingNumbersStr}`,
        {
          headers: { token: deliveryAccount.key },
          responseType: 'arraybuffer',
        }
      );
      // logger.log("info", "postex airways bill download response");
      // const { statusCode, statusMessage } = response?.data || {};
      // return {
      //   isSuccess: statusCode == "200" ? true : false,
      //   error: statusCode != "200" ? statusMessage : null,
      //   response: statusMessage,
      // };
    } catch (error) {
      logger.log('error', 'postex airways bill api error', {
        stack: error.stack,
      });
      throw error;
      // return {
      //   isSuccess: false,
      //   error,
      //   response,
      // };
    }
  }
}

export default PostexCourier;
