export const servicesName = [
  'Leapard',
  'Deawoo',
  'PostEx',
  'TCS',
  'Call Courier',
  'Trax',
  'M&P',
  'Manual',
  'Digi Trax',
  'Digi Swift',
  'Digi Bluex',
  'Digi M&P',
  'Digi Leopard'
];
export const serviceValue = [
  'leopard',
  'deawoo',
  'postex',
  'tcs',
  'callcourier',
  'trax',
  'mnp',
  'manual',
  'digi_trax',
  'digi_swift',
  'digi_bluex',
  'digi_mnp',
  'digi_leopard'
];

const SERVICES = servicesName.map((name, index) => [name, serviceValue[index]]);
export default SERVICES;
