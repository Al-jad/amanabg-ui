import { defineStore } from 'pinia';
export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    user: null,
    loading: false,
    error: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => state.user,
    getError: (state) => state.error,
    getToken: (state) => state.token,
  },
  actions: {
    async login(username, password) {
      this.loading = true;
      this.error = null;
      try {
        const { $axios } = useNuxtApp();
        const response = await $axios.post('/Auth/login', {
          username,
          password,
        });
        const token = response.data?.token || response.data?.accessToken;
        if (token) {
          this.token = token;
          this.user = username;
          if (process.client) {
            localStorage.setItem('token', token);
            localStorage.setItem('user', username);
          }
          return true;
        }
        this.error = 'Invalid response from server';
        return false;
      } catch (error) {
        if (error.response?.status === 401) {
          this.error = 'Invalid username or password';
          this.handleUnauthorized();
        } else {
          this.error = 'An error occurred during login';
        }
        return false;
      } finally {
        this.loading = false;
      }
    },
    handleUnauthorized() {
      this.token = null;
      this.user = null;
      if (process.client) {
        localStorage.clear();
        window.location.href = '/login';
      }
    },
    initAuth() {
      if (process.client) {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (token && user) {
          this.token = token;
          this.user = user;
        } else {
          this.handleUnauthorized();
        }
      }
    },
    logout() {
      this.token = null;
      this.user = null;
      this.error = null;
      if (process.client) {
        localStorage.clear();
        window.location.href = '/login';
      }
    },
    clearError() {
      this.error = null;
    },
  },
});
