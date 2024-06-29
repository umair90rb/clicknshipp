import Ajax from 'api/ajax';

class DepartmentService extends Ajax {
  pathname = 'department';

  fetchAllDepartment = () => this.getJson(`${this.pathname}/all`);

  fetchDepartment = (id) => this.getJson(`${this.pathname}/${id}`);

  fetchCreateDepartment = (data) => this.post(`${this.pathname}`, data);

  fetchUpdateDepartment = (id, data) => this.put(`${this.pathname}/${id}`, data);

  fetchDeleteDepartment = (id) => this.delete(`${this.pathname}/${id}`);
}

export const departmentService = new DepartmentService();
