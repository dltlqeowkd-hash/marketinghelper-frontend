// Hero 섹션 - 프리미엄 디자인
import { Link } from 'react-router-dom';
import { HERO } from '../../constants/content';

export default function HeroSection() {
  return (
    <section className="relative pt-32 pb-24 px-4 overflow-hidden mesh-gradient min-h-[90vh] flex items-center">
      {/* 애니메이트 블롭 배경 */}
      <div className="absolute top-20 -right-20 w-[500px] h-[500px] bg-primary-500/20 rounded-full blur-3xl animate-blob" />
      <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-accent-500/20 rounded-full blur-3xl animate-blob" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl animate-blob" style={{ animationDelay: '4s' }} />

      {/* 그리드 패턴 오버레이 */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative max-w-7xl mx-auto text-center w-full">
        {/* 배지 */}
        <div className="inline-flex items-center gap-2 px-5 py-2.5 glass-dark rounded-full text-sm font-medium mb-8 animate-fade-up">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          <span className="text-gray-200">{HERO.badge}</span>
        </div>

        {/* 메인 타이틀 - 그라디언트 */}
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight whitespace-pre-line mb-6 animate-fade-up">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white">
            마케팅헬퍼로
          </span>
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400">
            네이버 마케팅을
          </span>
          <br />
          <span className="text-white">
            자동화하세요
          </span>
        </h1>

        {/* 서브 타이틀 */}
        <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto whitespace-pre-line mb-10 animate-fade-up">
          {HERO.subtitle}
        </p>

        {/* CTA 버튼 */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6 animate-fade-up">
          <Link
            to="/register"
            className="group relative px-8 py-4 bg-gradient-to-r from-primary-600 to-accent-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-primary-600/25 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-500/30 overflow-hidden"
          >
            <span className="relative z-10">{HERO.cta}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-accent-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
          <a
            href="#features"
            className="px-8 py-4 glass-dark text-white rounded-xl font-medium text-lg hover:bg-white/10 transition-all"
          >
            자세히 알아보기
          </a>
        </div>

        <p className="text-sm text-gray-500">{HERO.ctaSub}</p>

        {/* 대시보드 프리뷰 - 글래스 프레임 */}
        <div className="mt-16 max-w-4xl mx-auto animate-fade-up">
          <div className="relative p-1 rounded-2xl bg-gradient-to-b from-white/20 to-white/5">
            <div className="glass-dark rounded-xl overflow-hidden">
              <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl aspect-[16/9] flex items-center justify-center relative">
                {/* 대시보드 UI 요소 */}
                <div className="absolute inset-4 grid grid-cols-4 grid-rows-3 gap-3 opacity-40">
                  <div className="col-span-1 row-span-1 bg-primary-500/20 rounded-lg" />
                  <div className="col-span-1 row-span-1 bg-accent-500/20 rounded-lg" />
                  <div className="col-span-1 row-span-1 bg-emerald-500/20 rounded-lg" />
                  <div className="col-span-1 row-span-1 bg-amber-500/20 rounded-lg" />
                  <div className="col-span-2 row-span-2 bg-primary-500/10 rounded-lg" />
                  <div className="col-span-2 row-span-2 bg-accent-500/10 rounded-lg" />
                </div>
                <div className="text-center relative z-10">
                  <div className="text-6xl mb-4 animate-float">📊</div>
                  <p className="text-gray-400 text-sm">마케팅헬퍼 대시보드 미리보기</p>
                </div>
              </div>
            </div>
          </div>
          {/* 하단 글로우 반사 */}
          <div className="h-40 bg-gradient-to-b from-primary-500/10 to-transparent blur-2xl -mt-20 mx-auto w-3/4" />
        </div>
      </div>
    </section>
  );
}
