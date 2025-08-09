import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authMe } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setIsReady(true);
      return;
    }
    (async () => {
      try {
        const res = await authMe();
        setUser(res.user);
      } catch (e) {
        // handled by global interceptor
      } finally {
        setIsReady(true);
      }
    })();
  }, []);

  const setSession = (token, nextUser) => {
    if (token) {
      localStorage.setItem('token', token);
    }
    if (nextUser) setUser(nextUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = useMemo(() => ({ user, setUser, isReady, setSession, logout }), [user, isReady]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
