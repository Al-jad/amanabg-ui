import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    loading: false,
    error: null,
    isAuthenticated: false,
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
        console.log('Attempting login for:', username);

        const response = await $axios.post('/Auth/login', {
          username,
          password,
        });

        console.log('Login response received:', response.status);

        if (response.data && response.data.accessToken) {
          // Update store state
          this.token = response.data.accessToken;
          this.user = { username };

          // Save to localStorage for direct access by axios interceptor
          if (process.client) {
            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('username', username);
            console.log(
              'Token saved to localStorage:',
              response.data.accessToken.substring(0, 10) + '...'
            );
          }

          return true;
        } else {
          console.error('Invalid response format:', response.data);
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
      if (process.client) {
        const token = localStorage.getItem('accessToken');
        const username = localStorage.getItem('username');

        if (token && username) {
          this.token = token;
          this.user = { username };
        }
      }
    },

    logout() {
      this.token = null;
      this.user = null;

      if (process.client) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('username');
      }
    },
  },

  persist: {
    storage: persistedState.localStorage,
  },
});
