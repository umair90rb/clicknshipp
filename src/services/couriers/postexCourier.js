import CourierInterface from "../courierInterface";
import getAxiosInstance from "../http";

class PostexCourier extends CourierInterface {
  constructor() {
    super();
    this.http = getAxiosInstance(
      "https://api.postex.pk/services/integration/api/order/v3/",
      { token: process.env.PostexToken }
    );
  }

  async bookParcel(order) {
    try {
      const body = {
        cityName: order.address.city,
        customerName: order.customer.name,
        customerPhone: order.customer.phone,
        deliveryAddress: `${order.address.address1}, ${order.address.city}`,
        invoiceDivision: 0,
        invoicePayment: order.total_price,
        items: 1,
        orderDetail: order.address.address2 || "",
        orderRefNumber: order.order_number,
        orderType: "Normal",
        transactionNotes: "",
        pickupAddressCode: "string", //required
        storeAddressCode: "string", //required
      };
      const response = await this.http.post("create-order", body);
      const { statusCode, statusMessage } = response.data || {};
      return {
        cn: null,
        slip: null,
        isSuccess: statusCode !== "400",
        error: statusCode === "400" ? statusMessage : null,
        response: statusMessage,
      };
    } catch (error) {
      console.log(error);
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

export default PostexCourier;
