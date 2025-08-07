import Ajax from 'api/ajax';

class LogService extends Ajax {
  pathname = 'logs';

  fetchOrderCreateLogs = (page, limit, filters) =>
    this.getJson(
      `${this.pathname}/webhook/order/create?page=${page}&limit=${limit}&${Object.entries(filters)
        .map(([key, value]) => `${key}=${value}`)
        .join('&')}`
    );
}

export const logService = new LogService();
