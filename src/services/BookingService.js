import DeawooCourier from "./couriers/deawooCourier";
import LeapordCourier from "./couriers/leopordCourier";
import PostexCourier from "./couriers/postexCourier";
import SonicCourier from "./couriers/sonicCourier";
import TCSCourier from "./couriers/tcsCourier";
import CallCourier from "./couriers/callCourier";

class BookingService {
  constructor() {
    this.availableCouriers = {
      leopard: new LeapordCourier(),
      postex: new PostexCourier(),
      deawoo: new DeawooCourier(),
      trax: new SonicCourier(),
      tcs: new TCSCourier(),
      callcourier: new CallCourier(),
    };
  }

  getCourierService(courierName) {
    return this.availableCouriers[courierName];
  }

  bookParcelWithCourier(courierName, orderDetails) {
    if (courierName in this.availableCouriers) {
      const courier = this.availableCouriers[courierName];
      return courier.bookParcel(orderDetails, courierName);
    } else {
      throw new Error("Courier service not available");
    }
  }
  cancelBookingWithCourier(cn, courierName, deliveryAccount) {
    if (courierName in this.availableCouriers) {
      const courier = this.availableCouriers[courierName];
      return courier.cancelBooking(cn, deliveryAccount);
    } else {
      throw new Error("Courier service not available");
    }
  }

  checkParcelStatusWithCourier(cn, courierName, deliveryAccount) {
    if (courierName in this.availableCouriers) {
      const courier = this.availableCouriers[courierName];
      return courier.checkParcelStatus(cn, deliveryAccount);
    } else {
      throw new Error("Courier service not available");
    }
  }
}

export default BookingService;
