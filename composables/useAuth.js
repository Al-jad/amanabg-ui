import { useAuthStore } from '~/stores/auth';
export const useAuth = () => {
  const authStore = useAuthStore();
  const isAuthenticated = () => {
    if (!process.client) return false;
    return authStore.isAuthenticated;
  };
  const login = async (username, password) => {
    return await authStore.login(username, password);
  };
  const logout = () => {
    authStore.logout();
  };
  const getUser = () => {
    return authStore.getUser;
  };
  const getError = () => {
    return authStore.getError;
  };
  const clearError = () => {
    authStore.clearError();
  };
  if (process.client) {
    authStore.initAuth();
  }
  return {
    isAuthenticated,
    login,
    logout,
    getUser,
    getError,
    clearError,
  };
};
