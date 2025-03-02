import { useAuthStore } from '~/stores/auth';

export default defineNuxtPlugin((nuxtApp) => {
  // Initialize auth state on client-side only
  if (process.client) {
    const authStore = useAuthStore();

    // Initialize auth state from localStorage
    authStore.initAuth();
  }
});
