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
  axiosInstance.interceptors.request.use(
    (config) => {
      if (process.client) {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );
  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        if (process.client) {
          localStorage.clear();
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );
  nuxtApp.provide('axios', axiosInstance);
});
