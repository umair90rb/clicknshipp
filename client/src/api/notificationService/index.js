import Ajax from 'api/ajax';

class NotificationService extends Ajax {
  pathname = 'notification';

  fetchAllNotification = (data) => this.post(`${this.pathname}/all`, data);

  fetchMarkReadNotification = (data) => this.post(`${this.pathname}/mark-read`, data);

  fetchCreateNotification = (data) => this.post(`${this.pathname}/create`, data);
}

export const notificationService = new NotificationService();
