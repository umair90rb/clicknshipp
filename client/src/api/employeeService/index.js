import Ajax from 'api/ajax';

class EmployeeService extends Ajax {
  pathname = 'employee';

  fetchAllEmployee = () => this.getJson(`${this.pathname}/all`);

  fetchEmployee = (id) => this.getJson(`${this.pathname}/${id}`);

  fetchCreateEmployee = (data) => this.post(`${this.pathname}`, data);

  fetchCreateEmployeeEducation = (data) => this.post(`${this.pathname}/education`, data);

  fetchCreateEmployeeExperience = (data) => this.post(`${this.pathname}/experience`, data);

  fetchCreateEmployeeImmediateContact = (data) => this.post(`${this.pathname}/immediate-contact`, data);

  fetchCreateEmployeeAllowance = (data) => this.post(`${this.pathname}/allowance`, data);

  fetchUpdateEmployee = (id, data) => this.put(`${this.pathname}/${id}`, data);

  fetchDeleteEmployee = (id) => this.delete(`${this.pathname}/${id}`);
}

export const employeeService = new EmployeeService();
