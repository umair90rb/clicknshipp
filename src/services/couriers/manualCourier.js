import CourierInterface from '../../interfaces/courierInterface';

class ManualCourier extends CourierInterface {
  constructor() {
    super();
  }

  async bookParcel(order, deliveryAccount) {
    return {
      cn: `${order.order_number}${order.customer.phone}`,
      slip: '',
      isSuccess: true,
      error: null,
      response: 'Parcel booked by manual courier',
    };
  }

  async checkParcelStatus(trackingNumber, deliveryAccount) {
    return {
      isSuccess: true,
      error: null,
      history: [],
      status: 'Manual Booking',
      date: new Date(),
      remarks: null,
      data: {},
      response: 'parcel status',
    };
  }

  async cancelBooking(trackingNumber, deliveryAccount) {
    return {
      isSuccess: true,
      error: null,
      response: 'parcel canceled',
    };
  }

  downloadReceipt(trackingNumber, deliveryAccount) {
    // Implementation for downloading receipt via TCS
  }
}

export default ManualCourier;
