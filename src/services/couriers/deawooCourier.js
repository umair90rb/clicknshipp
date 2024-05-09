import CourierInterface from "../courierInterface";
import getAxiosInstance from "../http";
import models from "../../models";
import { Op } from "sequelize";
import companyProfile from "../data";
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
  async bookParcel(order, courier) {
    let response;
    try {
      const destinationCity = await CityNameMaping.findOne({
        where: {
          [Op.or]: [
            {
              city: order.address.city,
            },
            { maped: order.address.city },
          ],
          courier,
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
        order_no: `${order.brand.name}x${order.brand.shipment_series}`,
        source_terminal_id: "10",
        destination_terminal_id: destinationCity.assigned_id,
        receiver_name: `${order.customer.first_name} ${
          order.customer.last_name || ""
        }`,
        receiver_cnic: "",
        receiver_mobile: order.customer.phone,
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
        source_location_address: `${companyProfile.address} ${companyProfile.city}`,
        destination_location_address: `${order.address.address1}, ${destinationCity.maped}`,
        item_description: order.items[0].name,
      };
      response = await this.http.post(
        this.getUrlWithApiCred(
          "api/booking/quickBook",
          order.brand.DeliveryServiceAccount.key,
          order.brand.DeliveryServiceAccount.username,
          order.brand.DeliveryServiceAccount.password
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

  downloadReceipt(trackingNumber) {
    // Implementation for downloading receipt via TCS
  }
}

export default DeawooCourier;
