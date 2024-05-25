export default (phoneNumber) => {
  const ph = typeof phoneNumber === "number" ? `${phoneNumber}` : phoneNumber;
  if (ph && ph?.startsWith("92")) {
    return ph?.replace("92", "0");
  } else if (ph && ph?.startsWith("+92")) {
    return ph?.replace("+92", "0");
  } else {
    return ph;
  }
};
