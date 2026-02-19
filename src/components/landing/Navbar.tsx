// 네비게이션 바
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // 홈페이지 섹션으로 이동하는 핸들러
  function handleSectionClick(sectionId: string) {
    setIsOpen(false);
    if (location.pathname === '/') {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.location.href = `/#${sectionId}`;
    }
  }

  // 로그아웃 핸들러
  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <Link to="/" className="text-xl font-bold text-primary-600">
            마케팅헬퍼
          </Link>

          {/* 데스크톱 메뉴 */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => handleSectionClick('features')} className="text-gray-600 hover:text-gray-900 text-sm">기능</button>
            <button onClick={() => handleSectionClick('pricing')} className="text-gray-600 hover:text-gray-900 text-sm">가격</button>
            <button onClick={() => handleSectionClick('testimonials')} className="text-gray-600 hover:text-gray-900 text-sm">후기</button>
            <button onClick={() => handleSectionClick('faq')} className="text-gray-600 hover:text-gray-900 text-sm">FAQ</button>
            <Link to="/seo-doctor" className="text-blue-600 hover:text-blue-700 text-sm font-medium">SEO Doctor</Link>
          </div>

          {/* 버튼 */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="px-5 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                >
                  대시보드
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-gray-500 hover:text-gray-900 text-sm transition-colors"
                >
                  로그아웃
                </button>
              </>
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

          {/* 모바일 메뉴 버튼 */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2">
            <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* 모바일 메뉴 */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-3">
              <button onClick={() => handleSectionClick('features')} className="px-3 py-2 text-gray-600 text-left">기능</button>
              <button onClick={() => handleSectionClick('pricing')} className="px-3 py-2 text-gray-600 text-left">가격</button>
              <button onClick={() => handleSectionClick('testimonials')} className="px-3 py-2 text-gray-600 text-left">후기</button>
              <button onClick={() => handleSectionClick('faq')} className="px-3 py-2 text-gray-600 text-left">FAQ</button>
              <Link to="/seo-doctor" onClick={() => setIsOpen(false)} className="px-3 py-2 text-blue-600 font-medium">SEO Doctor</Link>
              <hr />
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsOpen(false)} className="px-3 py-2 text-primary-600 font-medium">대시보드</Link>
                  <button onClick={() => { handleLogout(); setIsOpen(false); }} className="px-3 py-2 text-gray-600 text-left">로그아웃</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)} className="px-3 py-2 text-gray-600">로그인</Link>
                  <Link to="/register" onClick={() => setIsOpen(false)} className="px-3 py-2 text-primary-600 font-medium">무료 시작</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
