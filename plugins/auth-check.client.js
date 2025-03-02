export default defineNuxtPlugin((nuxtApp) => {
  // Add a router hook to check authentication status on page navigation
  const router = useRouter();
  const auth = useAuth();

  router.beforeEach((to, from) => {
    // Skip for login page and public pages
    const publicPages = ['/login', '/privacy', '/terms', '/contact'];
    const isPublicPage = publicPages.includes(to.path);

    // Check if user is authenticated
    const isAuthenticated = auth.isAuthenticated();

    // Only redirect if coming from a page refresh or direct URL access
    if (!isAuthenticated && !isPublicPage && !from.name) {
      console.log(`Redirecting to login from ${to.path}`);
      return '/login';
    }
  });
});
