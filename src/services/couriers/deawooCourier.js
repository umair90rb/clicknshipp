import CourierInterface from "../../interfaces/courierInterface";
import getAxiosInstance from "../AxiosService";
import models from "../../models";
import { Op } from "sequelize";
import logger from "../../middleware/logger";
const { CityNameMaping } = models;

class DeawooCourier extends CourierInterface {
  constructor() {
    super();
    this.http = getAxiosInstance("https://codapi.daewoo.net.pk/", {});
  }
  getUrlWithApiCred(url, api, username, password) {
    return `${url}?apiKey=${api}&apiUser=${username}&apiPassword=${password}`;
  }
  async bookParcel(order, deliveryAccount) {
    let response;
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
          error: "City not found in the database, contact admin",
          response: "destination not found in the db",
        };
      }
      const body = {
        order_no: `Sukooonx${order.order_number}`,
        source_terminal_id: "10",
        destination_terminal_id: destinationCity.assigned_id,
        receiver_name: `${order.customer.first_name} ${
          order.customer.last_name || ""
        }`,
        receiver_cnic: "",
        receiver_mobile: `0${order.customer.phone}`,
        receiver_address: `${order.address.address1}, ${order.address.city}`,
        receiver_city: destinationCity.maped,
        receiver_email: order.customer.email || "empty",
        remarks: "rush delivery",
        category_id: "0",
        qty: order.items.length,
        weight: "0.5",
        barcode: "0",
        cod_amount: order.total_price,
        source_location_point: "0.0",
        destination_location_point: "0.0",
        source_location_address: "madina town faisalabad",
        destination_location_address: `${order.address.address1}, ${destinationCity.maped}`,
        item_description: order.items.reduce(
          (p, c, i) =>
            i > 0 ? `${c.name}/${c.quantity}-${p}` : `${c.name}/${c.quantity}`,
          ""
        ),
      };
      response = await this.http.post(
        this.getUrlWithApiCred(
          "api/booking/quickBook",
          deliveryAccount.key,
          deliveryAccount.username,
          deliveryAccount.password
        ),
        body
      );
      const {
        TrackNo,
        Error,
        Success,
        Response,
        Validations,
        Barcode,
        CashCollection,
        OrderId,
      } = response.data || {};
      logger.log("info", "deawoo book parcel api response", {
        body,
        res: response.data,
      });
      return {
        cn: TrackNo,
        slip: JSON.stringify({ Validations, Barcode, CashCollection, OrderId }),
        isSuccess: Success,
        error: Error ? Response : null,
        response: Response,
      };
    } catch (error) {
      logger.log("error", error.message, {
        stack: "in deawoo booking function",
      });
      const {
        TrackNo,
        Error,
        Success,
        Validations,
        Response,
        Barcode,
        CashCollection,
        OrderId,
      } = response?.data || {};
      return {
        cn: null,
        slip: null,
        isSuccess: Success,
        error: Error ? Response : null,
        response: Response,
      };
    }
  }

  async checkParcelStatus(trackingNumber) {
    let response;
    try {
      const url = `https://codapi.daewoo.net.pk/api/booking/quickTrack?trackingNo=${trackingNumber}`;
      response = await this.http.get(url);
      logger.log("info", "deawoo booking status api response", {
        body: null,
        res: response.data,
      });
      const { Result, ...rest } = response.data || {};
      const { Error, Response, Success, TrackingDetails, CurrentTrackStatus } =
        Result || {};

      return {
        isSuccess: Success,
        error: Error,
        history: TrackingDetails,
        status: CurrentTrackStatus,
        date: null,
        remarks: null,
        data: {
          rest,
        },
        response: Response,
      };
    } catch (error) {
      console.log(error);
      logger.log("error", "deawoo booking status api error", {
        body: null,
        res: response.data,
      });
      const { Error, Success, Response } = response.data || {};
      return {
        isSuccess: Success,
        data: {},
        history: [],
        status: null,
        date: null,
        remarks: null,
        error: Error,
        response: Response,
      };
    }
  }

  async cancelBooking(trackingNumber, deliveryAccount) {
    let response;
    try {
      const urlWithApi = this.getUrlWithApiCred(
        "https://codapi.daewoo.net.pk/api/booking/quickCancel",
        deliveryAccount.key,
        deliveryAccount.username,
        deliveryAccount.password
      );
      response = await this.http.post(
        `${urlWithApi}&trackingNo=${trackingNumber}`
      );
      console.log(response.data, "response.data");
      logger.log("info", "deawoo cancel booking parcel api response", {
        body: null,
        res: response.data,
      });
      console.log(response.data, "response.data");
      const { Error, Success, Response } = response?.data || {};
      return {
        isSuccess: Success,
        error: Error ? Response : null,
        response: Response,
      };
    } catch (error) {
      console.log(error);
      logger.log("error", "deawoo cancel booking parcel api error", {
        body: null,
        res: response.data,
      });
      const { Error, Success, Response } = response?.data || {};
      return {
        cn: null,
        slip: null,
        isSuccess: Success,
        error: Error ? Response : null,
        response: Response,
      };
    }
  }

  downloadReceipt(trackingNumber, deliveryAccount) {
    // Implementation for downloading receipt via TCS
  }
}

export default DeawooCourier;
