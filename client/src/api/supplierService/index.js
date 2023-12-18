import Ajax from 'api/ajax';

class SupplierService extends Ajax {
  pathname = 'supplier';

  fetchAllSupplier = () => this.getJson(`${this.pathname}/all`);

  fetchSupplier = (id) => this.getJson(`${this.pathname}/${id}`);

  fetchAddSupplier = (data) => this.post(`${this.pathname}`, data);

  fetchUpdateSupplier = (id, data) => this.put(`${this.pathname}/${id}`, data);

  fetchDeleteSupplier = (id) => this.delete(`${this.pathname}/${id}`);
}

export const supplierService = new SupplierService();
