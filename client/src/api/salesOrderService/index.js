import Ajax from 'api/ajax';

class SalesOrderService extends Ajax {
  pathname = 'sales-order';

  fetchAllSalesOrder = () => this.getJson(`${this.pathname}/all`);

  fetchSalesOrder = (id) => this.getJson(`${this.pathname}/${id}`);

  fetchCreateSalesOrder = (data) => this.post(`${this.pathname}`, data);

  fetchUpdateSalesOrder = (id, data) => this.put(`${this.pathname}/${id}`, data);

  fetchDeleteSalesOrder = (id) => this.delete(`${this.pathname}/${id}`);
}

export const salesOrderService = new SalesOrderService();
