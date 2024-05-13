import logger from "../../middleware/logger";
import CourierInterface from "../courierInterface";
import getAxiosInstance from "../http";

class PostexCourier extends CourierInterface {
  constructor() {
    super();
    this.http = getAxiosInstance(
      "https://api.postex.pk/services/integration/api/order/v3/"
    );
  }

  async bookParcel(order, courier) {
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
      body = {
        cityName: destinationCity.maped,
        customerName: order.customer.name,
        customerPhone: order.customer.phone,
        deliveryAddress: `${order.address.address1}, ${order.address.city}`,
        invoiceDivision: 0,
        invoicePayment: order.total_price,
        items: order.items.length,
        orderDetail: order.items.reduce((p, c) => `${p}/${c.name}`, ""),
        orderRefNumber: `${order.brand.name}x${order.brand.shipment_series}`,
        orderType: "Normal",
        transactionNotes: "Rush Delivery",
        pickupAddressCode: "string", //required
        storeAddressCode: "string", //required
      };
      const response = await this.http.post("create-order", body, {
        headers: { token: order.brand.DeliveryServiceAccount.key },
      });
      const { statusCode, statusMessage, dist } = response.data || {};
      const { trackingNumber, orderStatus, orderDate } = dist;
      return {
        cn: trackingNumber,
        slip: JSON.stringify({ orderDate, orderStatus }),
        isSuccess: statusCode !== "400",
        error: statusCode === "400" ? statusMessage : null,
        response: statusMessage,
      };
    } catch (error) {
      const { statusCode, statusMessage, dist } = response.data || {};
      logger.log("error", error.message, {
        body,
        res: response.data,
        stack: "in postex booking function",
      });
      return {
        cn: null,
        slip: null,
        isSuccess: false,
        error: error,
        response: statusMessage || "Error: Something goes wrong!",
      };
    }
  }

  async checkParcelStatus(trackingNumber, deliveryAccount) {
    let response;
    try {
      response = await this.http.get(
        `https://api.postex.pk/services/integration/api/order/v1/track-order/${trackingNumber}`,
        {
          headers: { token: deliveryAccount.key },
        }
      );
      const { statusCode, statusMessage, dist } = response.data || {};
      const {
        transactionStatusHistory,
        transactionNotes,
        transactionStatus,
        transactionDate,
        ...rest
      } = dist || {};
      logger.log("info", "postex booking status,s api response", {
        res: response.data,
      });
      return {
        history: transactionStatusHistory,
        status: transactionStatus,
        date: transactionDate,
        remarks: transactionNotes,
        data: {
          ...rest,
        },
        isSuccess: statusCode !== "400",
        error: statusCode === "400" ? statusMessage : null,
        response: statusMessage,
      };
    } catch (error) {
      logger.log("error", "postex booking status api response", {
        body,
        res: response.data,
        stack: "in postex checkparcel status function",
      });
      const { statusCode, statusMessage, dist } = response.data || {};
      return {
        isSuccess: false,
        data: {},
        history: [],
        status: null,
        date: null,
        remarks: null,
        error,
        response: statusMessage || "Error in getting booking status!",
      };
    }
  }

  async cancelBooking(trackingNumber, deliveryAccount) {
    let response;
    try {
      const body = { trackingNumber };
      response = await this.http.put(
        "https://api.postex.pk/services/integration/api/order/v1/cancel-order/",
        body,
        {
          headers: { token: deliveryAccount.key },
        }
      );
      logger.log("info", "postex cancel booking parcel api response", {
        body,
        res: response,
      });
      return {
        isSuccess: response.statusCode === 200,
        error: response.statusCode !== 200 ? "Booking not found!" : null,
        response:
          response.statusCode === 200
            ? "Booking canceled!"
            : "Booking not found!",
      };
    } catch (error) {
      logger.log("error", "postex cancel booking parcel api error", {
        res: response,
        stack: "in postex cancel booking function",
      });
      return {
        isSuccess: false,
        error: "Something goes wrong!",
        response: "Error in booking cancelation!",
      };
    }
  }

  downloadReceipt(trackingNumber) {
    // Implementation for downloading receipt via TCS
  }
}

export default PostexCourier;
