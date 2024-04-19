import Ajax from 'api/ajax';

class DashboardService extends Ajax {
  pathname = 'dashboard';

  fetchStats = () => this.getJson(`${this.pathname}/stats`);
}

export const dashboardService = new DashboardService();
