import Ajax from 'api/ajax';

class StockService extends Ajax {
  pathname = 'stock';

  fetchAllStock = (type) => this.getJson(`${this.pathname}/all?type=${type}`);

  fetchStockHistory = (data) => this.post(`${this.pathname}/history`, data);

  fetchCreateStock = (data) => this.post(`${this.pathname}`, data);

  fetchUpdateStock = (id, data) => this.put(`${this.pathname}/${id}`, data);

  fetchDeleteStock = (id) => this.delete(`${this.pathname}/${id}`);
}

export const stockService = new StockService();
