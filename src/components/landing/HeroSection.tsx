// Hero 섹션
import { Link } from 'react-router-dom';
import { HERO } from '../../constants/content';

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden">
      {/* 배경 그라디언트 */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-blue-50"></div>
      <div className="absolute top-20 right-0 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl"></div>

      <div className="relative max-w-7xl mx-auto text-center">
        {/* 배지 */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-8">
          <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
          {HERO.badge}
        </div>

        {/* 메인 타이틀 */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight whitespace-pre-line mb-6">
          {HERO.title}
        </h1>

        {/* 서브 타이틀 */}
        <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto whitespace-pre-line mb-10">
          {HERO.subtitle}
        </p>

        {/* CTA 버튼 */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <Link
            to="/register"
            className="px-8 py-4 bg-primary-600 text-white rounded-xl font-bold text-lg hover:bg-primary-700 shadow-lg shadow-primary-600/25 transition-all hover:-translate-y-0.5"
          >
            {HERO.cta}
          </Link>
          <a
            href="#features"
            className="px-8 py-4 border border-gray-300 text-gray-700 rounded-xl font-medium text-lg hover:bg-gray-50 transition-colors"
          >
            자세히 알아보기
          </a>
        </div>

        <p className="text-sm text-gray-400">{HERO.ctaSub}</p>

        {/* 히어로 이미지 영역 */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-2">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl aspect-[16/9] flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">📊</div>
                <p className="text-gray-400 text-sm">마케팅헬퍼 대시보드 미리보기</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
