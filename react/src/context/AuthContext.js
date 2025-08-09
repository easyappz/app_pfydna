import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { message } from 'antd';
import authApi from '../api/auth';
import usersApi from '../api/users';
import getErrorMessage from '../utils/getErrorMessage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const setToken = useCallback((token) => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, []);

  const fetchMe = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        setLoading(false);
        return null;
      }
      const { data } = await authApi.me();
      setUser(data?.user || null);
      setLoading(false);
      return data?.user || null;
    } catch (error) {
      setToken(null);
      setUser(null);
      setLoading(false);
      return null;
    }
  }, [setToken]);

  const login = useCallback(async (email, password) => {
    try {
      const { data } = await authApi.login({ email, password });
      setToken(data?.token);
      setUser(data?.user || null);
      return data;
    } catch (error) {
      const msg = getErrorMessage(error);
      message.error(msg);
      throw error;
    }
  }, [setToken]);

  const register = useCallback(async (email, password) => {
    try {
      const { data } = await authApi.register({ email, password });
      setToken(data?.token);
      setUser(data?.user || null);
      return data;
    } catch (error) {
      const msg = getErrorMessage(error);
      message.error(msg);
      throw error;
    }
  }, [setToken]);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, [setToken]);

  const refreshProfile = useCallback(async () => {
    try {
      const { data } = await usersApi.getMe();
      setUser(data?.user || null);
      return data?.user || null;
    } catch (error) {
      return null;
    }
  }, []);

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  const value = useMemo(() => ({
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
    fetchMe,
    refreshProfile,
  }), [user, loading, login, register, logout, fetchMe, refreshProfile]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
