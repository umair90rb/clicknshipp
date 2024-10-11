import logger from '../../middleware/logger';
import CourierInterface from '../../interfaces/courierInterface';
import getAxiosInstance from '../AxiosService';
import models from '../../models';
import { Op } from 'sequelize';
const { CityNameMaping } = models;

class MnpCourier extends CourierInterface {
  constructor() {
    super();
    this.http = getAxiosInstance('https://mnpcourier.com/mycodapi/api/');
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
        username: deliveryAccount.username,
        password: deliveryAccount.password,
        consigneeName: `${order.customer.first_name} ${
          order.customer.last_name || ''
        }`,
        consigneeAddress: order.address.address1,
        consigneeMobNo: `0${order.customer.phone}`,
        consigneeEmail: order.customer.email || '',
        destinationCityName: destinationCity.maped,
        pieces: order.items.length,
        weight: 0.5,
        codAmount: order.total_price,
        custRefNo: `Sukooonx${order.order_number}`,
        productDetails: order.items.reduce(
          (p, c, i) =>
            i > 0 ? `${c.name}/${c.quantity}-${p}` : `${c.name}/${c.quantity}`,
          ''
        ),
        fragile: 'NO',
        service: 'O',
        remarks: 'Please call before delivery',
        insuranceValue: '0',
      };
      response = await this.http.post('Booking/InsertBookingData', body, {
        headers: { Authorization: deliveryAccount.key },
      });
      logger.log('info', 'mnp book parcel api response', {
        res: response?.data,
        body,
      });
      const {
        message,
        isSuccess,
        orderReferenceId: tracking_number,
      } = response?.data[0] || {};
      return {
        cn: isSuccess ? tracking_number : null,
        slip: JSON.stringify({ message, isSuccess, tracking_number }),
        isSuccess,
        error: !isSuccess ? message : null,
        response: message,
      };
    } catch (error) {
      logger.log('error', error.message, {
        body,
        res: response?.data,
        stack: 'in mnp booking function',
      });
      const { message, isSuccess, orderReferenceId } = response?.data || {};
      return {
        cn: null,
        slip: null,
        isSuccess,
        error: message,
        response: 'Error: Something goes wrong!',
      };
    }
  }

  async checkParcelStatus(trackingNumber, deliveryAccount) {
    let response;
    try {
      response = await this.http.get(
        `Tracking/Consignment_Tracking?username=${deliveryAccount.username}&password=${deliveryAccount.password}&consignment=${trackingNumber}`
      );
      logger.log('info', 'mnp check parcel status api response', {
        res: response.data,
      });
      const { message, isSuccess, tracking_Details } = response.data[0] || {};
      const tracking_history = tracking_Details[0] || {};
      return {
        isSuccess,
        error: !isSuccess ? message : null,
        history: tracking_history,
        status: tracking_history?.CNStatus,
        date: tracking_history?.BookingDate,
        remarks: null,
        data: {
          tracking_history,
        },
        response: message,
      };
    } catch (error) {
      const { message, status, details } = response.data || {};
      logger.log('error', error.message, {
        res: response.data,
        stack: 'in mnp check parcel status function',
      });
      return {
        isSuccess: false,
        error: message,
        history: [],
        status: null,
        date: null,
        remarks: null,
        data: {
          details,
        },
        response: message,
      };
    }
  }

  async cancelBooking(trackingNumber, deliveryAccount) {
    let response;
    try {
      response = await this.http.post(
        'cancel',
        {
          tracking_number: trackingNumber,
        },
        {
          headers: { Authorization: deliveryAccount.key },
        }
      );
      logger.log('info', 'trax cancel api response', {
        res: response.data,
      });
      const { message, status } = response.data || {};
      return {
        isSuccess: Boolean(status === 0),
        error: status > 0 ? message : null,
        response: message,
      };
    } catch (error) {
      const { message, status } = response.data || {};
      logger.log('error', error.message, {
        res: response.data,
        stack: 'in trax cancel function',
      });
      return {
        isSuccess: false,
        error: message,
        response: 'Error in cancel booking',
      };
    }
  }

  downloadReceipt(trackingNumber, deliveryAccount) {
    // Implementation for downloading receipt via TCS
  }
}

export default MnpCourier;
