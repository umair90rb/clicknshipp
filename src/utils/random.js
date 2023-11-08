import crypto from "crypto";

export default (length = 6, type = "alphanumeric") => {
  if (!(length >= 0 && Number.isFinite(length))) {
    throw new TypeError(
      "Expected a `length` to be a non-negative finite number"
    );
  }

  let characters;
  switch (type) {
    case "numeric":
      characters = "0123456789".split("");
      break;
    case "url-safe":
      characters =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._~".split(
          ""
        );
      break;
    case "alphanumeric":
    default:
      characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split(
          ""
        );
      break;
  }

  const characterCount = characters.length;
  const maxValidSelector =
    Math.floor(0x10000 / characterCount) * characterCount - 1;
  const entropyLength = 2 * Math.ceil(1.1 * length);
  let string = "";
  let stringLength = 0;

  while (stringLength < length) {
    const entropy = crypto.randomBytes(entropyLength);
    let entropyPosition = 0;

    while (entropyPosition < entropyLength && stringLength < length) {
      const entropyValue = entropy.readUInt16LE(entropyPosition);
      entropyPosition += 2;
      if (entropyValue > maxValidSelector) {
        // eslint-disable-next-line no-continue
        continue;
      }

      string += characters[entropyValue % characterCount];
      // eslint-disable-next-line no-plusplus
      stringLength++;
    }
  }

  return string;
};
