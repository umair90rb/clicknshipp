import AHLCourier from './couriers/ahlCourier';
import CallCourier from './couriers/callCourier';
import DeawooCourier from './couriers/deawooCourier';
import DigiCourier from './couriers/digiCourier';
import LeapordCourier from './couriers/leopordCourier';
import ManualCourier from './couriers/manualCourier';
import MnpCourier from './couriers/mnpCourier';
import PostexCourier from './couriers/postexCourier';
import SonicCourier from './couriers/sonicCourier';
import TCSCourier from './couriers/tcsCourier';

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
      digi: new DigiCourier(),
      manual: new ManualCourier(),
      ahl: new AHLCourier()
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
