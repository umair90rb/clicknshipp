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

export const CANCELED_LIST = ['Cancel'];

export const BOOKED_LIST = ['Booked'];
export const BOOKING_ERROR_LIST = ['Booking Error'];

export const DELIVERED_LIST = ['Delivered'];
export const RETURNED_LIST = ['Returned'];

export const GENERATED = `(${GENERATED_List.map((s) => "'" + s + "'")})`;
export const CANCELED = `(${CANCELED_LIST.map((s) => "'" + s + "'")})`;
export const CONFIRMED = `(${CONFIRMED_LIST.map((s) => "'" + s + "'")})`;

export const BOOKED = `(${BOOKED_LIST.map((s) => "'" + s + "'")})`;
export const BOOKING_ERROR = `(${BOOKING_ERROR_LIST.map(
  (s) => "'" + s + "'"
)})`;
export const DELIVERED = `(${DELIVERED_LIST.map((s) => "'" + s + "'")})`;
export const RETURNED = `(${RETURNED_LIST.map((s) => "'" + s + "'")})`;
