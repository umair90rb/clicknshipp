import DeawooCourier from "./couriers/deawooCourier";
import LeapordCourier from "./couriers/leopordCourier";
import PostexCourier from "./couriers/postexCourier";
import SonicCourier from "./couriers/sonicCourier";
import TCSCourier from "./couriers/tcsCourier";
import CallCourier from "./couriers/callCourier";

class BookingService {
  constructor() {
    this.availableCouriers = {
      tcs: new TCSCourier(),
      postex: new PostexCourier(),
      deawoo: new DeawooCourier(),
      sonic: new SonicCourier(),
      leopard: new LeapordCourier(),
      callcourier: new CallCourier(),
    };
  }

  getCourierService(courierName) {
    return this.availableCouriers[courierName];
  }

  bookParcelWithCourier(courierName, orderDetails) {
    console.log(courierName);
    if (courierName in this.availableCouriers) {
      const courier = this.availableCouriers[courierName];
      return courier.bookParcel(orderDetails);
    } else {
      throw new Error("Courier service not available");
    }
  }
}

export default BookingService;
