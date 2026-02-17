// ============================================
// 분석(Analytics) 커스텀 훅
// 페이지 뷰 및 이벤트 트래킹
// ============================================

import { useCallback, useEffect, useRef } from 'react';
import api from '../services/api';

// 세션 ID 생성/조회
function getSessionId(): string {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = `s_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
}

// UTM 파라미터 캡처 (최초 로드 시 URL에서 추출하여 저장)
function captureUtmParams(): void {
  // 이미 캡처했으면 스킵
  if (sessionStorage.getItem('utm_captured')) return;

  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get('utm_source');
  const utmMedium = params.get('utm_medium');
  const utmCampaign = params.get('utm_campaign');

  if (utmSource) sessionStorage.setItem('utm_source', utmSource);
  if (utmMedium) sessionStorage.setItem('utm_medium', utmMedium);
  if (utmCampaign) sessionStorage.setItem('utm_campaign', utmCampaign);

  sessionStorage.setItem('utm_captured', 'true');
}

// 저장된 UTM 파라미터 조회
function getUtmParams() {
  return {
    utm_source: sessionStorage.getItem('utm_source') || undefined,
    utm_medium: sessionStorage.getItem('utm_medium') || undefined,
    utm_campaign: sessionStorage.getItem('utm_campaign') || undefined,
  };
}

export function useAnalytics() {
  const initialized = useRef(false);

  // 최초 마운트 시 UTM 파라미터 캡처
  useEffect(() => {
    if (!initialized.current) {
      captureUtmParams();
      initialized.current = true;
    }
  }, []);

  // 페이지 뷰 트래킹
  const trackPageView = useCallback((path: string) => {
    const sessionId = getSessionId();
    const utm = getUtmParams();

    // 비동기로 전송 (실패해도 무시)
    api.post('/analytics/pageview', {
      path,
      referrer: document.referrer || undefined,
      sessionId,
      ...utm,
    }).catch(() => {
      // 분석 API 실패는 조용히 무시
    });
  }, []);

  // 이벤트 트래킹
  const trackEvent = useCallback((eventType: string, eventData?: Record<string, unknown>) => {
    const sessionId = getSessionId();

    api.post('/analytics/event', {
      eventType,
      eventData: eventData || undefined,
      path: window.location.pathname,
      sessionId,
    }).catch(() => {
      // 분석 API 실패는 조용히 무시
    });
  }, []);

  return { trackPageView, trackEvent };
}
