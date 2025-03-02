export const useAuth = () => {
  const isAuthenticated = () => {
    if (process.client) {
      return !!localStorage.getItem('accessToken');
    }
    return false;
  };

  const setAuth = (token, username) => {
    if (process.client) {
      localStorage.setItem('accessToken', token);
      localStorage.setItem('username', username);
    }
  };

  const getUsername = () => {
    if (process.client) {
      return localStorage.getItem('username');
    }
    return null;
  };

  const getToken = () => {
    if (process.client) {
      return localStorage.getItem('accessToken');
    }
    return null;
  };

  return {
    isAuthenticated,
    setAuth,
    getUsername,
    getToken,
  };
};
