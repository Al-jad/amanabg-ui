import { useAuthStore } from '~/stores/auth';
export default defineNuxtRouteMiddleware((to) => {
  if (process.server) return;
  const publicPages = ['/login', '/privacy', '/terms', '/contact', '/'];
  const isPublicPage = publicPages.includes(to.path);
  const authStore = useAuthStore();
  if (isPublicPage) return;
  authStore.initAuth();
  if (!authStore.isAuthenticated) {
    return navigateTo('/login', { replace: true });
  }
});
