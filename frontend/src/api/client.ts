import axios from 'axios';
import type { AxiosError, AxiosRequestConfig } from 'axios';
import type { ApiError } from '../types';

// Create axios instance
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding the auth token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Handle session expiration
    if (error.response?.status === 401) {
      // If we're not on the login page and the token is invalid, redirect to login
      if (localStorage.getItem('token') && !window.location.pathname.includes('/login')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    
    // Format the error response
    let formattedError: ApiError = {
      success: false,
      error: 'UnknownError',
      message: 'Se produjo un error desconocido',
    };
    
    if (error.response?.data) {
      formattedError = {
        ...formattedError,
        ...error.response.data,
      };
    } else if (error.message) {
      formattedError.message = error.message;
      
      // Handle network errors
      if (error.message === 'Network Error') {
        formattedError.error = 'NetworkError';
        formattedError.message = 'Error de conexión. Por favor, verifica tu conexión a internet.';
      }
    }
    
    return Promise.reject(formattedError);
  }
);

// Generic API request function with type safety
export async function apiRequest<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    const response = await apiClient(config);
    return response.data as T;
  } catch (error) {
    throw error;
  }
}
