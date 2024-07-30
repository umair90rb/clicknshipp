export default (phoneNumber) => {
  if (!phoneNumber) return;
  let phone = `${phoneNumber.replace(/\s/g, "")}`;
  let [number] = phone.match(/(3[0-9]*)/g);
  return number;
};
