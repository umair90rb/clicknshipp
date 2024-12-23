import Ajax from 'api/ajax';

class BatchService extends Ajax {
  pathname = 'batch';

  fetchAllBatches = () => this.getJson(`${this.pathname}/all`);

  fetchBatch = (id) => this.getJson(`${this.pathname}/${id}`);

  fetchGetBatches = (data) => this.post(`${this.pathname}/get`, data);
}

export const batchService = new BatchService();
