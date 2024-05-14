import axios from "axios";

const getAxiosInstance = (baseURL, headers) => {
  const http = axios.create({
    baseURL: baseURL,
    timeout: 10000,
    headers: { ...headers },
  });
  http.interceptors.request.use((request) => {
    console.log(
      "request",
      "url:",
      request.url,
      "headers:",
      request.headers,
      "params:",
      request.params,
      "data:",
      request.data
    );
    return request;
  });

  http.interceptors.response.use((response) => {
    console.log(
      "response",
      "url:",
      response.url,
      "headers:",
      response.headers,
      "data:",
      response.data
    );
    return response;
  });
  return http;
};

export default getAxiosInstance;
