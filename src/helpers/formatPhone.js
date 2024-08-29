import logger from "../middleware/logger";

export default (phoneNumber = "") => {
  logger.log("error", { phoneNumber });
  if (!phoneNumber) {
    return phoneNumber;
  }
  let phone = `${phoneNumber.replace(/\s/g, "")}`;
  let [number] = phone.match(/(3[0-9]*)/g);
  return number;
};
