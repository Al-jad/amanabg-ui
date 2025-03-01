export const useAuth = () => {
  const isAuthenticated = () => {
    if (process.client) {
      return !!localStorage.getItem('authToken');
    }
    return false;
  };

  const setAuth = (token, username) => {
    if (process.client) {
      localStorage.setItem('authToken', token);
      localStorage.setItem('username', username);
    }
  };

  const getUsername = () => {
    if (process.client) {
      return localStorage.getItem('username');
    }
    return null;
  };

  return {
    isAuthenticated,
    setAuth,
    getUsername,
  };
};
