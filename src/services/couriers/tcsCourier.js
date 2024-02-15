import CourierInterface from "../courierInterface";

class TCSCourier extends CourierInterface {
  constructor() {
    super();
  }

  bookParcel(order) {
    console.log("courier booked with tcs");
    return {
      cn: Math.random().toString().split(".")[1],
      slip: "",
      isSuccess: true,
      error: false,
      response: "Booked with tcs",
    };
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

export default TCSCourier;
