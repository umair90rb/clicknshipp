import Ajax from 'api/ajax';

class UnitOfMeasureService extends Ajax {
  pathname = 'uom';

  fetchAllUnitOfMeasure = () => this.getJson(`${this.pathname}/all`);

  fetchUnitOfMeasure = (id) => this.getJson(`${this.pathname}/${id}`);

  fetchCreateUnitOfMeasure = (data) => this.post(`${this.pathname}`, data);

  fetchUpdateUnitOfMeasure = (id, data) => this.put(`${this.pathname}/${id}`, data);

  fetchDeleteUnitOfMeasure = (id) => this.delete(`${this.pathname}/${id}`);
}

export const unitOfMeasureService = new UnitOfMeasureService();
