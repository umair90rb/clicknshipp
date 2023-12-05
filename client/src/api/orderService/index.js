import Ajax from 'api/ajax';

class OrderService extends Ajax {
  pathname = 'order';

  fetchAllOrder = () => this.getJson(`${this.pathname}/all`);

  fetchOrder = (id) => this.getJson(`${this.pathname}/${id}`);

  fetchCreateOrder = (data) => this.post(`${this.pathname}`, data);

  fetchImportOrder = (data) => this.post(`${this.pathname}/import`, data, { 'Content-Type': 'multipart/form-data' });

  fetchUpdateOrder = (id, data) => this.put(`${this.pathname}/${id}`, data);

  fetchDeleteOrder = (id) => this.delete(`${this.pathname}/${id}`);
}

export const orderService = new OrderService();
