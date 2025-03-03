import Ajax from 'api/ajax';

class StockService extends Ajax {
  pathname = 'stock';

  fetchAllStock = (type, lowStock) => this.getJson(`${this.pathname}/all?type=${type}&stock_less_than=${lowStock}`);

  fetchStockHistory = (data) => this.post(`${this.pathname}/history`, data);

  fetchCreateStock = (data) => this.post(`${this.pathname}`, data);

  fetchCreateStockReturn = (data) => this.post(`${this.pathname}/return`, data);

  fetchCreateStockDamage = (data) => this.post(`${this.pathname}/damage`, data);

  fetchItemDamageReport = (data) => this.post(`${this.pathname}/damage-report`, data);

  fetchUpdateStock = (id, data) => this.put(`${this.pathname}/${id}`, data);

  fetchDeleteStock = (id) => this.delete(`${this.pathname}/${id}`);
}

export const stockService = new StockService();
