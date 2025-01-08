import Ajax from 'api/ajax';

class DashboardService extends Ajax {
  pathname = 'dashboard';

  fetchStats = (startPeriod, endPeriod) => this.getJson(`${this.pathname}/stats?startPeriod=${startPeriod}&endPeriod=${endPeriod}`);
  fetchGraph = (startPeriod, endPeriod) => this.getJson(`${this.pathname}/graph?startPeriod=${startPeriod}&endPeriod=${endPeriod}`);
}

export const dashboardService = new DashboardService();
