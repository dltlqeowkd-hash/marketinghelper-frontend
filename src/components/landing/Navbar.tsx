// 네비게이션 바 - 프리미엄 디자인
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  function handleSectionClick(sectionId: string) {
    setIsOpen(false);
    if (location.pathname === '/') {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.location.href = `/#${sectionId}`;
    }
  }

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-slate-900/90 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/10'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* 로고 */}
          <Link to="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-400 to-accent-400">
            마케팅헬퍼
          </Link>

          {/* 데스크톱 메뉴 */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => handleSectionClick('features')} className="text-gray-300 hover:text-white text-sm transition-colors">기능</button>
            <button onClick={() => handleSectionClick('pricing')} className="text-gray-300 hover:text-white text-sm transition-colors">가격</button>
            <button onClick={() => handleSectionClick('reviews')} className="text-gray-300 hover:text-white text-sm transition-colors">후기</button>
            <button onClick={() => handleSectionClick('faq')} className="text-gray-300 hover:text-white text-sm transition-colors">FAQ</button>
            <Link to="/seo-doctor" className="text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors">SEO Doctor</Link>
          </div>

          {/* 버튼 */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="px-5 py-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg text-sm font-medium hover:from-primary-500 hover:to-accent-500 transition-all shadow-md shadow-primary-500/20"
                >
                  대시보드
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-gray-400 hover:text-white text-sm transition-colors"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-gray-300 hover:text-white text-sm transition-colors">
                  로그인
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-lg text-sm font-medium hover:from-primary-500 hover:to-accent-500 transition-all shadow-md shadow-primary-500/20"
                >
                  무료 시작
                </Link>
              </>
            )}
          </div>

          {/* 모바일 메뉴 버튼 */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2">
            <svg className="w-6 h-6 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col gap-3">
              <button onClick={() => handleSectionClick('features')} className="px-3 py-2 text-gray-300 text-left hover:text-white transition-colors">기능</button>
              <button onClick={() => handleSectionClick('pricing')} className="px-3 py-2 text-gray-300 text-left hover:text-white transition-colors">가격</button>
              <button onClick={() => handleSectionClick('reviews')} className="px-3 py-2 text-gray-300 text-left hover:text-white transition-colors">후기</button>
              <button onClick={() => handleSectionClick('faq')} className="px-3 py-2 text-gray-300 text-left hover:text-white transition-colors">FAQ</button>
              <Link to="/seo-doctor" onClick={() => setIsOpen(false)} className="px-3 py-2 text-primary-400 font-medium">SEO Doctor</Link>
              <hr className="border-white/10" />
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsOpen(false)} className="px-3 py-2 text-primary-400 font-medium">대시보드</Link>
                  <button onClick={() => { handleLogout(); setIsOpen(false); }} className="px-3 py-2 text-gray-400 text-left hover:text-white transition-colors">로그아웃</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsOpen(false)} className="px-3 py-2 text-gray-300">로그인</Link>
                  <Link to="/register" onClick={() => setIsOpen(false)} className="px-3 py-2 text-primary-400 font-medium">무료 시작</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
