import Ajax from 'api/ajax';

class StockService extends Ajax {
  pathname = 'stock';

  fetchAllStock = () => this.getJson(`${this.pathname}/all`);

  fetchStock = (id) => this.getJson(`${this.pathname}/${id}`);

  fetchCreateStock = (data) => this.post(`${this.pathname}`, data);

  fetchUpdateStock = (id, data) => this.put(`${this.pathname}/${id}`, data);

  fetchDeleteStock = (id) => this.delete(`${this.pathname}/${id}`);
}

export const stockService = new StockService();
