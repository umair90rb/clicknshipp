import CourierInterface from '../../interfaces/courierInterface';
import getAxiosInstance from '../AxiosService';
import models from '../../models';
import { Op } from 'sequelize';
import logger from '../../middleware/logger';
import { addDaysToCurrentDate } from '../../helpers/pgDateFormat';
import { isExpired } from '../../helpers/pgDateFormat';
const { CityNameMaping, Tokens } = models;

class DigiCourier extends CourierInterface {
  constructor() {
    super();
    this.baseURL = 'https://digidokaan.pk/api/v1/digidokaan/';
    this.http = getAxiosInstance(this.baseURL, {});
  }

  async login(phone, password) {
    let res, reqOptions;
    try {
      let headersList = {
        Accept: '*/*',
      };

      reqOptions = {
        url: `${this.baseURL}auth/login?phone=${phone}&password=${password}`,
        method: 'POST',
        headers: headersList,
      };

      res = await this.http.request(reqOptions);
      const { code, msg, user, token, error } = res.data;
      if (code === 200) {
        return {
          token,
          expiry: addDaysToCurrentDate(1),
        };
      }
      throw new Error(error);
    } catch (error) {
      logger.log('error', error.message, {
        reqOptions,
        error: error?.data,
      });
      throw error;
    }
  }

  async refreshToken(token) {
    let res, reqOptions;
    try {
      let headersList = {
        Accept: '*/*',
        Authorization: `Bearer ${token}`,
      };

      reqOptions = {
        url: `${this.baseURL}auth/refresh_token`,
        method: 'POST',
        headers: headersList,
      };

      res = await this.http.request(reqOptions);
      const { code, status, token: refreshedToken, message } = res.data;
      if (code === 200) {
        return {
          token: refreshedToken,
          expiry: addDaysToCurrentDate(1),
        };
      }
      throw new Error(message);
    } catch (error) {
      logger.log('error', error.message, {
        reqOptions,
        error: error?.data,
      });
      throw error;
    }
  }

  saveToken(account_id, token, expiry) {
    return Tokens.destroy({ where: { account_id } })
      .then(() => Tokens.create({ account_id, token, expiry, type: 'auth' }))
      .then(() => ({ token, expiry }))
      .catch((error) => {
        throw error;
      });
  }

  getToken(deliveryAccount) {
    if (!deliveryAccount.tokens || deliveryAccount.tokens.length === 0) {
      return this.login(deliveryAccount.username, deliveryAccount.password)
        .then(({ token, expiry }) =>
          this.saveToken(deliveryAccount.id, token, expiry)
        )
        .then(({ token }) => token)
        .catch((error) => {
          throw error;
        });
    }
    const { token, expiry } = deliveryAccount.tokens[0];
    if (isExpired(expiry)) {
      return this.refreshToken(token)
        .then(({ token, expiry }) =>
          this.saveToken(deliveryAccount.id, token, expiry)
        )
        .then(({ token }) => token)
        .catch((error) => {
          throw error;
        });
    }
    return token;
  }

  async bookParcel(order, deliveryAccount) {
    let res, url, headersList, reqOptions;
    const token = await this.getToken(deliveryAccount);
    headersList = {
      Accept: '*/*',
      Authorization: `Bearer ${token}`,
    };
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

      url = `order-book?seller_number=${
        deliveryAccount.username
      }&buyer_number=%2B92${
        order.customer.phone
      }&buyer_name=${encodeURIComponent(
        order.customer.first_name + ' ' + order.customer.last_name || ''
      )}&buyer_address=${order.address.address1}&buyer_city=${
        destinationCity.assigned_id
      }&piece=1&amount=${order.total_price}&external_reference_no=Sukooonx${
        order.order_number
      }&weight=0.25&product_name=${order.items.reduce(
        (p, c, i) =>
          i > 0 ? `${c.name}/${c.quantity}-${p}` : `${c.name}/${c.quantity}`,
        ''
      )}&shipment_type=1&special_instruction=rush%20delivery&store_url=sukooon.com&business_name=Sukooon&origin=Faisalabad&gateway_id=${
        deliveryAccount.key
      }&shipper_address=shop%20no%20SF%2015%20second%20floor%20lavish%20mall%20tariq%20road%20opposite%20rabi%20cente&shipper_name=Sukooon&shipper_phone=${
        deliveryAccount.username
      }&shipment_type=1&pickup_id=${deliveryAccount.cost_center}`;

      reqOptions = {
        url: `${this.baseURL}${url}`,
        method: 'POST',
        headers: headersList,
      };

      res = await this.http.request(reqOptions);
      logger.log('info', 'digi book parcel api res', {
        res: res.data,
      });
      console.log(res.data, '+++++++++++++++=');
      const { code, msg, data, message, status } = res.data;
      if (code === 200) {
        const {
          tracking_no,
          delivery_charges,
          slip_link,
          load_sheet_id,
          order_no,
          pdf_link,
        } = data;
        return {
          cn: tracking_no,
          slip:
            slip_link ||
            JSON.stringify({
              order_no,
              load_sheet_id,
              pdf_link,
              delivery_charges,
            }),
          isSuccess: true,
          error: null,
          response: msg,
        };
      } else {
        return {
          cn: null,
          slip: null,
          isSuccess: false,
          error: message,
          response: status,
        };
      }
    } catch (error) {
      const { Response, ...rest } = res.data;
      logger.log('error', error.message, {
        data: res.data,
        stack: 'in call courier booking function',
      });
      return {
        cn: null,
        slip: null,
        isSuccess: false,
        error: Response,
        response: Response,
      };
    }
  }

  async checkParcelStatus(trackingNumber, deliveryAccount) {
    let response;
    try {
      response = await this.http.get(`GetTackingHistory?cn=${trackingNumber}`);
      logger.log('info', 'leopard booking status,s api response', {
        res: response.data,
      });
      const history = response.data.revers();
      return {
        isSuccess: true,
        error: null,
        history,
        status: history[0]?.ProcessDescForPortal,
        date: history[0]?.TransactionDate,
        remarks: null,
        data: {},
        response: 'Current Booking status!',
      };
    } catch (error) {
      logger.log('error', error.message, {
        res: response.data,
      });
      return {
        isSuccess: false,
        error,
        history: response.data,
        status: null,
        date: null,
        remarks: null,
        data: {},
        response: 'Error in fetching current booking status!',
      };
    }
  }

  cancelBooking(trackingNumber, deliveryAccount) {
    return {
      isSuccess: false,
      error: 'Cancel booking not available for Call Courier',
      response: trackingNumber,
    };
  }

  downloadReceipt(trackingNumber, deliveryAccount) {
    // Implementation for downloading receipt via TCS
  }
}

export default DigiCourier;
