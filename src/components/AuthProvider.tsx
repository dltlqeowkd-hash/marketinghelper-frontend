// ============================================
// 인증 상태 Provider 컴포넌트
// ============================================

import { ReactNode } from 'react';
import { AuthContext, useAuthProvider } from '../hooks/useAuth';

export default function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuthProvider();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}
