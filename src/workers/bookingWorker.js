// import { Worker } from 'bullmq';
// import connection from '../config/redis';
// import _orderService from '../services/OrderService';
// import deliveryServiceAccountService from '../services/DeliveryServiceAccountService';
// import bookingService from '../services/BookingService';
// import logger from '../middleware/logger';

// const bookingWorker = new Worker(
//   'bookingQueue',
//   async (job) => {
//     const { orderId, deliveryAccountId } = job.data;
//     // if (await _orderService.isOrderBooked(orderId)) {
//     //   logger.log(
//     //     'error',
//     //     `order with id:${orderId} is already booked. Cannot book with delivery service id:${deliveryAccountId}`
//     //   );
//     //   return;
//     // }
//     const order = await _orderService.loadOrderForBooking(orderId);
//     const deliveryAccount =
//       await deliveryServiceAccountService.getAccountWithToken(
//         deliveryAccountId
//       );
//     const bookingRes = await bookingService.bookParcelWithCourier(
//       order,
//       deliveryAccount
//     );
//     await _orderService.updateOrderAfterBooking(
//       bookingRes,
//       order,
//       deliveryAccount
//     );
//   },
//   {
//     connection,
//   }
// );

// export default bookingWorker;
