import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../utils/api';

interface User {
  _id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));

      // Validate the stored JWT against the backend; clear session if invalid/expired
      authAPI.getMe()
        .then((me: User) => {
          if (me && me._id) {
            const fresh = { _id: me._id, name: me.name, email: me.email };
            setUser(fresh);
            localStorage.setItem('user', JSON.stringify(fresh));
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        });
    }
  }, []);

  const login = async (email: string, password: string) => {
    const data = await authAPI.login(email, password);
    setToken(data.token);
    setUser({ _id: data._id, name: data.name, email: data.email });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({ _id: data._id, name: data.name, email: data.email }));
  };

  const register = async (name: string, email: string, password: string) => {
    const data = await authAPI.register(name, email, password);
    setToken(data.token);
    setUser({ _id: data._id, name: data.name, email: data.email });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify({ _id: data._id, name: data.name, email: data.email }));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}