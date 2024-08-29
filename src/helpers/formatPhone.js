export default (phoneNumber) => {
  let phone = `${phoneNumber.replace(/\s/g, "")}`;
  let number = phone.match(/(3[0-9]*)/g);
  return Array.isArray(number) && number[0].length >= 10
    ? number[0]
    : phoneNumber;
};
