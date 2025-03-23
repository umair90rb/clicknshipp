export default function createBlankLink(url) {
  return function () {
    window.open(url, '_blank');
  };
}
