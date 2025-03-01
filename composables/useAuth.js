export const useAuth = () => {
  const isAuthenticated = () => {
    if (process.server) return false;
    return !!localStorage.getItem('authToken');
  };

  const getToken = () => {
    if (process.server) return null;
    return localStorage.getItem('authToken');
  };

  const logout = () => {
    if (process.server) return;
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    navigateTo('/login');
  };

  return {
    isAuthenticated,
    getToken,
    logout,
  };
};
