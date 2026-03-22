import { createContext, useContext, useState, type ReactNode } from 'react';
import { api, getToken, setToken, clearToken, parseTokenUser } from '../lib/api';
import type { User, AuthContextValue } from '../types';

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const token = getToken();
    return token ? parseTokenUser(token) : null;
  });

  const handleLogin = async (username: string, password: string): Promise<void> => {
    const { token, user: u } = await api.auth.login(username, password);
    setToken(token);
    setUser(u);
  };

  const handleRegister = async (username: string, password: string): Promise<void> => {
    const { token, user: u } = await api.auth.register(username, password);
    setToken(token);
    setUser(u);
  };

  const handleLogout = (): void => {
    clearToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login: handleLogin, register: handleRegister, logout: handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
