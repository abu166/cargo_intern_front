import { createContext, useContext, useState, ReactNode } from 'react';

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
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string, password: string, role: UserRole) => {
    console.log('Auth login called:', email, role);
    void password;
    
    // Mock authentication - в реальной системе здесь будет API вызов
    const mockUsers: Record<string, User> = {
      'operator@mail.kz': {
        id: '1',
        name: 'Айдана Сериковна',
        email: 'operator@mail.kz',
        role: 'operator'
      },
      'corporate@mail.kz': {
        id: '2',
        name: 'ТОО "Логистика Плюс"',
        email: 'corporate@mail.kz',
        role: 'corporate',
        company: 'ТОО "Логистика Плюс"',
        depositBalance: 150000,
        contractNumber: 'КТ-2024-001'
      },
      'user@mail.kz': {
        id: '3',
        name: 'Нұрболат Әлібек',
        email: 'user@mail.kz',
        role: 'individual'
      },
      'receiver@mail.kz': {
        id: '4',
        name: 'Серік Даулет',
        email: 'receiver@mail.kz',
        role: 'receiver'
      },
      'glovo@mail.kz': {
        id: '5',
        name: 'Glovo Kazakhstan',
        email: 'glovo@mail.kz',
        role: 'aggregator',
        aggregatorType: 'glovo',
        company: 'Glovo'
      },
      'choko@mail.kz': {
        id: '6',
        name: 'Choko Delivery',
        email: 'choko@mail.kz',
        role: 'aggregator',
        aggregatorType: 'choko',
        company: 'Choko'
      }
    };

    const foundUser = mockUsers[email];
    if (foundUser) {
      console.log('User found:', foundUser);
      setUser(foundUser);
    } else {
      console.log('User not found for email:', email);
      alert('Неверный email или пароль');
    }
  };

  const logout = () => {
    console.log('Logging out');
    setUser(null);
  };

  const isAuthenticated = !!user;
  
  console.log('Auth context state:', { user, isAuthenticated });

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
