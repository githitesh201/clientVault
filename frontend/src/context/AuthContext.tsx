import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { apiRequest } from '../api/http';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login(email: string, password: string): Promise<void>;
  register(name: string, email: string, password: string): Promise<void>;
  logout(): void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function saveSession(token: string, user: User): void {
  localStorage.setItem('clientvault_token', token);
  localStorage.setItem('clientvault_user', JSON.stringify(user));
}

function clearSession(): void {
  localStorage.removeItem('clientvault_token');
  localStorage.removeItem('clientvault_user');
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('clientvault_token'));
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem('clientvault_user');
    return raw ? (JSON.parse(raw) as User) : null;
  });

  async function login(email: string, password: string): Promise<void> {
    const result = await apiRequest<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });

    setToken(result.token);
    setUser(result.user);
    saveSession(result.token, result.user);
  }

  async function register(name: string, email: string, password: string): Promise<void> {
    const result = await apiRequest<{ token: string; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    });

    setToken(result.token);
    setUser(result.user);
    saveSession(result.token, result.user);
  }

  function logout(): void {
    setToken(null);
    setUser(null);
    clearSession();
  }

  const value = useMemo(() => ({ token, user, login, register, logout }), [token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
