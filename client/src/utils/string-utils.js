export const toSentense = (string) => {
  const msg =
    Array.isArray(string) && string.length > 1
      ? string.reduce((p, c) => p + ',' + c, '')
      : Array.isArray(string) && string.length === 1
      ? string[0]
      : string;
  return `${msg[0].toUpperCase()}${msg.slice(1)}`;
};
