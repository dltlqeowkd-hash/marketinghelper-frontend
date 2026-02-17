// ============================================
// 인증 상태 관리 훅
// ============================================

import { useState, useEffect, useCallback, createContext, useContext } from 'react';
import {
  User,
  loginUser,
  logoutUser,
  getMe,
  registerUser,
} from '../services/auth.service';

// 인증 컨텍스트 타입
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; name: string; phone?: string; referralCode?: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// 컨텍스트 생성
const AuthContext = createContext<AuthContextType | null>(null);

// Provider에서 사용할 훅 (내부용)
export function useAuthProvider(): AuthContextType {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 초기 로드: 토큰이 있으면 사용자 정보 조회
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      getMe()
        .then(setUser)
        .catch(() => {
          localStorage.removeItem('accessToken');
          setUser(null);
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  // 로그인
  const login = useCallback(async (email: string, password: string) => {
    const response = await loginUser({ email, password });
    setUser(response.user);
  }, []);

  // 회원가입
  const register = useCallback(async (data: { email: string; password: string; name: string; phone?: string; referralCode?: string }) => {
    await registerUser(data);
  }, []);

  // 로그아웃
  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
  }, []);

  // 사용자 정보 새로고침
  const refreshUser = useCallback(async () => {
    try {
      const userData = await getMe();
      setUser(userData);
    } catch {
      setUser(null);
    }
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
  };
}

// Context exports
export { AuthContext };

// 컴포넌트에서 사용하는 훅
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.');
  }
  return context;
}
