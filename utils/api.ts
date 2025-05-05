import axios from 'axios';
const API = axios.create({

  baseURL: 'http://192.168.233.136:5001', // for mobile . 
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add request interceptor
API.interceptors.request.use(
  (config) => {
    // You can add auth token here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout');
    }
    return Promise.reject(error);
  }
);

export default API;