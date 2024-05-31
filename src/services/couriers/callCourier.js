import CourierInterface from "../../interfaces/courierInterface";
import getAxiosInstance from "../AxiosService";
import models from "../../models";
import { Op } from "sequelize";
import logger from "../../middleware/logger";
const { CityNameMaping } = models;

class CallCourier extends CourierInterface {
  constructor() {
    super();

    this.http = getAxiosInstance(
      "http://cod.callcourier.com.pk/API/CallCourier/",
      {}
    );
  }

  async bookParcel(order, deliveryAccount) {
    let response, url;
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
      url = `SaveBooking?loginId=${deliveryAccount.key}&ConsigneeName="${
        order.customer.first_name
      } ${order.customer.last_name || ""}"&ConsigneeRefNo="${
        order.brand.name
      }x${order.brand.shipment_series}"&ConsigneeCellNo=${
        order.customer.phone
      }&Address=${order.address.address1}&Origin=FAISALABAD&DestCityId=${
        destinationCity.assigned_id
      }&ServiceTypeId=7&Pcs=${
        order.items.length
      }&Weight=${0.5}&Description=${order.items.reduce(
        (p, c, i) =>
          i > 0 ? `${c.name}/${c.quantity}-${p}` : `${c.name}/${c.quantity}`,
        ""
      )}&SelOrigin=Domestic&CodAmount=${
        order.total_price
      }&SpecialHandling=false&MyBoxId=1&Holiday=false&remarks=Rush Delivery&ShipperName=SWAP&ShipperCellNo=03005444103&ShipperArea=1&ShipperCity=1&ShipperAddress=286-K, GULISTAN COLONY NO.1,NEAR GIRLS HIGH SCHOOL, FAISALABAD"
      &ShipperLandLineNo=03005444103&ShipperEmail=SWAPNEARN@GMAIL.COM`;
      response = await this.http.get(url);
      logger.log("info", "leopard book parcel api response", {
        res: response.data,
      });
      const { CNNO, Response, ...rest } = response.data;
      return {
        cn: CNNO,
        slip: JSON.stringify(rest),
        isSuccess: CNNO !== null,
        error: CNNO === null ? Response : null,
        response: Response,
      };
    } catch (error) {
      const { Response, ...rest } = response.data;
      logger.log("error", error.message, {
        data: response.data,
        stack: "in call courier booking function",
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
      logger.log("info", "leopard booking status,s api response", {
        res: response.data,
      });
      return {
        isSuccess: true,
        error: null,
        history: response.data,
        status: null,
        date: null,
        remarks: null,
        data: {},
        response: "Current Booking status!",
      };
    } catch (error) {
      logger.log("error", error.message, {
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
        response: "Error in fetching current booking status!",
      };
    }
  }

  cancelBooking(trackingNumber, deliveryAccount) {
    return {
      isSuccess: false,
      error: "Cancel booking not available for Call Courier",
      response: trackingNumber,
    };
  }

  downloadReceipt(trackingNumber, deliveryAccount) {
    // Implementation for downloading receipt via TCS
  }
}

export default CallCourier;
