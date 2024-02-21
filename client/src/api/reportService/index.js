import Ajax from 'api/ajax';

class ReportService extends Ajax {
  pathname = 'report';

  fetchConfirmOrderReport = (data) => this.post(`${this.pathname}/product-order-count`, data);
}

export const reportService = new ReportService();
