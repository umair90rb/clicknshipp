import Ajax from 'api/ajax';

class CustomerService extends Ajax {
  pathname = 'customer';

  fetchAllCustomer = (body) => this.post(`${this.pathname}/all`, body);

  fetchCustomer = (id) => this.getJson(`${this.pathname}/${id}`);

  fetchSearchCustomer = (query) => this.post(`${this.pathname}/search`, query);

  //   fetchAddUser = (data) => this.post(`${this.pathname}`, data);

  //   fetchUpdateUser = (id, data) => this.put(`${this.pathname}/${id}`, data);

  //   fetchDeleteUser = (id) => this.delete(`${this.pathname}/${id}`);
}

export const customerService = new CustomerService();
