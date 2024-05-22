import axios from 'axios';
import { getEnvs } from './getEnv';
const { NODE_ENV, REACT_APP_API, REACT_APP_API_PREFIX } = getEnvs();

const baseURL = `${REACT_APP_API}/${REACT_APP_API_PREFIX}`;
const config = {
  timeout: 20000
};
if (NODE_ENV !== 'production') {
  config.baseURL = baseURL;
}
if (NODE_ENV === 'production') {
  const loc = window.location;
  config.baseURL = `${loc.protocol}//${loc.host}/${REACT_APP_API_PREFIX}`;
}

const http = axios.create(config);

class Ajax {
  getToken() {
    return localStorage.getItem('token');
  }

  getDefaultHeaders(headers = {}) {
    const token = this.getToken();
    const defaultHeaders = {
      'Content-Type': 'application/json',
      Authorization: token ? `Bearer ${token}` : '',
      ...headers
    };
    return defaultHeaders;
  }

  getJson = (url, params, headers = {}) => {
    return http.get(url, { headers: this.getDefaultHeaders(headers), params });
  };

  post = (url, data, headers = {}) => {
    return http.post(url, data, { headers: this.getDefaultHeaders(headers) });
  };

  put = (url, data, headers = {}) => {
    return http.put(url, data, { headers: this.getDefaultHeaders(headers) });
  };

  delete = (url, headers = {}) => {
    return http.delete(url, { headers: this.getDefaultHeaders(headers) });
  };
}

export default Ajax;

if (NODE_ENV !== 'production') {
  http.interceptors.request.use((request) => {
    console.log('request', 'url:', request.url, 'headers:', request.headers, 'params:', request.params, 'data:', request.data);
    return request;
  });

  http.interceptors.response.use((response) => {
    console.log('response', 'url:', response.url, 'headers:', response.headers, 'data:', response.data);
    return response;
  });
}
