// CTA 섹션 - 프리미엄 디자인
import { Link } from 'react-router-dom';
import { CTA } from '../../constants/content';

export default function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden mesh-gradient">
      {/* 애니메이트 블롭 */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/15 rounded-full blur-3xl animate-blob" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-500/15 rounded-full blur-3xl animate-blob" style={{ animationDelay: '3s' }} />

      <div className="relative max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{CTA.title}</h2>
        <p className="text-lg text-gray-400 whitespace-pre-line mb-10">{CTA.subtitle}</p>

        <Link
          to="/register"
          className="group relative inline-block px-10 py-4 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-primary-500/25 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-500/40 overflow-hidden"
        >
          <span className="relative z-10">{CTA.button}</span>
          <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-accent-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>

        <p className="mt-4 text-sm text-gray-500">{CTA.note}</p>
      </div>
    </section>
  );
}
