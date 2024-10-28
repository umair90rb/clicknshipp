import Ajax from 'api/ajax';

class RawMaterialService extends Ajax {
  pathname = 'raw-material';

  fetchAllRawMaterial = () => this.getJson(`${this.pathname}/all`);

  fetchRawMaterial = (id) => this.getJson(`${this.pathname}/${id}`);

  fetchCreateRawMaterial = (data) => this.post(`${this.pathname}`, data);

  fetchImportRawMaterial = (data) => this.post(`${this.pathname}/import`, data, { 'Content-Type': 'multipart/form-data' });

  fetchUpdateRawMaterial = (id, data) => this.put(`${this.pathname}/${id}`, data);

  fetchDeleteRawMaterial = (id) => this.delete(`${this.pathname}/${id}`);
}

export const rawMaterialService = new RawMaterialService();
