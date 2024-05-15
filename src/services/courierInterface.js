class CourierInterface {
  bookParcel(parcelDetails, deliveryAccount) {}
  checkParcelStatus(trackingNumber, deliveryAccount) {}
  downloadReceipt(trackingNumber, deliveryAccount) {}
  cancelBooking(trackingNumber, deliveryAccount) {}
}

export default CourierInterface;
