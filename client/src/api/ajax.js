import axios from '../../node_modules/axios/index';
import { getEnvs } from './getEnv';
const { REACT_APP_API, REACT_APP_API_PREFIX } = getEnvs();

const baseURL = `${REACT_APP_API}/${REACT_APP_API_PREFIX}`;
export const http = axios.create({
  baseURL,
  timeout: 3000
});

http.interceptors.request.use((request) => {
  console.log('url:', request.url, 'headers:', request.headers, 'params:', request.params, 'data:', request.data);
  return request;
});

http.interceptors.response.use((response) => {
  console.log('url:', response.url, 'headers:', response.headers, 'data:', response.data);
  return response;
});

class Ajax {
  instance = undefined;
  defaultHeaders = {
    'Content-Type': 'application/json'
  };

  getJson = (url, params, headers) => http.get(url, { headers: { ...this.defaultHeaders, ...headers }, params });

  post = (url, data, headers = {}) => http.post(url, data, { headers: { ...this.defaultHeaders, ...headers } });

  put = (url, data, headers = {}) => http.put(url, data, { headers: { ...this.defaultHeaders, ...headers } });

  delete = (url, headers = {}) => http.delete(url, { headers: { ...this.defaultHeaders, ...headers } });
}

export default Ajax;
