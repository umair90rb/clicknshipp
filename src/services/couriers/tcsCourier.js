import CourierInterface from '../../interfaces/courierInterface';
import getAxiosInstance from '../AxiosService';
import models from '../../models';
import logger from '../../middleware/logger';
import { Op } from 'sequelize';
import { isToday } from 'date-fns';
const { CityNameMaping } = models;

class TCSCourier extends CourierInterface {
  constructor() {
    super();
    this.baseURL = 'https://connect.tcscourier.com';
    // this.baseURL = "https://devconnect.tcscourier.com";
    // dev env url => https://devconnect.tcscourier.com/
    this.http = getAxiosInstance(this.baseURL, {});
  }
  async getHeaderToken(id, secret) {
    let res, reqOptions;
    try {
      let headersList = {
        Accept: '*/*',
      };

      reqOptions = {
        // for dev encoding not work
        url: `${this.baseURL}/auth/api/auth?ClientID=${encodeURIComponent(
          id
        )}&ClientSecret=${encodeURIComponent(secret)}`,
        // url: "https://devconnect.tcscourier.com/auth/api/auth?ClientID=215610059&ClientSecret=9FL9ytYL4aM18RJJpYsn%2FroB9bFXVDqPfSzfTggJz4yWM6zcgSvaiVNfC%2BTh7NABGwT1tXusCAZpFw79jLDP6kWO4BWgXWeL26U5C0qCdWZ7TepwOPxyTdzVhz5OIPPz",
        method: 'GET',
        headers: headersList,
      };

      res = await this.http.request(reqOptions);
      return {
        token: res?.data?.result?.accessToken,
        expiry: res?.data?.result?.expiry,
      };
    } catch (error) {
      logger.log('error', error.message, {
        reqOptions,
        error: error?.data,
      });
      throw error;
    }
  }

  async getBodyToken(token, username, password) {
    let res, reqOptions;
    try {
      let headersList = {
        Accept: '*/*',
        Authorization: `Bearer ${token}`,
      };

      reqOptions = {
        url: `${
          this.baseURL
        }/ecom/api/authentication/token?username=${encodeURIComponent(
          username
        )}&password=${encodeURIComponent(password)}`,
        method: 'GET',
        headers: headersList,
      };

      res = await this.http.request(reqOptions);
      return { token: res?.data?.accesstoken, expiry: res?.data?.expiry };
    } catch (error) {
      logger.log('error', 'tcs get body token api response', {
        reqOptions,
        error: error?.data,
      });
      throw error;
    }
  }

  getTokensFromAccount(deliveryAccount) {
    if (!deliveryAccount.tokens || deliveryAccount.tokens.length === 0) {
      throw new Error('TCS tokens not found!');
    }
    const tokens = deliveryAccount.tokens;
    const { token: headerToken, expiry: headerTokenExpiry } = tokens.find(
      (token) => token.type === 'header'
    );
    const { token: bodyToken, expiry: bodyTokenExpiry } = tokens.find(
      (token) => token.type === 'body'
    );
    if (isToday(headerTokenExpiry) || isToday(bodyTokenExpiry)) {
      throw new Error(
        'TCS tokens are expired, add account again to get new token!'
      );
    }
    return { headerToken, bodyToken };
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

      const { headerToken, bodyToken } =
        this.getTokensFromAccount(deliveryAccount);

      const body = {
        accessToken: bodyToken,
        consignmentno: '',
        shipperinfo: {
          tcsaccount: '759776',
          shippername: 'Sukoon welness',
          address1: 'madina town faislabad',
          address2: '',
          address3: '',
          zip: '38000',
          countrycode: 'PK',
          countryname: 'Pakistan',
          citycode: '',
          cityname: 'FAISALABAD',
          mobile: '03227276200',
          // tcsaccount: "04011K1",
          // shippername: "Test",
          // address1: "Test address 1",
          // address2: "Test address 2",
          // address3: "Test address 3",
          // zip: "75800",
          // countrycode: "PK",
          // countryname: "Pakistan",
          // citycode: "KHI",
          // cityname: "Karachi",
          // mobile: "03451234567",
        },
        consigneeinfo: {
          consigneecode: '',
          firstname: order.customer.first_name,
          middlename: '',
          lastname: order.customer.last_name,
          address1: order.address.address1,
          address2: '',
          address3: '',
          zip: order.address.zip || '',
          countrycode: 'PK',
          countryname: 'Pakistan',
          citycode: '',
          cityname: destinationCity.maped,
          email: order.customer.email || '',
          areacode: '',
          areaname: '',
          blockcode: '',
          blockname: '',
          lat: '',
          lng: '',
          mobile: `0${order.customer.phone || order.address.phone}`,
        },
        vendorinfo: {
          name: 'SUKOON WELLNESS & CO',
          address1: 'madina town faislabad',
          address2: '',
          address3: '',
          citycode: 'FSD',
          cityname: 'FAISALABAD',
          mobile: '03227276200',
        },
        shipmentinfo: {
          costcentercode: deliveryAccount.cost_center,
          referenceno: `Sukooonx${order.order_number}`,
          contentdesc: order.items.reduce(
            (p, c, i) =>
              i > 0
                ? `${c.name}/${c.quantity}-${p}`
                : `${c.name}/${c.quantity}`,
            ''
          ),
          servicecode: 'O',
          parametertype: '',
          shipmentdate: `${new Date()
            .toLocaleString('en-GB', { hour12: false })
            .replace(',', '')}`,
          shippingtype: '',
          currency: 'PKR',
          codamount: order.total_price,
          declaredvalue: '',
          insuredvalue: '',
          transactiontype: '',
          dsflag: '',
          carrierslug: '',
          weightinkg: 0.25,
          pieces: order.items.length,
          fragile: false,
          remarks: order.items.reduce(
            (p, c, i) =>
              i > 0
                ? `${c.name}/${c.quantity}-${p}`
                : `${c.name}/${c.quantity}`,
            ''
          ),
          skus: [],
        },
      };
      // const body = {
      //   accessToken: bodyToken,
      //   consignmentno: "",
      //   shipperinfo: {
      //     tcsaccount: "04011K1",
      //     shippername: "Test",
      //     address1: "Test address 1",
      //     address2: "Test address 2",
      //     address3: "Test address 3",
      //     zip: "75800",
      //     countrycode: "PK",
      //     countryname: "Pakistan",
      //     citycode: "KHI",
      //     cityname: "Karachi",
      //     mobile: "03451234567",
      //   },
      //   consigneeinfo: {
      //     consigneecode: "C103",
      //     firstname: "First name",
      //     middlename: "Middle name",
      //     lastname: "Last name",
      //     address1: "Test address 1",
      //     address2: "Test address 2",
      //     address3: "Test address 3",
      //     zip: "75800",
      //     countrycode: "PK",
      //     countryname: "Pakistan",
      //     citycode: "KHI",
      //     cityname: "Karachi",
      //     email: "test@test.com",
      //     areacode: "KHI00001",
      //     areaname: "Gulshan",
      //     blockcode: "",
      //     blockname: "Gulshan block 6 PECHS",
      //     lat: "24.920733",
      //     lng: "67.088162",
      //     mobile: "03451234567",
      //   },
      //   vendorinfo: {
      //     name: "Test Vendor",
      //     address1: "Test address 1",
      //     address2: "Test address 2",
      //     address3: "Test address 3",
      //     citycode: "KHI",
      //     cityname: "Karachi",
      //     mobile: "03451234567",
      //   },
      //   shipmentinfo: {
      //     costcentercode: "Test-01",
      //     referenceno: "123456789",
      //     contentdesc: "Cost center description",
      //     servicecode: "O",
      //     parametertype: "Parameter Type",
      //     shipmentdate: "28/08/2023 01:04:02",
      //     shippingtype: "",
      //     currency: "PKR",
      //     codamount: 250,
      //     declaredvalue: null,
      //     insuredvalue: null,
      //     transactiontype: "",
      //     dsflag: "",
      //     carrierslug: "",
      //     weightinkg: 0.5,
      //     pieces: 1,
      //     fragile: false,
      //     remarks: "Test remarks",
      //     skus: [],
      //   },
      // };
      response = await this.http.post('ecom/api/booking/create', body, {
        headers: { Authorization: `Bearer ${headerToken}` },
      });
      logger.log('info', 'tcs book parcel api response', {
        res: response?.data,
        body,
      });
      const { consignmentNo, message, traceid } = response?.data || {};
      return {
        cn: consignmentNo,
        slip: JSON.stringify({ traceid }),
        isSuccess: message === 'SUCCESS',
        error: message !== 'SUCCESS' ? message : null,
        response: message,
      };
    } catch (error) {
      logger.log('error', error.message, {
        body,
        res: response?.data,
        stack: 'in tcs booking function',
      });
      const { message } = response?.data || {};
      return {
        cn: null,
        slip: null,
        isSuccess: false,
        error: error.message,
        response: message,
      };
    }
  }

  async checkParcelStatus(trackingNumber, deliveryAccount) {
    let response;
    try {
      const { headerToken, bodyToken } =
        this.getTokensFromAccount(deliveryAccount);
      let headersList = {
        Accept: '*/*',
        Authorization: `Bearer ${headerToken}`,
      };

      let reqOptions = {
        url: `${this.baseURL}/tracking/api/Tracking/GetDynamicTrackDetail?consignee=${trackingNumber}`,
        method: 'GET',
        headers: headersList,
      };

      response = await this.http.request(reqOptions);
      const {
        shipmentinfo,
        deliveryinfo,
        checkpoints,
        shipmentsummary,
        message,
        traceid,
      } = response.data;
      return {
        isSuccess: message === 'SUCCESS',
        error: message === 'SUCCESS' ? null : message,
        history: checkpoints,
        status: checkpoints[0]?.status,
        date: null,
        remarks: shipmentsummary,
        data: { shipmentinfo },
        response: 'Current Booking status!',
      };
    } catch (error) {
      logger.log('error', 'tcs booking status api response', {
        res: response?.data,
      });
      return {
        isSuccess: false,
        data: {},
        history: [],
        status: null,
        date: null,
        remarks: null,
        error,
        response: 'Error in getting booking status!',
      };
    }
  }

  async cancelBooking(trackingNumber, deliveryAccount) {
    let response, body;
    try {
      const { headerToken, bodyToken } =
        this.getTokensFromAccount(deliveryAccount);
      body = {
        consignmentnumber: trackingNumber,
        accesstoken: bodyToken,
      };
      response = await this.http.post('ecom/api/booking/cancel', body, {
        headers: { Authorization: `Bearer ${headerToken}` },
      });
      logger.log('info', 'tcs cancel booking parcel api response', {
        body,
        res: response.data,
      });
      const { message, traceid } = response?.data;
      return {
        isSuccess: Boolean(message === 'SUCCESS'),
        error: message !== 'SUCCESS' ? message : null,
        response: message,
      };
    } catch (error) {
      logger.log('error', 'tcs cancel booking parcel api error', {
        body,
        res: response.data,
      });
      const { message, traceid } = response.data;
      return {
        isSuccess: false,
        error: message,
        response: message,
      };
    }
  }

  downloadReceipt(trackingNumber, deliveryAccount) {
    // Implementation for downloading receipt via TCS
  }
}

export default TCSCourier;
