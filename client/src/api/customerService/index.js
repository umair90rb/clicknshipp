import Ajax from 'api/ajax';

class CustomerService extends Ajax {
  pathname = 'customer';

  fetchAllCustomer = () => this.getJson(`${this.pathname}/all`);

  fetchCustomer = (id) => this.getJson(`${this.pathname}/${id}`);

  //   fetchAddUser = (data) => this.post(`${this.pathname}`, data);

  //   fetchUpdateUser = (id, data) => this.put(`${this.pathname}/${id}`, data);

  //   fetchDeleteUser = (id) => this.delete(`${this.pathname}/${id}`);
}

export const customerService = new CustomerService();
