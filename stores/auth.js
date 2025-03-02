import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    getUser: (state) => state.user,
    getToken: (state) => state.token,
    getError: (state) => state.error,
    isLoading: (state) => state.loading,
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

        if (response.data.accessToken) {
          this.token = response.data.accessToken;
          this.user = { username };
          return true;
        } else {
          this.error = 'Invalid response from server';
          return false;
        }
      } catch (err) {
        console.error('Login failed', err);

        if (err.response) {
          switch (err.response.status) {
            case 400:
            case 401:
              this.error = 'Invalid Username or Password';
              break;
            case 403:
              this.error = 'Your account is pending approval';
              break;
            case 404:
              this.error = 'User not found';
              break;
            default:
              this.error = `Login failed: ${err.response.data?.message || 'Unknown error'}`;
          }
        } else {
          this.error = 'Network error. Please check your connection';
        }
        return false;
      } finally {
        this.loading = false;
      }
    },

    initAuth() {
      // This will be called on app initialization to restore auth state
      const token = localStorage.getItem('authToken');
      const username = localStorage.getItem('username');

      if (token && username) {
        this.token = token;
        this.user = { username };
      }
    },
  },

  persist: {
    storage: persistedState.localStorage,
  },
});
