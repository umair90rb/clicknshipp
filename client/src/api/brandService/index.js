import Ajax from 'api/ajax';

class BrandService extends Ajax {
  pathname = 'brand';

  fetchAllBrand = () => this.getJson(`${this.pathname}/all`);

  fetchBrand = (id) => this.getJson(`${this.pathname}/${id}`);

  fetchAddBrand = (data) => this.post(`${this.pathname}`, data);

  fetchUpdateBrand = (id, data) => this.put(`${this.pathname}/${id}`, data);

  fetchDeleteBrand = (id) => this.delete(`${this.pathname}/${id}`);
}

export const brandService = new BrandService();
