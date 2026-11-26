import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { ApiError, authAPI, type AuthUser } from '../utils/api';

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const USER_KEY = 'credwise-user';
const LEGACY_KEYS = ['token', 'user'];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<AuthUser>;
    if (!parsed._id || !parsed.email) return null;
    return {
      _id: String(parsed._id),
      name: String(parsed.name || ''),
      email: String(parsed.email),
    };
  } catch {
    localStorage.removeItem(USER_KEY);
    return null;
  }
}

function storeUser(user: AuthUser | null) {
  try {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  } catch {
    // Storage can be unavailable in private browsing; the in-memory session still works.
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const epoch = useRef(0);

  const clearSession = useCallback(() => {
    epoch.current += 1;
    setUser(null);
    setIsLoading(false);
    storeUser(null);
  }, []);

  useEffect(() => {
    LEGACY_KEYS.forEach((key) => {
      try {
        localStorage.removeItem(key);
      } catch {
        // Ignore storage failures.
      }
    });

    const onUnauthorized = () => clearSession();
    window.addEventListener('credwise:unauthorized', onUnauthorized);

    const stored = readStoredUser();
    if (!stored) {
      setIsLoading(false);
      return () => window.removeEventListener('credwise:unauthorized', onUnauthorized);
    }

    const startEpoch = epoch.current;
    setUser(stored);

    let active = true;
    authAPI
      .getMe()
      .then((me) => {
        if (!active || epoch.current !== startEpoch) return;
        const fresh = { _id: me._id, name: me.name, email: me.email };
        setUser(fresh);
        storeUser(fresh);
      })
      .catch((error) => {
        if (!active || epoch.current !== startEpoch) return;
        if (error instanceof ApiError && (error.status === 401 || error.status === 403)) {
          clearSession();
        } else {
          // Keep the cached identity when the API is temporarily unreachable.
          setIsLoading(false);
        }
      })
      .finally(() => {
        if (active && epoch.current === startEpoch) setIsLoading(false);
      });

    return () => {
      active = false;
      window.removeEventListener('credwise:unauthorized', onUnauthorized);
    };
  }, [clearSession]);

  const login = async (email: string, password: string) => {
    epoch.current += 1;
    const data = await authAPI.login(email, password);
    const nextUser = { _id: data._id, name: data.name, email: data.email };
    setUser(nextUser);
    setIsLoading(false);
    storeUser(nextUser);
  };

  const register = async (name: string, email: string, password: string) => {
    epoch.current += 1;
    const data = await authAPI.register(name, email, password);
    const nextUser = { _id: data._id, name: data.name, email: data.email };
    setUser(nextUser);
    setIsLoading(false);
    storeUser(nextUser);
  };

  const logout = async () => {
    clearSession();
    try {
      await authAPI.logout();
    } catch {
      // Local state is already cleared; a failed network call should not keep the user signed in.
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, register, logout, isAuthenticated: !!user }}
    >
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
