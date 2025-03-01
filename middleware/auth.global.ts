export default defineNuxtRouteMiddleware((to) => {
  // Public routes that don't require authentication
  const publicRoutes = ['/login'];

  // Skip auth check for public routes
  if (publicRoutes.includes(to.path)) {
    return;
  }

  // Only run on client-side
  if (process.server) return;

  // Use our auth composable
  const { isAuthenticated } = useAuth();

  // If not authenticated, redirect to login
  if (!isAuthenticated()) {
    // Abort any current page rendering
    abortNavigation();

    // Redirect to login with replace to avoid history stacking
    return navigateTo('/login', { replace: true });
  }
});
