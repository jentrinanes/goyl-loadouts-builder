import { createContext, useContext, useState, type ReactNode } from 'react';
import { getSession, login, logout, register } from '../store/authStore';
import type { User, AuthContextValue } from '../types';

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => getSession());

  const handleLogin = (username: string, password: string): User => {
    const session = login(username, password);
    setUser(session);
    return session;
  };

  const handleRegister = (username: string, password: string): User => {
    const session = register(username, password);
    setUser(session);
    return session;
  };

  const handleLogout = (): void => {
    logout();
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
