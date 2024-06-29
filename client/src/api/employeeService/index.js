import Ajax from 'api/ajax';

class EmployeeService extends Ajax {
  pathname = 'employee';

  fetchAllEmployee = () => this.getJson(`${this.pathname}/all`);

  fetchEmployee = (id) => this.getJson(`${this.pathname}/${id}`);

  fetchCreateEmployee = (data) => this.post(`${this.pathname}`, data);

  fetchUpdateEmployee = (id, data) => this.put(`${this.pathname}/${id}`, data);

  fetchDeleteEmployee = (id) => this.delete(`${this.pathname}/${id}`);
}

export const employeeService = new EmployeeService();
