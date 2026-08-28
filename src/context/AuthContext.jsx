import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import * as authApi from '../api/auth';

const AuthContext = createContext(null);

function readStoredUser() {
  const raw = localStorage.getItem('authUser');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [token, setToken] = useState(() => localStorage.getItem('authToken'));
  const [authError, setAuthError] = useState('');

  // If any API call comes back 401, treat the session as expired.
  useEffect(() => {
    function handleUnauthorized() {
      setUser(null);
      setToken(null);
      setAuthError('Your session has expired. Please log in again.');
    }
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const persistSession = useCallback((data) => {
    // data: { token, userId, name, email, role }
    const nextUser = {
      userId: data.userId,
      name: data.name,
      email: data.email,
      role: data.role,
    };
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('authUser', JSON.stringify(nextUser));
    setToken(data.token);
    setUser(nextUser);
  }, []);

  const register = useCallback(
    async (payload) => {
      const data = await authApi.register(payload);
      persistSession(data);
      return data;
    },
    [persistSession]
  );

  const login = useCallback(
    async (payload) => {
      const data = await authApi.login(payload);
      persistSession(data);
      return data;
    },
    [persistSession]
  );

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    setToken(null);
    setUser(null);
  }, []);

  const clearAuthError = useCallback(() => setAuthError(''), []);

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token),
    authError,
    clearAuthError,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
