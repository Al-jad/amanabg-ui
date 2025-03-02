export default defineNuxtRouteMiddleware((to, from) => {
  // Skip middleware for login page and public pages
  const publicPages = ['/login', '/privacy', '/terms', '/contact'];
  const isPublicPage = publicPages.includes(to.path);

  // Check if user is authenticated by looking for token in localStorage
  const auth = useAuth();
  const isAuthenticated = auth.isAuthenticated();

  // Simple redirect logic - only redirect to login if not authenticated
  if (!isAuthenticated && !isPublicPage) {
    // If not authenticated and trying to access a protected page, redirect to login
    return navigateTo('/login');
  }
});
