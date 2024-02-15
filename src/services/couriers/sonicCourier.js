import CourierInterface from "../courierInterface";

class SonicCourier extends CourierInterface {
  constructor() {
    super();
  }
  bookParcel(order) {
    console.log("courier booked with sonic");
    return {
      cn: Math.random().toString().split(".")[1],
      slip: "",
      isSuccess: true,
      error: false,
      response: "Booked with sonic",
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

export default SonicCourier;
