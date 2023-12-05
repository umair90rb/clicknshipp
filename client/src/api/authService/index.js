import Ajax from 'api/ajax';

class AuthService extends Ajax {
  pathname = 'auth';

  fetchLogin = (data) => this.post(`${this.pathname}/login`, data);
}

export const authService = new AuthService();
