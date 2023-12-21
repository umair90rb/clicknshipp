import Ajax from 'api/ajax';

class ItemService extends Ajax {
  pathname = 'item';

  fetchAllItem = () => this.getJson(`${this.pathname}/all`);

  fetchItem = (id) => this.getJson(`${this.pathname}/${id}`);

  fetchCreateItem = (data) => this.post(`${this.pathname}`, data);

  fetchImportItems = (data) => this.post(`${this.pathname}/import`, data, { 'Content-Type': 'multipart/form-data' });

  fetchUpdateItem = (id, data) => this.put(`${this.pathname}/${id}`, data);

  fetchDeleteItem = (id) => this.delete(`${this.pathname}/${id}`);
}

export const itemService = new ItemService();
