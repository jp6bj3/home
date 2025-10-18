import { useState, useEffect } from 'react';
import { authService } from '../services/auth';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 檢查登入狀態
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const response = await authService.verifyToken();
      if (response.success) {
        setUser(response.user);
      }
    } catch (err) {
      console.log('Not authenticated');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // 登入
  const login = async (username, password, role) => {
    try {
      setError(null);
      const response = await authService.login(username, password, role);
      if (response.success) {
        setUser(response.user);
        return { success: true };
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || '登入失敗';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    }
  };

  // 登出
  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
      // 即使 API 失敗也清除本地狀態
      setUser(null);
    }
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user
  };
};
