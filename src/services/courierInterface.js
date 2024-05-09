class CourierInterface {
  bookParcel(parcelDetails, serviceName) {}
  checkParcelStatus(trackingNumber) {}
  downloadReceipt(trackingNumber) {}
  cancelBooking(trackingNumber) {}
}

export default CourierInterface;
