import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3001', // Replace with your backend URL
  headers: {
    'Content-Type': 'application/json', // Default header for JSON payloads
  },
});

// Add an interceptor to include the token dynamically
apiClient.interceptors.request.use(
  (config) => {
    // Retrieve the token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // Attach the token to the Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

export default apiClient;
