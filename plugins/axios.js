import { defineNuxtPlugin } from '#app';
import axios from 'axios';

export default defineNuxtPlugin(nuxtApp => {
  const axiosInstance = axios.create({
    baseURL: 'https://amanaapi.alfakharco.com/api', 
    timeout: 10000, 
    headers: {
      'Content-Type': 'application/json',
    },
  });
  nuxtApp.provide('axios', axiosInstance);
});
