import Ajax from 'api/ajax';

class LogService extends Ajax {
  pathname = 'logs';

  fetchOrderCreateLogs = () => this.getJson(`${this.pathname}/webhook/order/create`);
}

export const logService = new LogService();
