import Ajax from 'api/ajax';

class UserService extends Ajax {
  pathname = 'user';

  fetchAllUser = () => this.getJson(`${this.pathname}/all`);

  fetchUser = (id) => this.getJson(`${this.pathname}/${id}`);

  fetchUsersWithPermissions = (data) => this.post(`${this.pathname}/with-permissions`, data);

  fetchAddUser = (data) => this.post(`${this.pathname}`, data);

  fetchUpdateUser = (id, data) => this.put(`${this.pathname}/${id}`, data);

  fetchSetDefaultBrand = (id) => this.getJson(`${this.pathname}/set-default-brand/${id}`);

  fetchDeleteUser = (id) => this.delete(`${this.pathname}/${id}`);
}

export const userService = new UserService();
