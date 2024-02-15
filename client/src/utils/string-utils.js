export const toSentense = (string) => {
  console.log(string, 'string');
  const msg =
    Array.isArray(string) && string.length > 1 ? string.join(', ') : Array.isArray(string) && string.length === 1 ? string[0] : string;
  return `${msg[0]?.toUpperCase()}${msg !== '' ? msg.slice(1) : ''}`;
};
