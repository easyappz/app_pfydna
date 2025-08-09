import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authMe, login as apiLogin, register as apiRegister } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const saveToken = (token) => {
    if (token) {
      localStorage.setItem('token', token);
    }
  };

  const clearToken = () => {
    localStorage.removeItem('token');
  };

  const refreshUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        setLoading(false);
        return null;
      }
      const { user: me } = await authMe();
      setUser(me);
      setLoading(false);
      return me;
    } catch (e) {
      setUser(null);
      setLoading(false);
      return null;
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback(async (email, password) => {
    const { token, user: me } = await apiLogin({ email, password });
    saveToken(token);
    setUser(me);
    return me;
  }, []);

  const register = useCallback(async (email, password) => {
    const { token, user: me } = await apiRegister({ email, password });
    saveToken(token);
    setUser(me);
    return me;
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, setUser, loading, login, register, logout, refreshUser }), [user, loading, login, register, logout, refreshUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
