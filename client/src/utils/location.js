import { getEnvs } from '../api/getEnv';

const { REACT_APP_PLATFORM_URL } = getEnvs();

class Location {
  pathname = '';

  constructor(pathname = '/') {
    this.pathname = pathname;
  }

  rootUrl = () => this.pathname;

  platformRegistrationUrl = () => `${REACT_APP_PLATFORM_URL}/register`;
  platformLoginUrl = () => `${REACT_APP_PLATFORM_URL}/login`;

  loginUrl = () => `${this.pathname}login`;
  registrationUrl = () => `${this.pathname}register`;
  dashboardUrl = () => `${this.pathname}dashboard`;

  allOrders = () => `${this.pathname}order/all`;
  createOrder = () => `${this.pathname}order/new`;
  viewOrder = (id) => `${this.pathname}order/${id}`;

  users = () => `${this.pathname}users`;
}

const location = new Location();

export default location;
