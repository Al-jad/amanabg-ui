import { defineNuxtPlugin } from '#app';
import axios from 'axios';
import { useAuthStore } from '~/stores/auth';

export default defineNuxtPlugin((nuxtApp) => {
  const axiosInstance = axios.create({
    baseURL: 'https://amanaapi.alfakharco.com/api',
    timeout: 10000000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // List of endpoints that don't need authentication
  const publicEndpoints = [
    '/Auth/login',
    // Add other public endpoints here
  ];

  axiosInstance.interceptors.request.use(
    (config) => {
      // Check if this is a public endpoint
      const isPublicEndpoint = publicEndpoints.some((endpoint) =>
        config.url?.includes(endpoint)
      );

      if (process.client && !isPublicEndpoint) {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => {
      console.log('Request Error:', error);
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      console.log('Full Error Object:', error);

      // Check for network errors
      if (!error.response) {
        console.log('Network error or no response from server');
        return Promise.reject(error);
      }

      // Check for specific error status
      const status = error.response?.status;
      console.log('Response Status:', status);

      // Handle 401 errors (except for login endpoint)
      if (status === 401 && !error.config.url?.includes('/Auth/login')) {
        console.log('Unauthorized access detected (401)');
        const authStore = useAuthStore();
        authStore.handleUnauthorized();
      }

      return Promise.reject(error);
    }
  );

  nuxtApp.provide('axios', axiosInstance);
});
