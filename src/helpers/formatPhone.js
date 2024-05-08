export default (phoneNumber) => {
  if (phoneNumber && phoneNumber.startsWith("92")) {
    return phoneNumber.replace("92", "0");
  } else if (phoneNumber && phoneNumber.startsWith("+92")) {
    return phoneNumber.replace("+92", "0");
  } else {
    return phoneNumber;
  }
};
