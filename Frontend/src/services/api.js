// src/services/api.js
import axios from 'axios';

// Create an Axios instance with default config
const api = axios.create({
  withCredentials: true, // Necessary for sending/receiving cookies with the requests
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      // Could redirect to login or trigger auth context logout
      console.log('Authentication error');
      // You could dispatch an event or use a context to handle this
    }
    return Promise.reject(error);
  }
);

export default api;
