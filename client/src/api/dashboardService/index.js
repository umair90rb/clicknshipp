import Ajax from 'api/ajax';

class DashboardService extends Ajax {
  pathname = 'dashboard';

  fetchStats = (startPeriod, endPeriod) => this.getJson(`${this.pathname}/stats?startPeriod=${startPeriod}&endPeriod=${endPeriod}`);
}

export const dashboardService = new DashboardService();
