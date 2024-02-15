import CourierInterface from "../courierInterface";
import getAxiosInstance from "../http";

class DeawooCourier extends CourierInterface {
  constructor() {
    super();
    this.http = getAxiosInstance("https://codapi.daewoo.net.pk/", {});
  }
  getUrlWithApiCred(url) {
    return `${url}?apiKey=${process.env.DeawooAPI}&apiUser=${process.env.DeawooUsername}&apiPassword=${process.env.DeawooPassword}`;
  }
  async bookParcel(order) {
    try {
      const body = {
        order_no: order.order_number,
        source_terminal_id: "0",
        destination_terminal_id: "18",
        receiver_name: order.customer.name,
        receiver_cnic: "",
        receiver_mobile: order.customer.phone,
        receiver_address: `${order.address.address1}, ${order.address.city}, ${order.address.country}`,
        receiver_city: order.address.city,
        receiver_email: order.customer.email || "",
        remarks: order.address.address2 || "",
        category_id: "0",
        qty: "1",
        weight: "1",
        barcode: "0",
        cod_amount: order.total_price,
        source_location_point: "0.0",
        destination_location_point: "0.0",
        source_location_address: "Faisalabad",
        destination_location_address: `${order.address.address1}, ${order.address.city}, ${order.address.country} `,
        item_description: "",
      };
      const response = await this.http.post(
        this.getUrlWithApiCred("api/booking/quickBook"),
        body
      );
      const {
        TrackNo,
        Error,
        Success,
        Validations,
        Response,
        Barcode,
        CashCollection,
        OrderId,
      } = response.data || {};
      return {
        cn: TrackNo,
        slip: "",
        isSuccess: Success,
        error: Error ? Response : null,
        response: Response,
      };
    } catch (error) {}
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

export default DeawooCourier;
