import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const API_BASE_URL = 'http://3.107.55.153:5000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token to headers
api.interceptors.request.use(
  async(config) => {
    const token=await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific status codes
      if (error.response.status === 401) {
        // Unauthorized - token expired or invalid
        AsyncStorage.removeItem('token');
        AsyncStorage.removeItem('user');
      }
      
      // Convert to a consistent error format
      const errorMessage = error.response.data?.message || 'An error occurred';
      return Promise.reject(new Error(errorMessage));
    } else if (error.request) {
      // The request was made but no response was received
      return Promise.reject(new Error('Network error. Please check your connection'));
    } else {
      // Something happened in setting up the request
      return Promise.reject(error);
    }
  }
);