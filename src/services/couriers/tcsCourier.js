import CourierInterface from "../courierInterface";
import getAxiosInstance from "../http";
import models from "../../models";
import { Op } from "sequelize";
import logger from "../../middleware/logger";
const { CityNameMaping } = models;

class TCSCourier extends CourierInterface {
  constructor() {
    super();
    this.http = getAxiosInstance(
      "https://api.tcscourier.com/production/v1/cod/",
      { "Content-Type": "application/json" }
    );
  }

  async bookParcel(order, deliveryAccount) {
    let response, body;
    try {
      const destinationCity = await CityNameMaping.findOne({
        where: {
          [Op.or]: [
            {
              city: order.address.city,
            },
            { maped: order.address.city },
          ],
          courier: deliveryAccount.key,
        },
        raw: true,
      });
      if (!destinationCity) {
        return {
          cn: null,
          slip: null,
          isSuccess: false,
          error: "City not found in the database, contact admin",
          response: "destination not found in the db",
        };
      }
      body = {
        userName: deliveryAccount.username,
        password: deliveryAccount.password,
        costCenterCode: "34924",
        consigneeName: order.customer.name,
        consigneeAddress: order.address.address1,
        consigneeMobNo: order.customer.phone,
        // consigneeEmail: order.customer.email || "",
        originCityName: "FAISALABAD",
        destinationCityName: destinationCity.maped,
        weight: 0.5,
        pieces: order.items.length,
        codAmount: `${order.total_price}`,
        customerReferenceNo: `${order.brand.name}x${order.brand.shipment_series}`,
        services: "O",
        productDetails: order.items.reduce(
          (p, c, i) => (i > 0 ? `${c.name}/${p}` : c.name),
          ""
        ),
        fragile: "No",
        remarks:
          order.address.address2 ||
          order.items.reduce(
            (p, c, i) =>
              i > 0
                ? `${c.name}/${c.quantity}-${p}`
                : `${c.name}/${c.quantity}`,
            ""
          ),
        // insuranceValue: 0,
      };
      response = await this.http.post("create-order", body, {
        headers: {
          "X-IBM-Client-Id": `${deliveryAccount.key}`,
        },
      });
      logger.log("info", "tcs book parcel api response", {
        res: response.data,
        body,
      });
      const { returnStatus } = response.data || {};
      const { code, status, message, requestTime, responseTime } =
        returnStatus || {};
      // returnStatus: {
      //   code: '0400',
      //   status: 'FAIL',
      //   message: 'FAILURE: Invalid Credentials',
      //   requestTime: '20240515162505936',
      //   responseTime: '20240515162506177'
      // }
      return {
        cn: null,
        slip: null,
        isSuccess: code == "0200",
        error: code !== "0200" ? message : null,
        response: message,
      };
    } catch (error) {
      logger.log("error", error.message, {
        body,
        res: response?.data,
        stack: "in tcs booking function",
      });
      const { returnStatus } = response.data || {};
      const { code, status, message, requestTime, responseTime } =
        returnStatus || {};

      return {
        cn: null,
        slip: null,
        isSuccess: false,
        error: error.message,
        response: message || "Error: Something goes wrong!",
      };
    }
  }

  async checkParcelStatus(trackingNumber, deliveryAccount) {
    let response;
    try {
      response = await this.http.get(
        `track-order?userName=${deliveryAccount.username}&password=${deliveryAccount.password}&referenceNo=${trackingNumber}`,
        {
          headers: { "X-IBM-Client-Id": deliveryAccount.api },
        }
      );
      logger.log("info", "tcs booking status,s api response", {
        res: response.data,
      });
      const { cnDetail } = response.data;
      return {
        isSuccess: response.status === 200,
        error: null,
        history: cnDetail,
        status: null,
        date: null,
        remarks: null,
        data: {},
        response: "Current Booking status!",
      };
    } catch (error) {
      logger.log("error", "tcs booking status api response", {
        res: response.data,
      });
      return {
        isSuccess: false,
        data: {},
        history: [],
        status: null,
        date: null,
        remarks: null,
        error,
        response: "Error in getting booking status!",
      };
    }
  }

  async cancelBooking(trackingNumber, deliveryAccount) {
    let response, body;
    try {
      body = {
        userName: deliveryAccount.username,
        password: deliveryAccount.password,
        consignmentNumber: `${trackingNumber}`,
      };
      response = await this.http.put("cancel-order", body, {
        headers: { "X-IBM-Client-Id": deliveryAccount.api },
      });
      logger.log("info", "tcs cancel booking parcel api response", {
        body,
        res: response.data,
      });
      const { code, status, message, requestTime, responseTime } =
        response.data;
      return {
        isSuccess: Boolean(code === 200),
        error: status,
        response: code !== 200 ? status : message,
      };
    } catch (error) {
      logger.log("error", "tcs cancel booking parcel api error", {
        body,
        res: response.data,
      });
      const { code, status, message, requestTime, responseTime } =
        response.data;
      return {
        isSuccess: false,
        error,
        response: message,
      };
    }
  }

  downloadReceipt(trackingNumber, deliveryAccount) {
    // Implementation for downloading receipt via TCS
  }
}

export default TCSCourier;
