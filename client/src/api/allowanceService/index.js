import Ajax from 'api/ajax';

class AllowanceService extends Ajax {
  pathname = 'allowance';

  fetchAllAllowance = () => this.getJson(`${this.pathname}/all`);

  fetchAllowance = (id) => this.getJson(`${this.pathname}/${id}`);

  fetchCreateAllowance = (data) => this.post(`${this.pathname}`, data);

  fetchUpdateAllowance = (id, data) => this.put(`${this.pathname}/${id}`, data);

  fetchDeleteAllowance = (id) => this.delete(`${this.pathname}/${id}`);
}

export const allowanceService = new AllowanceService();
