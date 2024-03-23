import Ajax from 'api/ajax';

class AuthService extends Ajax {
  pathname = 'auth';

  fetchLogin = (data) => this.post(`${this.pathname}/login`, data);
  fetchProfile = () => this.getJson(`${this.pathname}/profile`);
}

export const authService = new AuthService();
