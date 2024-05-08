import Ajax from 'api/ajax';

class DeliveryServiceAccounts extends Ajax {
  pathname = 'delivery-service-accounts';

  fetchAllDeliveryServiceAccounts = () => this.getJson(`${this.pathname}/all`);

  fetchDeliveryServiceAccount = (id) => this.getJson(`${this.pathname}/${id}`);

  fetchCreateDeliveryServiceAccount = (data) => this.post(`${this.pathname}`, data);

  fetchUpdateDeliveryServiceAccount = (id, data) => this.put(`${this.pathname}/${id}`, data);

  fetchDeleteDeliveryServiceAccount = (id) => this.delete(`${this.pathname}/${id}`);
}

export const deliveryServiceAccountsService = new DeliveryServiceAccounts();
