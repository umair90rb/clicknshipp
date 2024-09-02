import CourierInterface from "../../interfaces/courierInterface";
import getAxiosInstance from "../AxiosService";
import logger from "../../middleware/logger";
import models from "../../models";
import { Op } from "sequelize";
const { CityNameMaping } = models;

class LeapordCourier extends CourierInterface {
  constructor() {
    super();
    // staging url => https://merchantapistaging.leopardscourier.com/api/
    this.http = getAxiosInstance(
      "https://merchantapi.leopardscourier.com/api/",
      {}
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
          error: "City not found in the database, contact admin",
          response: "destination not found in the db",
        };
      }
      body = {
        api_key: deliveryAccount.key,
        api_password: deliveryAccount.password,
        booked_packet_weight: 500,
        // booked_packet_vol_weight_w: 0,
        // booked_packet_vol_weight_h: 0,
        // booked_packet_vol_weight_l: 0,
        booked_packet_no_piece: order?.items?.length,
        booked_packet_collect_amount: order.total_price,
        booked_packet_order_id: `${order.brand.name}x${order.brand.shipment_series}`,
        origin_city: 322,
        destination_city: parseInt(destinationCity.assigned_id),
        shipment_id: 10,
        shipment_id: null,
        shipment_name_eng: "Sukooon Wellness",
        shipment_email: "umekalsoom011@gmail.com",
        shipment_phone: "03094446319",
        shipment_address: "SIE MILLAT ROAD FAISALABAD",
        consignment_name_eng: `${order.customer.first_name} ${
          order.customer.last_name || ""
        }`,
        // consignment_email: order.customer.email || "",
        consignment_phone: `0${order.customer.phone}`,
        // consignment_phone_two: "",
        // consignment_phone_three: "",
        consignment_address: `${order.address.address1} ${order.address.city}`,
        special_instructions:
          order.address.address2 ||
          order.items.reduce(
            (p, c, i) =>
              i > 0
                ? `${c.name}/${c.quantity}-${p}`
                : `${c.name}/${c.quantity}`,
            ""
          ),
        shipment_type: "overnight",
        // custom_data: "",
        return_address: "SIE MILLAT ROAD FAISALABAD",
        return_city: 322,
      };
      response = await this.http.post("bookPacket/format/json", body);
      logger.log("info", "leopard book parcel api response", {
        res: response.data,
        body,
      });
      const { track_number, slip_link, status, error } = response.data || {};
      return {
        cn: track_number,
        slip: slip_link,
        isSuccess: Boolean(status),
        error: error ? error : null,
        response: status
          ? "Package booked with leopards"
          : "Error: Something goes wrong!",
      };
    } catch (_error) {
      logger.log("error", _error.message, {
        body,
        res: response?.data,
        stack: "in leopard booking function",
      });
      const { track_number, slip_link, status, error } = response?.data || {};
      return {
        cn: null,
        slip: null,
        isSuccess: Boolean(status),
        error: error,
        response: "Error: Something goes wrong!",
      };
    }
  }

  async checkParcelStatus(trackingNumber, deliveryAccount) {
    let response, body;
    try {
      body = {
        api_key: deliveryAccount.key,
        api_password: deliveryAccount.password,
        track_numbers: trackingNumber,
      };
      response = await this.http.post("trackBookedPacket/format/json", body);
      logger.log("info", "leopard booking status,s api response", {
        body,
        res: response.data,
      });
      const { status, error, packet_list } = response.data;
      const parcel = packet_list[0] || {};
      const { booked_packet_status, activity_date, status_remarks, reverseCN } =
        parcel || {};
      const history = parcel["Tracking Detail"] || [];
      return {
        isSuccess: Boolean(status),
        error,
        history,
        status: booked_packet_status,
        date: activity_date,
        remarks: status_remarks,
        data: {
          reverseCN,
        },
        response: status === 0 ? error : "Current Booking status!",
      };
    } catch (_error) {
      logger.log("error", "leopard booking status api response", {
        body,
        res: response.data,
      });
      const { status, error } = response.data;
      return {
        isSuccess: Boolean(status),
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
        api_key: deliveryAccount.key,
        api_password: deliveryAccount.password,
        cn_numbers: trackingNumber,
      };
      response = await this.http.post("cancelBookedPackets/format/json", body);
      logger.log("info", "leopard cancel booking parcel api response", {
        body,
        res: response.data,
      });
      const { status, error } = response.data;
      return {
        isSuccess: Boolean(status),
        error,
        response: status === 0 ? error : "Booking canceled!",
      };
    } catch (_error) {
      logger.log("error", "leopard cancel booking parcel api error", {
        body,
        res: response.data,
      });
      const { status, error } = response.data;
      return {
        isSuccess: Boolean(status),
        error,
        response: "Error in booking cancelation!",
      };
    }
  }

  downloadReceipt(trackingNumber) {
    // Implementation for downloading receipt via TCS
  }
}

export default LeapordCourier;
