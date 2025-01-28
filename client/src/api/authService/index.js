import Ajax from 'api/ajax';

class AuthService extends Ajax {
  pathname = 'auth';

  fetchLogin = (data) => this.post(`${this.pathname}/login`, data);
  fetchProfile = () => this.getJson(`${this.pathname}/profile`);
  fetchUpdatePassword = (data) => this.post(`${this.pathname}/update-password`, data);
}

export const authService = new AuthService();
