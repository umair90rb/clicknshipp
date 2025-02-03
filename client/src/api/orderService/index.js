import Ajax from 'api/ajax';

class OrderService extends Ajax {
  pathname = 'order';

  fetchAllOrder = (data) => this.post(`${this.pathname}/all`, data);

  fetchOrder = (id, params) => this.getJson(`${this.pathname}/${id}`, params);

  fetchUpdateStatusOrder = (data) => this.post(`${this.pathname}/status`, data);

  fetchAddPaymentInOrder = (data) => this.post(`${this.pathname}/add-payment`, data);

  fetchUpdateItemsInOrder = (data) => this.post(`${this.pathname}/update-items`, data);

  fetchAssignOrders = (data) => this.post(`${this.pathname}/assign`, data);

  fetchFilteredOrder = (data) => this.post(`${this.pathname}/filtered`, data);

  fetchCreateOrder = (data) => this.post(`${this.pathname}`, data);

  fetchBookOrder = (data) => this.post(`${this.pathname}/book`, data);

  fetchReturnOrder = (identifier) => this.getJson(`${this.pathname}/return/${identifier}`);

  fetchOrderBulkBook = (data) => this.post(`${this.pathname}/bulk-book`, data);

  fetchDownloadBookedOrderReceipts = (data) => this.post(`${this.pathname}/download-receipts`, data);

  fetchCancelOrderBooking = (id) => this.getJson(`${this.pathname}/cancel-booking/${id}`);

  fetchOrderBookingStatus = (id) => this.getJson(`${this.pathname}/get-delivery-status/${id}`);

  fetchImportOrder = (data) => this.post(`${this.pathname}/import`, data, { 'Content-Type': 'multipart/form-data' });

  fetchUpdateOrder = (id, data) => this.put(`${this.pathname}/${id}`, data);

  fetchPartialUpdateOrder = (id, data) => this.patch(`${this.pathname}/partial/${id}`, data);

  fetchDeleteOrder = (id) => this.delete(`${this.pathname}/${id}`);

  fetchBulkOrdersDelete = (body) => this.post(`${this.pathname}/remove`, body);
}

export const orderService = new OrderService();
