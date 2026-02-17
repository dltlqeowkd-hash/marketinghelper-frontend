// ============================================
// 분석(Analytics) Provider 컴포넌트
// 라우트 변경 시 자동 페이지 뷰 트래킹
// ============================================

import { ReactNode, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useAnalytics } from '../hooks/useAnalytics';

export default function AnalyticsProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { trackPageView } = useAnalytics();
  const prevPath = useRef<string | null>(null);

  useEffect(() => {
    // 같은 경로로의 재렌더링은 무시
    if (prevPath.current === location.pathname) return;

    prevPath.current = location.pathname;
    trackPageView(location.pathname);
  }, [location.pathname, trackPageView]);

  // DOM 요소를 추가하지 않고 children만 반환
  return <>{children}</>;
}
