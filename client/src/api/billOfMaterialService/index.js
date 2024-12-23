import Ajax from 'api/ajax';

class BillOfMaterialService extends Ajax {
  pathname = 'bom';

  fetchAllBillOfMaterial = () => this.getJson(`${this.pathname}/all`);

  fetchBillOfMaterial = (id) => this.getJson(`${this.pathname}/${id}`);

  fetchCreateBillOfMaterial = (data) => this.post(`${this.pathname}`, data);

  fetchUpdateMaterialQuantity = (id, data) => this.put(`${this.pathname}/material/${id}`, data);

  fetchFullfilBillOfMaterial = (id, locationId) => this.getJson(`${this.pathname}/fullfil/${id}/from/${locationId}`);

  fetchUpdateBillOfMaterial = (id, data) => this.put(`${this.pathname}/${id}`, data);

  fetchDeleteBillOfMaterial = (id) => this.delete(`${this.pathname}/${id}`);
}

export const billOfMaterialService = new BillOfMaterialService();
