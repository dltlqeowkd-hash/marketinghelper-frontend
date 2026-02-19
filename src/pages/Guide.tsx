// ============================================
// 사용 가이드 페이지
// ============================================

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FAQ } from '../constants/content';
import { PLAN_LIST, FREE_TRIAL, formatKrw } from '../constants/plans';
import SEO from '../components/SEO';
import { PAGE_SEO, generateBreadcrumbSchema } from '../constants/seo';

// 사이드바 네비게이션 항목
const SECTIONS = [
  { id: 'getting-started', label: '시작하기', icon: '🚀' },
  { id: 'installation', label: '프로그램 설치', icon: '💻' },
  { id: 'keywords', label: '키워드 설정', icon: '🔑' },
  { id: 'shopping', label: '쇼핑 자동화', icon: '🛒' },
  { id: 'competitor', label: '경쟁사 분석 & 스케줄링', icon: '📊' },
  { id: 'dashboard', label: '대시보드 사용법', icon: '📊' },
  { id: 'plans', label: '요금제 안내', icon: '💰' },
  { id: 'faq', label: '자주 묻는 질문', icon: '❓' },
  { id: 'contact', label: '문의하기', icon: '📧' },
];

// FAQ 아코디언 아이템
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-4 flex items-center justify-between text-left bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <span className="font-medium text-gray-900 pr-4">{question}</span>
        <svg
          className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-5 py-4 text-gray-600 leading-relaxed bg-white">
          {answer}
        </div>
      )}
    </div>
  );
}

export default function Guide() {
  const [activeSection, setActiveSection] = useState('getting-started');

  // 스크롤 시 활성 섹션 감지
  useEffect(() => {
    function handleScroll() {
      const scrollPosition = window.scrollY + 120;

      for (let i = SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTIONS[i].id);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(SECTIONS[i].id);
          break;
        }
      }
    }

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 사이드바 앵커 클릭
  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(id);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <SEO
        {...PAGE_SEO['/guide']}
        jsonLd={generateBreadcrumbSchema([
          { name: '홈', url: 'https://marketinghelper.co.kr/' },
          { name: '사용 가이드', url: 'https://marketinghelper.co.kr/guide' }
        ])}
      />
      {/* 상단 헤더 */}
      <header className="bg-gray-900 text-white py-12">
        <div className="max-w-5xl mx-auto px-4">
          <Link to="/" className="text-sm text-gray-400 hover:text-white transition-colors mb-4 inline-block">
            &larr; 홈으로 돌아가기
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">사용 가이드</h1>
          <p className="text-gray-400 text-lg">
            마케팅헬퍼의 모든 기능을 빠르게 익혀보세요. 가입부터 자동화 설정까지 단계별로 안내합니다.
          </p>
        </div>
      </header>

      {/* 본문 컨테이너 */}
      <div className="max-w-5xl mx-auto px-4 py-10 flex gap-10">
        {/* 사이드바 네비게이션 */}
        <aside className="hidden lg:block w-[220px] flex-shrink-0">
          <nav className="sticky top-24">
            <ul className="space-y-1">
              {SECTIONS.map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => scrollToSection(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-50 text-blue-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className="mr-2">{section.icon}</span>
                    {section.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* 콘텐츠 영역 */}
        <main className="flex-1 min-w-0">
          {/* ===== 1. 시작하기 ===== */}
          <section id="getting-started" className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              시작하기
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              마케팅헬퍼를 처음 사용하시나요? 아래 단계를 따라 빠르게 시작해보세요.
              회원가입부터 구독 결제까지 간단한 3단계면 됩니다.
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mb-4">회원가입</h3>
            <ol className="list-decimal ml-6 space-y-3 text-gray-600 mb-8">
              <li>
                <Link to="/register" className="text-blue-600 hover:underline font-medium">회원가입 페이지</Link>에
                접속합니다.
              </li>
              <li>이메일, 이름, 비밀번호를 입력합니다. 구글 또는 네이버 계정으로 간편 가입도 가능합니다.</li>
              <li>추천인 코드가 있다면 입력란에 입력하세요. 추천인과 함께 혜택을 받을 수 있습니다.</li>
              <li>가입 완료 후 이메일 인증 링크를 클릭하여 계정을 활성화합니다.</li>
            </ol>

            <h3 className="text-lg font-semibold text-gray-800 mb-4">로그인</h3>
            <ol className="list-decimal ml-6 space-y-3 text-gray-600 mb-8">
              <li>
                <Link to="/login" className="text-blue-600 hover:underline font-medium">로그인 페이지</Link>에서
                이메일과 비밀번호를 입력합니다.
              </li>
              <li>구글/네이버 소셜 로그인을 이용할 수도 있습니다.</li>
              <li>로그인 후 대시보드로 자동 이동됩니다.</li>
            </ol>

            <h3 className="text-lg font-semibold text-gray-800 mb-4">구독 결제</h3>
            <ol className="list-decimal ml-6 space-y-3 text-gray-600 mb-8">
              <li>대시보드에서 "구독 관리" 메뉴로 이동하거나, 요금제 페이지에서 원하는 플랜을 선택합니다.</li>
              <li>결제 수단을 선택합니다. 토스페이먼츠(카드), PayPal, 계좌이체를 지원합니다.</li>
              <li>결제가 완료되면 라이선스 키가 자동 발급됩니다.</li>
              <li>발급된 라이선스 키를 프로그램에 입력하면 즉시 사용 가능합니다.</li>
            </ol>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
              <p className="text-blue-800 font-medium mb-1">무료 체험</p>
              <p className="text-blue-600 text-sm">
                결제 전에 {FREE_TRIAL.duration} 동안 무료로 체험할 수 있습니다.
                카드 등록 없이 회원가입만 하면 키워드 {FREE_TRIAL.keywords}개로 {FREE_TRIAL.features}이 가능합니다.
              </p>
            </div>
          </section>

          {/* ===== 2. 프로그램 설치 ===== */}
          <section id="installation" className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              프로그램 설치
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              마케팅헬퍼는 Windows 전용 데스크톱 프로그램입니다.
              아래 절차에 따라 설치하고 라이선스를 활성화하세요.
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mb-4">다운로드 및 설치</h3>
            <ol className="list-decimal ml-6 space-y-3 text-gray-600 mb-8">
              <li>로그인 후 대시보드에서 "프로그램 다운로드" 버튼을 클릭합니다.</li>
              <li>다운로드된 설치 파일(MarketingHelper_Setup.exe)을 실행합니다.</li>
              <li>설치 마법사의 안내에 따라 설치를 진행합니다. 기본 경로를 권장합니다.</li>
              <li>설치가 완료되면 바탕화면에 마케팅헬퍼 아이콘이 생성됩니다.</li>
            </ol>

            <h3 className="text-lg font-semibold text-gray-800 mb-4">시리얼 키 활성화</h3>
            <ol className="list-decimal ml-6 space-y-3 text-gray-600 mb-8">
              <li>마케팅헬퍼 프로그램을 실행합니다.</li>
              <li>최초 실행 시 라이선스 입력 화면이 나타납니다.</li>
              <li>대시보드의 "라이선스 관리" 메뉴에서 라이선스 키를 복사합니다.</li>
              <li>복사한 키를 프로그램에 붙여넣기 하고 "활성화" 버튼을 클릭합니다.</li>
              <li>인터넷 연결 상태에서 인증이 완료되면 모든 기능을 사용할 수 있습니다.</li>
            </ol>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <p className="text-amber-800 font-medium mb-1">시스템 요구사항</p>
              <ul className="text-amber-700 text-sm space-y-1 mt-2">
                <li>- 운영체제: Windows 10 이상 (64비트)</li>
                <li>- 메모리: 4GB RAM 이상 권장</li>
                <li>- 저장공간: 500MB 이상 여유 공간</li>
                <li>- 네트워크: 안정적인 인터넷 연결 필수</li>
              </ul>
            </div>
          </section>

          {/* ===== 3. 키워드 설정 ===== */}
          <section id="keywords" className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              키워드 설정
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              키워드는 마케팅헬퍼의 핵심입니다. 추적하고 싶은 검색 키워드를 등록하면
              네이버 쇼핑에서의 상품 순위를 실시간으로 모니터링할 수 있습니다.
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mb-4">키워드 추가 방법</h3>
            <ol className="list-decimal ml-6 space-y-3 text-gray-600 mb-8">
              <li>프로그램 메인 화면에서 "키워드 관리" 탭을 클릭합니다.</li>
              <li>"키워드 추가" 버튼을 클릭하고 추적할 키워드를 입력합니다.</li>
              <li>추적 대상 상품(내 스토어 상품)을 선택합니다.</li>
              <li>추적 주기를 설정합니다 (30분, 1시간, 2시간, 4시간 등).</li>
              <li>"저장" 버튼을 클릭하면 즉시 순위 추적이 시작됩니다.</li>
            </ol>

            <h3 className="text-lg font-semibold text-gray-800 mb-4">키워드 최적화 팁</h3>
            <ul className="space-y-3 text-gray-600 mb-6">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>검색량이 높은 메인 키워드와 세부 키워드를 함께 등록하세요.</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>경쟁사의 순위 변동도 함께 추적하면 전략 수립에 도움이 됩니다.</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>시즌별, 이벤트별 키워드를 미리 등록해두면 즉시 대응할 수 있습니다.</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>순위 변동 알림을 설정하면 순위가 떨어졌을 때 즉시 알림을 받습니다.</span>
              </li>
            </ul>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <p className="text-gray-800 font-medium mb-2">요금제별 키워드 수</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div className="bg-white rounded-lg p-3 text-center border border-gray-100">
                  <p className="font-bold text-gray-900">Light</p>
                  <p className="text-gray-500">5개</p>
                </div>
                <div className="bg-white rounded-lg p-3 text-center border border-gray-100">
                  <p className="font-bold text-gray-900">Premium</p>
                  <p className="text-gray-500">20개</p>
                </div>
                <div className="bg-white rounded-lg p-3 text-center border border-gray-100">
                  <p className="font-bold text-gray-900">VIP</p>
                  <p className="text-gray-500">50개</p>
                </div>
                <div className="bg-white rounded-lg p-3 text-center border border-gray-100">
                  <p className="font-bold text-gray-900">VIP Pro</p>
                  <p className="text-gray-500">무제한</p>
                </div>
              </div>
            </div>
          </section>

          {/* ===== 4. 쇼핑 자동화 ===== */}
          <section id="shopping" className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              쇼핑 자동화
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              네이버 쇼핑 순위 추적과 자동화 기능으로 매출을 극대화하세요.
              모든 요금제에서 기본으로 제공됩니다.
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mb-4">실시간 순위 추적</h3>
            <ol className="list-decimal ml-6 space-y-3 text-gray-600 mb-8">
              <li>등록한 키워드에 대해 네이버 쇼핑에서 내 상품의 순위를 자동으로 추적합니다.</li>
              <li>순위 변동 그래프를 통해 시간대별, 일별, 주별 추이를 확인할 수 있습니다.</li>
              <li>순위 변동 알림 설정으로 즉시 대응이 가능합니다.</li>
              <li>경쟁 상품의 순위도 함께 모니터링할 수 있습니다.</li>
            </ol>

            <h3 className="text-lg font-semibold text-gray-800 mb-4">쇼핑 자동화 기능</h3>
            <ul className="space-y-3 text-gray-600 mb-6">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <div>
                  <strong className="text-gray-800">순위 분석 리포트</strong>
                  <p className="text-sm mt-1">키워드별 순위 변동 추이를 분석하고 리포트를 자동 생성합니다.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <div>
                  <strong className="text-gray-800">순위 변동 알림</strong>
                  <p className="text-sm mt-1">설정한 순위 범위를 벗어나면 즉시 알림을 발송합니다.</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <div>
                  <strong className="text-gray-800">다계정 관리</strong>
                  <p className="text-sm mt-1">여러 스토어의 상품을 하나의 화면에서 통합 관리합니다.</p>
                </div>
              </li>
            </ul>
          </section>

          {/* ===== 5. 경쟁사 분석 & 자동 스케줄링 ===== */}
          <section id="competitor" className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              경쟁사 분석 & 자동 스케줄링
            </h2>
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-6">
              <p className="text-purple-700 text-sm font-medium">
                Premium 이상 요금제에서 사용 가능한 기능입니다.
              </p>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              경쟁 상품의 순위 변동을 실시간으로 추적하고, 모든 마케팅 작업을 자동 스케줄링으로 관리합니다.
              경쟁사 키워드 전략을 파악하여 효율적인 마케팅 전략을 수립하세요.
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mb-4">경쟁사 순위 분석</h3>
            <ol className="list-decimal ml-6 space-y-3 text-gray-600 mb-8">
              <li>프로그램에서 "경쟁사 분석" 탭으로 이동합니다.</li>
              <li>추적할 경쟁 상품 URL 또는 키워드를 등록합니다.</li>
              <li>내 상품과 경쟁사의 순위 변동을 비교 차트로 확인합니다.</li>
              <li>순위 역전 시 알림을 받아 즉시 대응할 수 있습니다.</li>
            </ol>

            <h3 className="text-lg font-semibold text-gray-800 mb-4">자동 스케줄링 (VIP 이상)</h3>
            <ul className="space-y-3 text-gray-600 mb-6">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>순위 추적, 키워드 분석을 원하는 시간에 자동 실행</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>24시간 무중단 데이터 수집으로 정확한 트렌드 파악</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>일별/주별/월별 성과 리포트 자동 생성</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span>스케줄별 작업 로그 확인 및 실패 시 자동 재시도</span>
              </li>
            </ul>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
              <p className="text-amber-800 font-medium mb-1">IP 분산 기능 (VIP 이상)</p>
              <p className="text-amber-700 text-sm">
                VIP/VIP Pro 요금제에서는 프록시/IP 분산 기능이 포함됩니다.
                안전한 자동화 운영을 위해 여러 IP를 통해 작업을 분산 처리하여
                네이버의 정책을 준수하면서 효율적인 마케팅을 진행할 수 있습니다.
              </p>
            </div>
          </section>

          {/* ===== 6. 대시보드 사용법 ===== */}
          <section id="dashboard" className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              대시보드 사용법
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              웹 대시보드에서 계정 관리, 구독 현황, 라이선스, 결제 내역을 한눈에 확인할 수 있습니다.
            </p>

            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">구독 관리</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>- 현재 구독 플랜 확인 및 변경</li>
                  <li>- 다음 결제일 확인</li>
                  <li>- 플랜 업그레이드/다운그레이드</li>
                  <li>- 구독 취소 및 재구독</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">라이선스 관리</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>- 라이선스 키 확인 및 복사</li>
                  <li>- 라이선스 상태 확인 (활성/만료/정지)</li>
                  <li>- 등록된 기기 정보 확인</li>
                  <li>- 기기 변경 요청</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">결제 내역</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>- 전체 결제 이력 조회</li>
                  <li>- 결제 수단 관리</li>
                  <li>- 정기결제 현황 확인</li>
                  <li>- 영수증 다운로드</li>
                </ul>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">계정 설정</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li>- 프로필 정보 수정 (이름, 이메일, 전화번호)</li>
                  <li>- 비밀번호 변경</li>
                  <li>- 추천 코드 확인 및 공유</li>
                  <li>- 소셜 계정 연동 관리</li>
                </ul>
              </div>
            </div>
          </section>

          {/* ===== 7. 요금제 안내 ===== */}
          <section id="plans" className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              요금제 안내
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              비즈니스 규모에 맞는 요금제를 선택하세요. 현재 신규 가입자 한정 첫 달 90% 할인이 진행 중입니다.
            </p>

            {/* 요금제 비교 테이블 */}
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-700">기능</th>
                    {PLAN_LIST.map((plan) => (
                      <th key={plan.key} className="border border-gray-200 px-4 py-3 text-center font-semibold text-gray-700">
                        {plan.nameKo}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-200 px-4 py-3 font-medium text-gray-700">월 가격</td>
                    {PLAN_LIST.map((plan) => (
                      <td key={plan.key} className="border border-gray-200 px-4 py-3 text-center">
                        <span className="line-through text-gray-400 text-xs block">{formatKrw(plan.priceKrw)}</span>
                        <span className="font-bold text-gray-900">{formatKrw(plan.discountedKrw)}</span>
                        {!plan.isRecurring && <span className="text-xs text-gray-500 block">(일시불)</span>}
                      </td>
                    ))}
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border border-gray-200 px-4 py-3 font-medium text-gray-700">키워드 수</td>
                    {PLAN_LIST.map((plan) => (
                      <td key={plan.key} className="border border-gray-200 px-4 py-3 text-center font-medium">
                        {typeof plan.keywords === 'number' ? `${plan.keywords}개` : plan.keywords}
                      </td>
                    ))}
                  </tr>
                  {['네이버 쇼핑 자동화', '경쟁사 순위 분석', '자동 스케줄링', '프록시/IP 분산'].map((feat) => (
                    <tr key={feat}>
                      <td className="border border-gray-200 px-4 py-3 font-medium text-gray-700">{feat}</td>
                      {PLAN_LIST.map((plan) => {
                        const included = plan.features.find((f) => f.text.includes(feat.replace('네이버 ', '')))?.included ?? false;
                        return (
                          <td key={plan.key} className="border border-gray-200 px-4 py-3 text-center">
                            {included ? (
                              <svg className="w-5 h-5 text-green-500 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5 text-gray-300 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-4">업그레이드 방법</h3>
            <ol className="list-decimal ml-6 space-y-3 text-gray-600 mb-6">
              <li>대시보드의 "구독 관리" 메뉴에서 "플랜 변경"을 클릭합니다.</li>
              <li>원하는 상위 플랜을 선택합니다.</li>
              <li>기존 플랜의 남은 기간은 비례 정산되어 차액만 결제됩니다.</li>
              <li>업그레이드 즉시 새 플랜의 모든 기능을 사용할 수 있습니다.</li>
            </ol>

            <div className="flex gap-4">
              <Link
                to="/#pricing"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = '/#pricing';
                }}
                className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
              >
                요금제 상세 보기
              </Link>
              <Link
                to="/payment"
                className="inline-flex items-center px-5 py-2.5 bg-gray-100 text-gray-800 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm"
              >
                결제 페이지로 이동
              </Link>
            </div>
          </section>

          {/* ===== 8. 자주 묻는 질문 ===== */}
          <section id="faq" className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              자주 묻는 질문
            </h2>
            <div className="space-y-3">
              {FAQ.list.map((item, i) => (
                <FAQItem key={i} question={item.question} answer={item.answer} />
              ))}
              {/* 추가 가이드 관련 FAQ */}
              <FAQItem
                question="프로그램이 실행되지 않아요."
                answer="Windows 보안 설정에서 마케팅헬퍼를 허용 목록에 추가해주세요. 또한, .NET Framework 4.8 이상이 설치되어 있는지 확인하세요. 그래도 문제가 지속되면 관리자 권한으로 실행해보세요."
              />
              <FAQItem
                question="라이선스 키를 분실했어요."
                answer="대시보드의 '라이선스 관리' 메뉴에서 언제든지 라이선스 키를 다시 확인할 수 있습니다. 로그인이 불가능한 경우 dltlqeowkd@gmail.com으로 문의해주세요."
              />
              <FAQItem
                question="기기를 변경하고 싶어요."
                answer="라이선스는 1대의 PC에 연동됩니다. 기기 변경이 필요한 경우 대시보드에서 기기 해제 요청을 하거나, 고객센터로 문의해주세요. 기기 변경은 월 2회까지 가능합니다."
              />
              <FAQItem
                question="정기결제를 해지하고 싶어요."
                answer="대시보드의 '구독 관리' 메뉴에서 '구독 해지'를 클릭하면 다음 결제일부터 자동결제가 중단됩니다. 현재 구독 기간이 끝나기 전까지는 계속 사용 가능합니다."
              />
            </div>
          </section>

          {/* ===== 9. 문의하기 ===== */}
          <section id="contact" className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-3 border-b border-gray-200">
              문의하기
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              궁금한 점이 있거나 도움이 필요하신가요? 아래 채널을 통해 언제든지 문의해주세요.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <a
                href="mailto:dltlqeowkd@gmail.com"
                className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl border border-gray-100 hover:bg-gray-100 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">이메일 문의</p>
                  <p className="text-sm text-gray-500 mt-1">dltlqeowkd@gmail.com</p>
                  <p className="text-xs text-gray-400 mt-1">영업일 기준 24시간 이내 답변</p>
                </div>
              </a>

              <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-10 h-10 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">카카오톡 문의</p>
                  <p className="text-sm text-gray-500 mt-1">마케팅헬퍼</p>
                  <p className="text-xs text-gray-400 mt-1">평일 10:00 ~ 18:00 실시간 상담</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-800 mb-3">문의 전 확인해주세요</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  사용 중인 요금제와 라이선스 정보를 함께 알려주시면 빠른 해결이 가능합니다.
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  오류 발생 시 화면 캡처나 오류 메시지를 첨부해주세요.
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  환불 관련 문의는{' '}
                  <Link to="/refund" className="text-blue-600 hover:underline">환불정책</Link>을 먼저 확인해주세요.
                </li>
              </ul>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
