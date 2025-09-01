import CourierInterface from '../../interfaces/courierInterface';
import logger from '../../middleware/logger';
import models from '../../models';
import getAxiosInstance from '../AxiosService';
const { CityNameMaping } = models;

class AHLCourier extends CourierInterface {
  constructor() {
    super();
    this.http = getAxiosInstance('https://admin.ahlogistic.pk/api/', {});
  }

  async bookParcel(order, deliveryAccount) {
    let response, body;
    try {
      // const destinationCity = await CityNameMaping.findOne({
      //   where: {
      //     city: {
      //       [Op.iLike]: order.address.city,
      //     },
      //     courier: deliveryAccount.service,
      //   },
      //   raw: true,
      // });
      // if (!destinationCity) {
      //   return {
      //     cn: null,
      //     slip: null,
      //     isSuccess: false,
      //     error: 'City not found in the database, contact admin',
      //     response: 'destination not found in the db',
      //   };
      // }
      body = {
        vendor_id: parseInt(deliveryAccount.key),
        consignee_phone: `0${order.customer.phone}`,
        consignee_first_name: order.customer.first_name,
        consignee_last_name: order.customer.last_name,
        consignee_email: order.customer?.email || '',
        consignee_address: `${order.address.address1} ${order.address.city}`,
        consignee_country: 166,
        consignee_state: 2728,
        consignee_city: 31456,
        consignment_order_id: `${order.order_number}`,
        consignment_order_type: 1,
        consignment_cod_price: order.total_price,
        vendor_weight_id: parseInt(deliveryAccount.client_id),
        consignment_packaging: 1,
        consignment_pieces: 1,
        consignment_pickup_location: deliveryAccount.cost_center,
        consignment_origin_city: 31456,
        consignment_description: `${order.items.reduce(
          (p, c, i) =>
            i > 0 ? `${c.name}/${c.quantity}-${p}` : `${c.name}/${c.quantity}`,
          ''
        )}`,
      };
      response = await this.http.post('shopify-order', body);
      logger.log('info', 'ahl book parcel api response', {
        res: response.data,
        body,
      });
      const { order_parcel, message, status, error } = response.data || {};
      return {
        cn: order_parcel.order_reference,
        slip: message,
        isSuccess: Boolean(status),
        error: error ? error : null,
        response: status
          ? 'Package booked with ahl'
          : 'Error: Something goes wrong!',
      };
    } catch (_error) {
      logger.log('error', _error.message, {
        body,
        res: response?.data,
        stack: _error.stack,
      });
      const { message, error } = response?.data || {};
      return {
        cn: null,
        slip: message,
        isSuccess: false,
        error: JSON.stringify(error),
        response: 'Error: Something goes wrong!',
      };
    }
  }

  async checkParcelStatus(trackingNumber, deliveryAccount) {
    let response, body;
    try {
      body = {
        order_reference_no: trackingNumber,
      };
      response = await this.http.post('shopify-detail-tracking-api', body);
      // logger.log('info', 'leopard booking status,s api response', {
      //   body,
      //   res: response.data,
      // });
      const { status, message, tracking_history } = response.data || {};
      const parcel = tracking_history[tracking_history.length - 1] || {};
      const { date_time, status: parcelStatus, status_reason } = parcel || {};
      const history = tracking_history || [];
      return {
        isSuccess: Boolean(status),
        error: null,
        history,
        status: parcelStatus,
        date: date_time,
        remarks: status_reason,
        data: {
          history,
        },
        response: message,
      };
    } catch (_error) {
      logger.log('error', 'ahl booking status api response', {
        body,
        res: response.data,
      });
      const { status, message } = response.data;
      return {
        isSuccess: Boolean(status),
        data: {},
        history: [],
        status: null,
        date: null,
        remarks: null,
        error: message,
        response: 'Error in getting booking status!',
      };
    }
  }

  async cancelBooking(trackingNumber, deliveryAccount) {
    let response, body;
    try {
      body = {
        order_reference_no: trackingNumber,
      };
      response = await this.http.post('shopify-order-cancel', body);
      logger.log('info', 'ahl cancel booking parcel api response', {
        body,
        res: response.data,
      });
      const { status, error, message, order_decline } = response.data;
      return {
        isSuccess: Boolean(status),
        error,
        response: status === 0 ? error : message || 'Booking canceled!',
      };
    } catch (_error) {
      logger.log('error', 'ahl cancel booking parcel api error', {
        body,
        res: response.data,
      });
      return {
        isSuccess: false,
        error: null,
        response: 'Error in booking cancellation!',
      };
    }
  }

  downloadReceipt(trackingNumber) {
    // Implementation for downloading receipt via TCS
  }
}

export default AHLCourier;
