export default (phoneNumber) => {
  if (!phoneNumber) return;
  let phone = `${phoneNumber.replace(/\s/g, "")}`;
  return phone.match(/(3[0-9]*)/g);
};
