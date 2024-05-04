import { returnAddress } from "../../constants/constants";
import CourierInterface from "../courierInterface";
import getAxiosInstance from "../http";

class LeapordCourier extends CourierInterface {
  constructor() {
    super();
    this.http = getAxiosInstance("http://new.leopardscod.com/webservice/", {});
  }

  async bookParcel(order) {
    try {
      const body = {
        api_key: process.env.LeapordAPI,
        api_password: process.env.LeapordPassword,
        booked_packet_weight: 1000,
        booked_packet_vol_weight_w: 0,
        booked_packet_vol_weight_h: 0,
        booked_packet_vol_weight_l: 0,
        booked_packet_no_piece: 1,
        booked_packet_collect_amount: order.total_price,
        booked_packet_order_id: order.order_number,
        origin_city: "abc",
        destination_city: 789,
        shipment_id: "",
        shipment_name_eng: "Sukoon",
        shipment_email: "sukoon@mail.com",
        shipment_phone: "03001234567",
        shipment_address: "Faisalabad",
        consignment_name_eng: order.customer.name,
        consignment_email: order.customer.email || "",
        consignment_phone: order.customer.phone,
        consignment_phone_two: "",
        consignment_phone_three: "",
        consignment_address: `${order.address.address1} ${order.address.city}`,
        special_instructions: order.address.address2 || "",
        shipment_type: "cod",
        custom_data: "",
        return_address: returnAddress.address,
        return_city: 322,
      };
      const response = await this.http.post(
        "bookPacketTest/format/json/",
        body
      );
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
    } catch (error) {
      console.log(error, "error in leapord booking");
      return error;
    }
  }

  checkParcelStatus(trackingNumber) {
    return { current: "At lahore terminal", history: [] };
  }

  downloadReceipt(trackingNumber) {
    // Implementation for downloading receipt via TCS
  }

  cancelBooking(trackingNumber) {
    // Implementation for canceling booking via TCS
  }
}

export default LeapordCourier;
