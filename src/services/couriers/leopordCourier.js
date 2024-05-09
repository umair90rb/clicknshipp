import companyProfile from "../data";
import { Op } from "sequelize";
import CourierInterface from "../courierInterface";
import getAxiosInstance from "../http";
import models from "../../models";
import logger from "../../middleware/logger";
const { CityNameMaping } = models;

class LeapordCourier extends CourierInterface {
  constructor() {
    super();
    this.http = getAxiosInstance("http://new.leopardscod.com/webservice/", {});
  }

  async bookParcel(order, courier) {
    let response;
    try {
      const testURL = "bookPacketTest";
      const prodURL = "bookPacket";
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
        api_key: order.brand.DeliveryServiceAccount.key,
        api_password: order.brand.DeliveryServiceAccount.password,
        booked_packet_weight: companyProfile.parcelOptions.weight,
        booked_packet_vol_weight_w: 0,
        booked_packet_vol_weight_h: 0,
        booked_packet_vol_weight_l: 0,
        booked_packet_no_piece: order?.items?.length || 1,
        booked_packet_collect_amount: order.total_price,
        booked_packet_order_id: order.order_number,
        origin_city: 322,
        destination_city: destinationCity.assigned_id,
        shipment_id: `${order.brand.name}x${order.brand.shipment_series}`,
        shipment_name_eng: companyProfile.name,
        shipment_email: companyProfile.email,
        shipment_phone: companyProfile.phone,
        shipment_address: companyProfile.address,
        consignment_name_eng: `${order.customer.first_name} ${
          order.customer.last_name || ""
        }`,
        consignment_email: order.customer.email || "",
        consignment_phone: order.customer.phone,
        consignment_phone_two: "",
        consignment_phone_three: "",
        consignment_address: `${order.address.address1} ${order.address.city}`,
        special_instructions: order.address.address2 || order.items[0].name,
        shipment_type: "overnight",
        custom_data: "",
        return_address: companyProfile.address,
        return_city: 322,
      };
      response = await this.http.post(
        `${
          process.env.NODE_ENV === "development" ? testURL : prodURL
        }/format/json/`,
        body
      );
      logger.log("info", "leopard book parcel api response", {
        data: response.data,
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
      logger.log("error", error.message, {
        stack: "in leopard booking function",
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
    }
  }

  async checkParcelStatus(trackingNumber, deliveryAccount) {
    let response;
    try {
      const testURL = "trackBookedPacketTest";
      const prodURL = "trackBookedPacket";
      const body = {
        api_key: deliveryAccount.key,
        api_password: deliveryAccount.password,
        track_numbers: trackingNumber,
      };
      response = await this.http.post(
        `${
          process.env.NODE_ENV === "development" ? testURL : prodURL
        }/format/json/`,
        body
      );
      logger.log("info", "leopard booking status,s api response", {
        data: response.data,
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
        data: response.data,
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
    let response;
    try {
      const testURL = "cancelBookedPacketsTest";
      const prodURL = "cancelBookedPackets";
      const body = {
        api_key: deliveryAccount.key,
        api_password: deliveryAccount.password,
        cn_numbers: trackingNumber,
      };
      response = await this.http.post(
        `${
          // process.env.NODE_ENV === "development" ? testURL : prodURL
          prodURL
        }/format/json/`,
        body
      );
      logger.log("info", "leopard cancel booking parcel api response", {
        data: response.data,
      });
      const { status, error } = response.data;
      return {
        isSuccess: Boolean(status),
        error,
        response: status === 0 ? error : "Booking canceled!",
      };
    } catch (_error) {
      logger.log("error", "leopard cancel booking parcel api error", {
        data: response.data,
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
