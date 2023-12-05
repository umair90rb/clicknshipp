import Ajax from 'api/ajax';

class RoleService extends Ajax {
  pathname = 'role';

  fetchAllRole = () => this.getJson(`${this.pathname}/all`);

  fetchRole = (id) => this.getJson(`${this.pathname}/${id}`);

  fetchAddRole = (data) => this.post(`${this.pathname}`, data);

  fetchUpdateRole = (id, data) => this.put(`${this.pathname}/${id}`, data);

  fetchDeleteRole = (id) => this.delete(`${this.pathname}/${id}`);
}

export const roleService = new RoleService();
