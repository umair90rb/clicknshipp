import DeawooCourier from './couriers/deawooCourier';
import LeapordCourier from './couriers/leopordCourier';
import PostexCourier from './couriers/postexCourier';
import SonicCourier from './couriers/sonicCourier';
import TCSCourier from './couriers/tcsCourier';
import CallCourier from './couriers/callCourier';
import MnpCourier from './couriers/mnpCourier';
import ManualCourier from './couriers/manualCourier';

class BookingService {
  constructor() {
    this.availableCouriers = {
      leopard: new LeapordCourier(),
      postex: new PostexCourier(),
      deawoo: new DeawooCourier(),
      trax: new SonicCourier(),
      tcs: new TCSCourier(),
      callcourier: new CallCourier(),
      mnp: new MnpCourier(),
      manual: new ManualCourier(),
    };
  }

  getCourierService(courierName) {
    return this.availableCouriers[courierName];
  }

  bookParcelWithCourier(orderDetails, deliveryAccount) {
    if (deliveryAccount.service in this.availableCouriers) {
      const courier = this.availableCouriers[deliveryAccount.service];
      return courier.bookParcel(orderDetails, deliveryAccount);
    } else {
      throw new Error('Courier service not available');
    }
  }

  cancelBookingWithCourier(cn, deliveryAccount) {
    if (deliveryAccount.service in this.availableCouriers) {
      const courier = this.availableCouriers[deliveryAccount.service];
      return courier.cancelBooking(cn, deliveryAccount);
    } else {
      throw new Error('Courier service not available');
    }
  }

  checkParcelStatusWithCourier(cn, deliveryAccount) {
    if (deliveryAccount.service in this.availableCouriers) {
      const courier = this.availableCouriers[deliveryAccount.service];
      return courier.checkParcelStatus(cn, deliveryAccount);
    } else {
      throw new Error('Courier service not available');
    }
  }

  downloadParcelReceiptWithCourier(cns, deliveryAccount) {
    if (deliveryAccount.service in this.availableCouriers) {
      const courier = this.availableCouriers[deliveryAccount.service];
      return courier.downloadReceipt(cns, deliveryAccount);
    } else {
      throw new Error('Courier service not available');
    }
  }
}

const bookingService = new BookingService();
export default bookingService;
