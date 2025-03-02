import { defineNuxtPlugin } from '#app';
import axios from 'axios';

export default defineNuxtPlugin((nuxtApp) => {
  const axiosInstance = axios.create({
    baseURL: 'https://amanaapi.alfakharco.com/api',
    timeout: 10000000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor to add auth token to all requests
  axiosInstance.interceptors.request.use(
    (config) => {
      // Only add token on client-side
      if (process.client) {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log('Added auth token to request:', config.url);
        } else {
          console.log('No auth token found for request:', config.url);
        }
      }
      return config;
    },
    (error) => {
      console.error('Request interceptor error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle common errors
  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response && error.response.status === 401) {
        console.error('Unauthorized request detected');
        // Clear auth data on 401 responses
        if (process.client) {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('username');
          // Redirect to login page if not already there
          const router = useRouter();
          if (router.currentRoute.value.path !== '/login') {
            navigateTo('/login');
          }
        }
      }
      return Promise.reject(error);
    }
  );

  nuxtApp.provide('axios', axiosInstance);
});
