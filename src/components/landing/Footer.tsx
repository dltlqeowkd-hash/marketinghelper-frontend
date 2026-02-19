// Footer 섹션
import { Link, useLocation } from 'react-router-dom';
import { FOOTER } from '../../constants/content';

// 랜딩 페이지 섹션으로 스크롤하는 헬퍼
function scrollToSection(sectionId: string) {
  const el = document.getElementById(sectionId);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

export default function Footer() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // 랜딩 섹션 링크 클릭 핸들러
  function handleSectionClick(sectionId: string) {
    if (isHomePage) {
      // 같은 페이지면 스크롤
      scrollToSection(sectionId);
    } else {
      // 다른 페이지면 홈으로 이동 후 해시 사용
      window.location.href = `/#${sectionId}`;
    }
  }

  return (
    <footer className="bg-gray-900 text-gray-400 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* 회사 정보 */}
          <div>
            <div className="text-white font-bold text-xl mb-2">{FOOTER.company}</div>
            <p className="text-sm mb-4">{FOOTER.description}</p>
            <div className="space-y-1 text-sm">
              <p>이메일: {FOOTER.contact.email}</p>
              <p>전화: 010-8563-5815</p>
            </div>
          </div>

          {/* 제품 */}
          <div>
            <h4 className="text-white font-medium mb-4">제품</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => handleSectionClick('features')}
                  className="hover:text-white transition-colors text-left"
                >
                  기능 소개
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSectionClick('pricing')}
                  className="hover:text-white transition-colors text-left"
                >
                  가격 안내
                </button>
              </li>
              <li>
                <Link to="/seo-doctor" className="hover:text-white transition-colors">
                  SEO Doctor
                </Link>
              </li>
            </ul>
          </div>

          {/* 고객 지원 */}
          <div>
            <h4 className="text-white font-medium mb-4">고객 지원</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href={`mailto:${FOOTER.contact.email}`}
                  className="hover:text-white transition-colors"
                >
                  고객센터
                </a>
              </li>
              <li>
                <Link to="/guide" className="hover:text-white transition-colors">
                  사용 가이드
                </Link>
              </li>
              <li>
                <button
                  onClick={() => handleSectionClick('faq')}
                  className="hover:text-white transition-colors text-left"
                >
                  자주 묻는 질문
                </button>
              </li>
            </ul>
          </div>

          {/* 법률 */}
          <div>
            <h4 className="text-white font-medium mb-4">법률 문서</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/terms" className="hover:text-white transition-colors">이용약관</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">개인정보처리방침</Link></li>
              <li><Link to="/refund" className="hover:text-white transition-colors">환불정책</Link></li>
            </ul>
          </div>
        </div>

        {/* 사업자 정보 */}
        <div className="border-t border-gray-800 pt-8 mb-6">
          <div className="text-xs text-gray-500 space-y-1">
            <p>상호명: {FOOTER.businessInfo.name} | 서비스명: {FOOTER.company}</p>
            {FOOTER.businessInfo.representative && <p>대표: {FOOTER.businessInfo.representative}</p>}
            {FOOTER.businessInfo.businessNumber && <p>사업자등록번호: {FOOTER.businessInfo.businessNumber}</p>}
            {FOOTER.businessInfo.address && <p>주소: {FOOTER.businessInfo.address}</p>}
            {FOOTER.businessInfo.onlineSalesNumber && <p>통신판매업신고: {FOOTER.businessInfo.onlineSalesNumber}</p>}
            {FOOTER.businessInfo.phone && <p>전화: {FOOTER.businessInfo.phone}</p>}
            <p>문의: {FOOTER.contact.email}</p>
          </div>
        </div>

        {/* 하단 */}
        <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm">{FOOTER.copyright}</p>
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm hover:text-white transition-colors">로그인</Link>
            <Link to="/register" className="text-sm hover:text-white transition-colors">회원가입</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
