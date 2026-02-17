// 네비게이션 바
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function Navbar() {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

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
            <a href="#features" className="text-gray-600 hover:text-gray-900 text-sm">기능</a>
            <a href="#pricing" className="text-gray-600 hover:text-gray-900 text-sm">가격</a>
            <a href="#reviews" className="text-gray-600 hover:text-gray-900 text-sm">후기</a>
            <a href="#faq" className="text-gray-600 hover:text-gray-900 text-sm">FAQ</a>
            <Link to="/seo-doctor" className="text-blue-600 hover:text-blue-700 text-sm font-medium">SEO Doctor</Link>
          </div>

          {/* 버튼 */}
          <div className="hidden md:flex items-center gap-3">
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
              <a href="#features" onClick={() => setIsOpen(false)} className="px-3 py-2 text-gray-600">기능</a>
              <a href="#pricing" onClick={() => setIsOpen(false)} className="px-3 py-2 text-gray-600">가격</a>
              <a href="#reviews" onClick={() => setIsOpen(false)} className="px-3 py-2 text-gray-600">후기</a>
              <a href="#faq" onClick={() => setIsOpen(false)} className="px-3 py-2 text-gray-600">FAQ</a>
              <Link to="/seo-doctor" onClick={() => setIsOpen(false)} className="px-3 py-2 text-blue-600 font-medium">SEO Doctor</Link>
              <hr />
              {isAuthenticated ? (
                <Link to="/dashboard" className="px-3 py-2 text-primary-600 font-medium">대시보드</Link>
              ) : (
                <>
                  <Link to="/login" className="px-3 py-2 text-gray-600">로그인</Link>
                  <Link to="/register" className="px-3 py-2 text-primary-600 font-medium">무료 시작</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
