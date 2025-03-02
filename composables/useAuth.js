export const useAuth = () => {
  const isAuthenticated = () => {
    if (!process.client) return false;

    const token = localStorage.getItem('accessToken');
    return !!token;
  };

  const setAuth = (token, username) => {
    if (!process.client) return;

    localStorage.setItem('accessToken', token);
    localStorage.setItem('username', username);
  };

  const clearAuth = () => {
    if (!process.client) return;

    localStorage.removeItem('accessToken');
    localStorage.removeItem('username');
  };

  const getUsername = () => {
    if (!process.client) return null;
    return localStorage.getItem('username');
  };

  const getToken = () => {
    if (!process.client) return null;
    return localStorage.getItem('accessToken');
  };

  return {
    isAuthenticated,
    setAuth,
    clearAuth,
    getUsername,
    getToken,
  };
};
