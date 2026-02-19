// ============================================
// SEO Doctor - 무료 SEO 진단 도구
// 회원가입 유도용 기능 페이지
// ============================================

import { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

// ─── 타입 정의 ───────────────────────────────

interface SeoCheckItem {
  label: string;
  status: 'pass' | 'warning' | 'fail';
  value: string;
  recommendation?: string;
}

interface SeoCategory {
  name: string;
  score: number;
  maxScore: number;
  status: 'good' | 'warning' | 'error';
  items: SeoCheckItem[];
}

interface SeoResult {
  url: string;
  score: number;
  grade: string;
  analyzedAt: string;
  categories: SeoCategory[];
  summary: {
    passed: number;
    warnings: number;
    errors: number;
  };
}

// 카테고리 이름 → 아이콘 키 매핑
const CATEGORY_ICON_MAP: Record<string, string> = {
  '메타 태그 분석': 'meta',
  '오픈 그래프 태그': 'opengraph',
  '헤딩 구조': 'heading',
  '이미지 최적화': 'image',
  '링크 분석': 'link',
  '기술적 SEO': 'technical',
  '성능 힌트': 'performance',
};

// ─── 헬퍼 함수 ──────────────────────────────

function getGradeInfo(score: number): { grade: string; color: string; bgColor: string; strokeColor: string } {
  if (score >= 90) return { grade: 'A+', color: 'text-emerald-600', bgColor: 'bg-emerald-50', strokeColor: '#059669' };
  if (score >= 80) return { grade: 'A', color: 'text-emerald-500', bgColor: 'bg-emerald-50', strokeColor: '#10b981' };
  if (score >= 70) return { grade: 'B+', color: 'text-lime-600', bgColor: 'bg-lime-50', strokeColor: '#65a30d' };
  if (score >= 60) return { grade: 'B', color: 'text-yellow-500', bgColor: 'bg-yellow-50', strokeColor: '#eab308' };
  if (score >= 50) return { grade: 'C', color: 'text-orange-500', bgColor: 'bg-orange-50', strokeColor: '#f97316' };
  if (score >= 40) return { grade: 'D', color: 'text-red-500', bgColor: 'bg-red-50', strokeColor: '#ef4444' };
  return { grade: 'F', color: 'text-red-600', bgColor: 'bg-red-50', strokeColor: '#dc2626' };
}

function getStatusIcon(status: 'pass' | 'warning' | 'fail') {
  switch (status) {
    case 'pass':
      return (
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex-shrink-0">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
      );
    case 'warning':
      return (
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex-shrink-0">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M12 3l9.5 16.5H2.5L12 3z" />
          </svg>
        </span>
      );
    case 'fail':
      return (
        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600 flex-shrink-0">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </span>
      );
  }
}

function getCategoryIcon(icon: string) {
  const icons: Record<string, JSX.Element> = {
    meta: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
    opengraph: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
    ),
    heading: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h8m-8 6h16" />
      </svg>
    ),
    image: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    link: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
    technical: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    performance: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  };
  return icons[icon] || icons.meta;
}

// ─── SVG 원형 차트 컴포넌트 ──────────────────

function ScoreCircle({ score, size = 200 }: { score: number; size?: number }) {
  const { grade, color, strokeColor } = getGradeInfo(score);
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const center = size / 2;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* 배경 원 */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="12"
        />
        {/* 프로그레스 원 */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-5xl font-bold ${color}`}>{score}</span>
        <span className={`text-xl font-semibold ${color} mt-1`}>{grade}</span>
      </div>
    </div>
  );
}

// ─── 카테고리 미니 점수 바 ───────────────────

function CategoryScoreBar({ score, maxScore }: { score: number; maxScore: number }) {
  const percent = Math.round((score / maxScore) * 100);
  const { strokeColor } = getGradeInfo(percent);

  return (
    <div className="flex items-center gap-2 min-w-[120px]">
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${percent}%`, backgroundColor: strokeColor }}
        />
      </div>
      <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
        {score}/{maxScore}
      </span>
    </div>
  );
}

// ─── 아코디언 카테고리 카드 ──────────────────

function CategoryCard({ category }: { category: SeoCategory }) {
  const [isOpen, setIsOpen] = useState(false);
  const percent = Math.round((category.score / category.maxScore) * 100);
  const { bgColor } = getGradeInfo(percent);

  return (
    <div className={`border border-gray-200 rounded-xl overflow-hidden transition-shadow ${isOpen ? 'shadow-md' : 'shadow-sm hover:shadow-md'}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-5 py-4 flex items-center gap-4 text-left transition-colors ${isOpen ? bgColor : 'bg-white hover:bg-gray-50'}`}
      >
        {/* 카테고리 아이콘 */}
        <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 flex-shrink-0">
          {getCategoryIcon(CATEGORY_ICON_MAP[category.name] || 'meta')}
        </div>

        {/* 카테고리 이름 */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900">{category.name}</h3>
          <div className="mt-1">
            <CategoryScoreBar score={category.score} maxScore={category.maxScore} />
          </div>
        </div>

        {/* 상태 요약 뱃지 */}
        <div className="hidden sm:flex items-center gap-1.5 flex-shrink-0">
          {category.items.filter(i => i.status === 'pass').length > 0 && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              {category.items.filter(i => i.status === 'pass').length}
            </span>
          )}
          {category.items.filter(i => i.status === 'warning').length > 0 && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01" />
              </svg>
              {category.items.filter(i => i.status === 'warning').length}
            </span>
          )}
          {category.items.filter(i => i.status === 'fail').length > 0 && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-red-700 bg-red-100 px-2 py-0.5 rounded-full">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              {category.items.filter(i => i.status === 'fail').length}
            </span>
          )}
        </div>

        {/* 열림/닫힘 화살표 */}
        <svg
          className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* 상세 내용 */}
      {isOpen && (
        <div className="px-5 py-4 bg-white border-t border-gray-100 space-y-3">
          {category.items.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 py-2">
              {getStatusIcon(item.status)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium text-gray-900 text-sm">{item.label}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                    item.status === 'pass' ? 'bg-emerald-50 text-emerald-700' :
                    item.status === 'warning' ? 'bg-amber-50 text-amber-700' :
                    'bg-red-50 text-red-700'
                  }`}>
                    {item.status === 'pass' ? 'PASS' : item.status === 'warning' ? 'WARNING' : 'FAIL'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{item.value}</p>
                {item.recommendation && (
                  <p className="text-sm text-blue-600 mt-1 flex items-start gap-1">
                    <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    <span>{item.recommendation}</span>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── 로그인 유도 모달 ────────────────────────

function AuthModal({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 오버레이 */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* 모달 본체 */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-fadeIn">
        {/* 닫기 버튼 */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* 아이콘 */}
        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-blue-100 flex items-center justify-center">
          <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>

        {/* 텍스트 */}
        <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
          SEO Doctor는 회원 전용 무료 서비스입니다
        </h3>
        <p className="text-gray-500 text-center text-sm mb-8 leading-relaxed">
          지금 가입하면 무제한 SEO 진단을 이용할 수 있습니다.<br />
          가입은 무료이며 30초면 완료됩니다.
        </p>

        {/* 버튼 */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/register')}
            className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25"
          >
            무료 가입하기
          </button>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
          >
            로그인
          </button>
        </div>

        {/* 보조 텍스트 */}
        <p className="text-xs text-gray-400 text-center mt-4">
          가입 시 <Link to="/terms" className="underline hover:text-gray-600">이용약관</Link> 및{' '}
          <Link to="/privacy" className="underline hover:text-gray-600">개인정보처리방침</Link>에 동의합니다.
        </p>
      </div>
    </div>
  );
}

// ─── 로딩 상태 컴포넌트 ──────────────────────

function AnalyzingLoader() {
  const steps = [
    '페이지를 불러오는 중...',
    '메타 태그를 분석하는 중...',
    '오픈 그래프 태그를 확인하는 중...',
    '헤딩 구조를 검사하는 중...',
    '이미지 최적화 상태를 확인하는 중...',
    '링크를 분석하는 중...',
    '기술적 SEO 요소를 점검하는 중...',
    '성능을 평가하는 중...',
    '리포트를 생성하는 중...',
  ];

  const [stepIndex, setStepIndex] = useState(0);

  // 단계별 메시지 전환
  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex(prev => {
        if (prev < steps.length - 1) return prev + 1;
        return prev;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [steps.length]);

  const progressPercent = Math.min(((stepIndex + 1) / steps.length) * 100, 95);

  return (
    <div className="max-w-lg mx-auto text-center py-16">
      {/* 회전 아이콘 */}
      <div className="w-20 h-20 mx-auto mb-8 relative">
        <div className="absolute inset-0 rounded-full border-4 border-gray-200" />
        <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-2">페이지를 분석하고 있습니다...</h3>
      <p className="text-gray-500 text-sm mb-8">{steps[stepIndex]}</p>

      {/* 프로그레스 바 */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <p className="text-xs text-gray-400">예상 소요시간: 10~20초</p>
    </div>
  );
}

// ─── 메인 SEO Doctor 컴포넌트 ────────────────

export default function SeoDoctor() {
  const { isAuthenticated } = useAuth();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SeoResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // URL 유효성 검사
  const isValidUrl = useCallback((input: string): boolean => {
    try {
      const u = new URL(input.startsWith('http') ? input : `https://${input}`);
      return !!u.hostname && u.hostname.includes('.');
    } catch {
      return false;
    }
  }, []);

  // URL 정규화
  const normalizeUrl = useCallback((input: string): string => {
    if (!input.startsWith('http://') && !input.startsWith('https://')) {
      return `https://${input}`;
    }
    return input;
  }, []);

  // 진단 실행
  const handleAnalyze = useCallback(async () => {
    if (!url.trim()) return;

    // URL 유효성 체크
    if (!isValidUrl(url)) {
      setError('올바른 URL을 입력해주세요. (예: https://example.com)');
      return;
    }

    // 비로그인 상태 → 모달 표시
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    setError(null);
    setResult(null);
    setIsLoading(true);

    try {
      const normalizedUrl = normalizeUrl(url);
      const response = await api.post('/seo/analyze', { url: normalizedUrl });
      setResult(response.data);
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string; error?: string } } };
      const message = axiosError.response?.data?.message
        || axiosError.response?.data?.error
        || 'SEO 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [url, isAuthenticated, isValidUrl, normalizeUrl]);

  // Enter 키로 진단
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAnalyze();
    }
  }, [handleAnalyze]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ───── 네비게이션 ───── */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-xl font-bold text-primary-600">
              마케팅헬퍼
            </Link>
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="px-5 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                >
                  대시보드
                </Link>
              ) : (
                <>
                  <Link to="/login" className="px-4 py-2 text-gray-600 hover:text-gray-900 text-sm">
                    로그인
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                  >
                    무료 시작
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ───── 헤더 섹션 ───── */}
      <header className="bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 text-white relative overflow-hidden">
        {/* 배경 장식 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 py-16 sm:py-24 text-center">
          {/* 아이콘 */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
            <svg className="w-10 h-10 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <svg className="w-6 h-6 text-emerald-300 -ml-2 mt-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 tracking-tight">
            SEO <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Doctor</span>
          </h1>
          <p className="text-lg sm:text-xl text-blue-200 mb-10 max-w-2xl mx-auto leading-relaxed">
            무료 SEO 진단으로 웹사이트 건강을 체크하세요.<br className="hidden sm:block" />
            메타 태그, 오픈 그래프, 헤딩 구조, 이미지 최적화까지 한 번에 분석합니다.
          </p>

          {/* URL 입력 폼 */}
          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="분석할 웹사이트 URL을 입력하세요 (예: example.com)"
                  className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 bg-white text-base shadow-lg shadow-black/10 border-2 border-transparent focus:border-blue-400 focus:outline-none placeholder:text-gray-400"
                  disabled={isLoading}
                />
              </div>
              <button
                onClick={handleAnalyze}
                disabled={isLoading || !url.trim()}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-xl hover:from-blue-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-500/30 whitespace-nowrap text-base"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2 justify-center">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    분석 중...
                  </span>
                ) : (
                  <span className="flex items-center gap-2 justify-center">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    진단 시작
                  </span>
                )}
              </button>
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="mt-4 flex items-center gap-2 text-red-300 bg-red-900/30 px-4 py-3 rounded-xl text-sm">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* 무료 뱃지 */}
          <div className="mt-6 flex items-center justify-center gap-4 text-sm text-blue-300/80">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              100% 무료
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              즉시 결과
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              상세 리포트
            </span>
          </div>
        </div>
      </header>

      {/* ───── 본문 영역 ───── */}
      <main className="max-w-4xl mx-auto px-4 py-12">

        {/* 로딩 상태 */}
        {isLoading && <AnalyzingLoader />}

        {/* 결과 표시 */}
        {result && !isLoading && (
          <div className="space-y-8">
            {/* 분석 대상 URL */}
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">분석 결과</p>
              <p className="text-lg font-medium text-gray-900 break-all">{result.url}</p>
            </div>

            {/* 총점 원형 차트 */}
            <div className="flex justify-center py-4">
              <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-12 inline-block">
                <ScoreCircle score={result.score} size={220} />
                <p className="text-center text-gray-500 mt-4 text-sm">종합 SEO 점수</p>
              </div>
            </div>

            {/* 요약 바 */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm font-medium text-emerald-700">통과</span>
                </div>
                <span className="text-3xl font-bold text-emerald-600">{result.summary.passed}</span>
                <span className="text-sm text-emerald-500 ml-1">개</span>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01" />
                  </svg>
                  <span className="text-sm font-medium text-amber-700">주의</span>
                </div>
                <span className="text-3xl font-bold text-amber-600">{result.summary.warnings}</span>
                <span className="text-sm text-amber-500 ml-1">개</span>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-sm font-medium text-red-700">오류</span>
                </div>
                <span className="text-3xl font-bold text-red-600">{result.summary.errors}</span>
                <span className="text-sm text-red-500 ml-1">개</span>
              </div>
            </div>

            {/* 카테고리별 상세 */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">상세 분석 결과</h2>
              <div className="space-y-3">
                {result.categories.map((category, idx) => (
                  <CategoryCard key={idx} category={category} />
                ))}
              </div>
            </div>

            {/* CTA 섹션 */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-8 sm:p-10 text-center text-white mt-12">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                SEO 점수를 개선하고 싶으신가요?
              </h2>
              <p className="text-blue-200 mb-8 max-w-xl mx-auto leading-relaxed">
                마케팅헬퍼로 네이버 쇼핑/블로그 상위노출을 자동화하세요.
                AI 기반 콘텐츠 최적화와 실시간 순위 추적으로 매출을 극대화할 수 있습니다.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to="/#pricing"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = '/#pricing';
                  }}
                  className="px-8 py-3.5 bg-white text-blue-700 font-bold rounded-xl hover:bg-blue-50 transition-colors shadow-lg shadow-black/10 w-full sm:w-auto"
                >
                  요금제 보기
                </Link>
                <Link
                  to="/register"
                  className="px-8 py-3.5 bg-white/15 backdrop-blur-sm text-white font-bold rounded-xl hover:bg-white/25 transition-colors border border-white/30 w-full sm:w-auto"
                >
                  무료 체험하기
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* 결과도 로딩도 아닌 초기 상태: 기능 소개 */}
        {!result && !isLoading && (
          <div className="space-y-16">
            {/* 분석 항목 소개 */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">어떤 항목을 분석하나요?</h2>
              <p className="text-gray-500 text-center mb-10 max-w-lg mx-auto">
                SEO Doctor는 웹페이지의 7가지 핵심 영역을 종합적으로 분석합니다.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[
                  {
                    icon: 'meta',
                    title: '메타 태그 분석',
                    desc: 'Title, Description, Charset, Viewport 등 핵심 메타 태그 검사',
                  },
                  {
                    icon: 'opengraph',
                    title: '오픈 그래프 태그',
                    desc: 'og:title, og:description, og:image 등 소셜 공유 최적화 검사',
                  },
                  {
                    icon: 'heading',
                    title: '헤딩 구조',
                    desc: 'H1~H6 태그의 계층 구조와 적절한 사용 여부 분석',
                  },
                  {
                    icon: 'image',
                    title: '이미지 최적화',
                    desc: 'alt 텍스트, 이미지 크기, 포맷 최적화 상태 검사',
                  },
                  {
                    icon: 'link',
                    title: '링크 분석',
                    desc: '내부/외부 링크, nofollow 속성, 깨진 링크 여부 확인',
                  },
                  {
                    icon: 'technical',
                    title: '기술적 SEO',
                    desc: 'robots.txt, sitemap, canonical URL, HTTPS 등 기술 요소 점검',
                  },
                  {
                    icon: 'performance',
                    title: '성능 힌트',
                    desc: '페이지 크기, 리소스 수, 렌더링 차단 요소 등 성능 지표 분석',
                  },
                ].map((item) => (
                  <div
                    key={item.icon}
                    className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-4">
                      {getCategoryIcon(item.icon)}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 사용 방법 */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-10">
              <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">사용 방법</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                {[
                  {
                    step: '01',
                    title: 'URL 입력',
                    desc: '분석하고 싶은 웹페이지의 URL을 입력합니다.',
                  },
                  {
                    step: '02',
                    title: 'SEO 분석',
                    desc: '7가지 핵심 영역을 자동으로 분석합니다.',
                  },
                  {
                    step: '03',
                    title: '리포트 확인',
                    desc: '점수와 개선 권장사항을 확인하고 적용합니다.',
                  },
                ].map((item) => (
                  <div key={item.step} className="text-center">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white flex items-center justify-center text-lg font-bold shadow-lg shadow-blue-500/20">
                      {item.step}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 하단 CTA */}
            <div className="text-center pb-8">
              <p className="text-gray-500 mb-4">
                더 강력한 SEO 도구가 필요하신가요?
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/home"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25"
                >
                  마케팅헬퍼 둘러보기
                </Link>
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="px-6 py-3 text-gray-600 font-medium hover:text-gray-900 transition-colors"
                >
                  맨 위로 돌아가기
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ───── 푸터 (사업자정보 포함) ───── */}
      <footer className="bg-gray-900 text-gray-400 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-8 mb-8">
            <div>
              <Link to="/" className="text-white font-bold text-lg">마케팅헬퍼</Link>
              <p className="text-sm mt-2">네이버 마케팅 자동화 솔루션</p>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <Link to="/home" className="hover:text-white transition-colors">홈</Link>
              <Link to="/terms" className="hover:text-white transition-colors">이용약관</Link>
              <Link to="/privacy" className="hover:text-white transition-colors">개인정보처리방침</Link>
              <Link to="/refund" className="hover:text-white transition-colors">환불정책</Link>
              <Link to="/guide" className="hover:text-white transition-colors">사용 가이드</Link>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 mb-6">
            <div className="text-xs text-gray-500 space-y-1">
              <p>상호명: 세리오(Serio) | 서비스명: 마케팅헬퍼</p>
              <p>대표: 최영호</p>
              <p>사업자등록번호: 863-17-01349</p>
              <p>주소: 경기도 성남시 중원구 갈마치로288번길 14, 2층 225-2호(상대원동, 성남SK V1 tower)</p>
              <p>통신판매업신고: 제 2021-경기광주-0383 호</p>
              <p>전화: 010-8563-5815 | 문의: dltlqeowkd@gmail.com</p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-sm">
            <p>&copy; 2020 세리오(Serio). All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* ───── 로그인 유도 모달 ───── */}
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}

      {/* ───── 애니메이션 CSS ───── */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
