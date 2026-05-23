import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const t = localStorage.getItem('token');
    console.log('[AuthContext] Initializing token from localStorage:', t?.substring(0, 50));
    return t;
  });
  const [refreshToken, setRefreshToken] = useState(() => {
    const rt = localStorage.getItem('refreshToken');
    console.log('[AuthContext] Initializing refreshToken from localStorage:', rt?.substring(0, 50));
    return rt;
  });
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('user');
      const u = raw ? JSON.parse(raw) : null;
      console.log('[AuthContext] Initializing user from localStorage:', u?.username);
      return u;
    } catch (e) {
      console.log('[AuthContext] Error parsing user from localStorage:', e.message);
      return null;
    }
  });

  console.log('[AuthContext] State after init:', { token: Boolean(token), refreshToken: Boolean(refreshToken), user: Boolean(user) });

  useEffect(() => {
    if (token) localStorage.setItem('token', token); else localStorage.removeItem('token');
  }, [token]);

  useEffect(() => {
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken); else localStorage.removeItem('refreshToken');
  }, [refreshToken]);

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user)); else localStorage.removeItem('user');
  }, [user]);

  const login = ({ access, refresh, user: u }) => {
    console.log('[AuthContext] login() called with access:', access?.substring(0, 50), 'user:', u?.username);
    setToken(access);
    setRefreshToken(refresh);
    setUser(u || null);
  };

  const logout = () => {
    console.log('[AuthContext] logout() called');
    setToken(null);
    setRefreshToken(null);
    setUser(null);
    try { localStorage.removeItem('token'); localStorage.removeItem('refreshToken'); localStorage.removeItem('user'); } catch (e) {}
    window.location.href = '/';
  };

  const value = {
    token,
    refreshToken,
    user,
    isAuthenticated: Boolean(token),
    login,
    logout,
  };

  console.log('[AuthContext] Providing value:', { isAuthenticated: value.isAuthenticated, userEmail: value.user?.email });

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
