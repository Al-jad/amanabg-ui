export default defineNuxtPlugin((nuxtApp) => {
  // Add a router hook to check authentication status on page navigation
  const router = useRouter();

  router.beforeEach((to, from) => {
    // Skip for login page and public pages
    const publicPages = ['/login', '/privacy', '/terms', '/contact'];
    const isPublicPage = publicPages.includes(to.path);

    // Check if user is authenticated
    const authToken = localStorage.getItem('authToken');
    const isAuthenticated = !!authToken;

    // Redirect to login if not authenticated and trying to access a protected page
    if (!isAuthenticated && !isPublicPage) {
      return '/login';
    }
  });
});
