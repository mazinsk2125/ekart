import {
  createContext,
  useCallback,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import { TOKEN_KEY, USER_KEY } from '@/api/client';
import { authApi } from '@/api/authApi';
import type { AuthUser, LoginRequest, RegisterRequest } from '@/types';

// ---------------------------------------------------------------------
// State + reducer
// ---------------------------------------------------------------------
interface AuthState {
  user: AuthUser | null;
  token: string | null;
  status: 'idle' | 'loading' | 'authenticated';
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: AuthUser; token: string } }
  | { type: 'LOGIN_ERROR' }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: AuthUser };

function readStoredUser(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

const initialState: AuthState = {
  user: readStoredUser(),
  token: localStorage.getItem(TOKEN_KEY),
  status: localStorage.getItem(TOKEN_KEY) ? 'authenticated' : 'idle',
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, status: 'loading' };
    case 'LOGIN_SUCCESS':
      return {
        user: action.payload.user,
        token: action.payload.token,
        status: 'authenticated',
      };
    case 'LOGIN_ERROR':
      return { ...state, status: 'idle' };
    case 'UPDATE_USER':
      return { ...state, user: action.payload };
    case 'LOGOUT':
      return { user: null, token: null, status: 'idle' };
    default:
      return state;
  }
}

// ---------------------------------------------------------------------
// Context value
// ---------------------------------------------------------------------
export interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginRequest) => Promise<void>;
  register: (payload: RegisterRequest) => Promise<string>;
  logout: () => void;
  setUser: (user: AuthUser) => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = useCallback(async (payload: LoginRequest) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const res = await authApi.login(payload);
      const user: AuthUser = {
        emailId: res.emailId,
        name: res.name,
        phoneNumber: res.phoneNumber,
        address: res.address,
      };
      localStorage.setItem(TOKEN_KEY, res.token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token: res.token } });
    } catch (err) {
      dispatch({ type: 'LOGIN_ERROR' });
      throw err;
    }
  }, []);

  const register = useCallback((payload: RegisterRequest) => {
    return authApi.register(payload);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    dispatch({ type: 'LOGOUT' });
  }, []);

  const setUser = useCallback((user: AuthUser) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    dispatch({ type: 'UPDATE_USER', payload: user });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: state.user,
      token: state.token,
      isAuthenticated: state.status === 'authenticated',
      isLoading: state.status === 'loading',
      login,
      register,
      logout,
      setUser,
    }),
    [state, login, register, logout, setUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
