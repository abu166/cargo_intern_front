import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { api, clearToken, getToken, setToken } from '../lib/api';

type UserRole = 'operator' | 'corporate' | 'individual' | 'receiver' | 'aggregator';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company?: string;
  depositBalance?: number;
  contractNumber?: string;
  aggregatorType?: 'glovo' | 'choko';
  roles?: string[];
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const resolveRole = (roles: string[], fallback: UserRole): UserRole => {
    if (roles.includes('CORPORATE')) return 'corporate';
    if (roles.includes('INDIVIDUAL')) return 'individual';
    if (roles.includes('RECEIVER')) return 'receiver';
    if (roles.includes('AGGREGATOR')) return 'aggregator';
    if (roles.includes('OPERATOR') || roles.includes('AGENT') || roles.includes('ADMIN')) return 'operator';
    return fallback;
  };

  const login = async (email: string, password: string, role: UserRole) => {
    try {
      const result = await api.authLogin(email, password);
      setToken(result.access_token);
      const me = await api.authMe();
      setUser({
        id: String(me.id),
        name: me.full_name || me.username,
        email,
        role: resolveRole(me.roles, role),
        roles: me.roles,
      });
    } catch (error) {
      clearToken();
      alert('Неверный email или пароль');
    }
  };

  const logout = async () => {
    try {
      await api.authLogout();
    } finally {
      clearToken();
      setUser(null);
    }
  };

  const isAuthenticated = !!user;

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    api.authMe()
      .then((me) => {
        setUser({
          id: String(me.id),
          name: me.full_name || me.username,
          email: me.username,
          role: resolveRole(me.roles, 'operator'),
          roles: me.roles,
        });
      })
      .catch(() => {
        clearToken();
      });
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
