import axios from 'axios';

const getAxiosInstance = (baseURL, headers) => {
  const http = axios.create({
    baseURL: baseURL,
    timeout: 30000,
    headers: { ...headers },
  });

  http.interceptors.request.use((request) => {
    console.log(
      'request',
      request.url,
      'data:',
      request.data || request.params
    );
    return request;
  });

  http.interceptors.response.use((response) => {
    console.log('response:', response.status, response.data);
    return response;
  });
  return http;
};

export default getAxiosInstance;
