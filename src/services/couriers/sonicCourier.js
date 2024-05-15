import logger from "../../middleware/logger";
import CourierInterface from "../courierInterface";
import getAxiosInstance from "../http";
import models from "../../models";
import { Op } from "sequelize";
const { CityNameMaping } = models;

class SonicCourier extends CourierInterface {
  constructor() {
    super();
    this.http = getAxiosInstance("https://sonic.pk/api/shipment/");
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
      body = {
        service_type_id: 1,
        pickup_address_id: 229911,
        information_display: 1,
        consignee_city_id: destinationCity.assigned_id,
        consignee_name: `${order.customer.first_name} ${
          order.customer.last_name || ""
        }`,
        consignee_address: order.address.address1,
        consignee_phone_number_1: order.customer.phone,
        // consignee_phone_number_2: "",
        // consignee_email_address: order.customer.email || "",
        order_id: `${order.brand.name}x${order.brand.shipment_series}`,
        item_product_type_id: 15,
        item_description: order.items.reduce(
          (p, c, i) =>
            i > 0 ? `${c.name}/${c.quantity}-${p}` : `${c.name}/${c.quantity}`,
          ""
        ),
        item_quantity: order.items.length,
        item_insurance: 0,
        item_price: order.total_price,
        pickup_date: new Date().toISOString().split("T")[0],
        // special_instructions: order.address.address2 || "",
        estimated_weight: 0.5,
        shipping_mode_id: 1,
        // same_day_timing_id: "",
        amount: order.total_price,
        payment_mode_id: 1,
        // charges_mode_id: 3,
        open_shipment: 0,
        pieces_quantity: order.items.length,
        shipper_reference_number_1: "",
        // shipper_reference_number_2: "",
        // shipper_reference_number_3: "",
        // shipper_reference_number_4: "",
        // shipper_reference_number_5: "",
      };
      response = await this.http.post("book", body, {
        headers: { Authorization: deliveryAccount.key },
      });
      logger.log("info", "trax book parcel api response", {
        res: response?.data,
        body,
      });
      const { message, status, ...rest } = response?.data || {};
      const { tracking_number } = rest || {};
      return {
        cn: status < 1 ? tracking_number : null,
        slip: JSON.stringify({ message, status }),
        isSuccess: Boolean(status < 1),
        error: status > 0 ? message : null,
        response: message,
      };
    } catch (error) {
      logger.log("error", error.message, {
        body,
        res: response?.data,
        stack: "in trax booking function",
      });
      const { message, status, ...rest } = response?.data || {};
      return {
        cn: null,
        slip: null,
        isSuccess: false,
        error: message,
        response: "Error: Something goes wrong!",
      };
    }
  }

  async checkParcelStatus(trackingNumber, deliveryAccount) {
    let response;
    try {
      response = await this.http.get(
        `track?tracking_number=${trackingNumber}&type=${0}`,
        {
          headers: { Authorization: deliveryAccount.key },
        }
      );
      logger.log("info", "trax check parcel status api response", {
        res: response.data,
      });
      const { message, status, details } = response.data || {};
      const { tracking_history, ...rest } = details || {};
      return {
        isSuccess: Boolean(status === 0),
        error: status > 0 ? message : null,
        history: tracking_history,
        status: tracking_history[0].status,
        date: tracking_history[0].date_time,
        remarks: tracking_history[0].status_reason,
        data: {
          rest,
        },
        response: message,
      };
    } catch (error) {
      const { message, status, details } = response.data || {};
      logger.log("error", error.message, {
        res: response.data,
        stack: "in trax check parcel status function",
      });
      return {
        isSuccess: false,
        error: status > 0 ? message : null,
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
        "cancel",
        {
          tracking_number: trackingNumber,
        },
        {
          headers: { Authorization: deliveryAccount.key },
        }
      );
      logger.log("info", "trax cancel api response", {
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
      logger.log("error", error.message, {
        res: response.data,
        stack: "in trax cancel function",
      });
      return {
        isSuccess: false,
        error: message,
        response: "Error in cancel booking",
      };
    }
  }

  downloadReceipt(trackingNumber, deliveryAccount) {
    // Implementation for downloading receipt via TCS
  }
}

export default SonicCourier;
