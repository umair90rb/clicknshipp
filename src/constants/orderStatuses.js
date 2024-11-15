export const GENERATED_List = [
  'Assigned',
  'Confirmed',
  'No Pick',
  'Cancel',
  'Payment Pending',
  'Booked',
  'Booking Error',
  'Delivered',
  'Returned',
];
export const CONFIRMED_LIST = [
  'Confirmed',
  'Booked',
  'Booking Error',
  'Delivered',
  'Returned',
];
export const BOOKED_LIST = ['Booked'];

export const CONFIRMED = `(${CONFIRMED_LIST.map((s) => "'" + s + "'")})`;
export const GENERATED = `(${GENERATED_List.map((s) => "'" + s + "'")})`;
export const BOOKED = `(${BOOKED_LIST.map((s) => "'" + s + "'")})`;
