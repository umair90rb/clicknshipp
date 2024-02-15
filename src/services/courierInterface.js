class CourierInterface {
  bookParcel(parcelDetails) {}
  checkParcelStatus(trackingNumber) {}
  downloadReceipt(trackingNumber) {}
  cancelBooking(trackingNumber) {}
}

export default CourierInterface;
