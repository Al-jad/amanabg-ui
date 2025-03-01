export default defineNuxtRouteMiddleware((to) => {
  if (to.path === '/login') {
    return;
  }
  if (process.client) {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      return navigateTo('/login');
    }
  }
});
