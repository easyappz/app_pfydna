import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { me as apiMe, login as apiLogin, register as apiRegister } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [token, setTokenState] = useState(() => localStorage.getItem('token'));

  const setToken = useCallback((value) => {
    if (value) {
      localStorage.setItem('token', value);
      setTokenState(value);
    } else {
      localStorage.removeItem('token');
      setTokenState(null);
    }
  }, []);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['auth', 'me', token],
    queryFn: async () => {
      const res = await apiMe();
      return res.user;
    },
    enabled: Boolean(token),
    staleTime: 60_000,
  });

  const user = data ?? null;

  const login = useCallback(async (payload) => {
    const res = await apiLogin(payload);
    setToken(res.token);
    await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    await refetch();
    return res;
  }, [queryClient, refetch, setToken]);

  const register = useCallback(async (payload) => {
    const res = await apiRegister(payload);
    setToken(res.token);
    await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    await refetch();
    return res;
  }, [queryClient, refetch, setToken]);

  const logout = useCallback(async () => {
    setToken(null);
    await queryClient.resetQueries({ queryKey: ['auth', 'me'] });
  }, [queryClient, setToken]);

  const value = useMemo(() => ({ user, isLoading, isError, token, setToken, login, register, refetchUser: refetch, logout }), [user, isLoading, isError, token, setToken, login, register, refetch, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
