export const toSentence = (string) => {
  if (!string) {
    return string;
  }
  const msg =
    Array.isArray(string) && string.length > 1 ? string.join(', ') : Array.isArray(string) && string.length === 1 ? string[0] : string;
  return `${msg[0]?.toUpperCase()}${msg !== '' ? msg.slice(1) : ''}`;
};

export const splitAndToUpperCase = (string, splitter = '_') => {
  if (!string) {
    return string;
  }
  return string.split(splitter).join(' ').toUpperCase();
};
