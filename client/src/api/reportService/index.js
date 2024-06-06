import Ajax from 'api/ajax';

class ReportService extends Ajax {
  pathname = 'report';

  fetchAgentReport = (data) => this.post(`${this.pathname}/agent-report`, data);
}

export const reportService = new ReportService();
