// ============================================
// OAuth 콜백 페이지
// 소셜 로그인 후 토큰을 받아 처리
// ============================================

import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function OAuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { refreshUser } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      // 토큰 저장 후 사용자 정보 로드
      localStorage.setItem('accessToken', token);
      refreshUser().then(() => {
        navigate('/dashboard', { replace: true });
      });
    } else {
      navigate('/login?error=oauth_failed', { replace: true });
    }
  }, [searchParams, navigate, refreshUser]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
        <p className="text-gray-500">로그인 처리 중...</p>
      </div>
    </div>
  );
}
