import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3001', // Replace with your actual base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add interceptors for handling tokens or logging
apiClient.interceptors.request.use(
  (config) => {
    // You can attach authorization tokens if needed
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
