// Social Proof 섹션 (통계) - 프리미엄 디자인
import { SOCIAL_PROOF } from '../../constants/content';

export default function SocialProof() {
  return (
    <section className="relative py-16 bg-slate-900 overflow-hidden">
      {/* 배경 그라디언트 */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-900/50 via-slate-900 to-accent-900/50" />

      <div className="relative max-w-7xl mx-auto px-4">
        <p className="text-center text-gray-400 text-sm mb-10">{SOCIAL_PROOF.title}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {SOCIAL_PROOF.stats.map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="text-3xl sm:text-4xl font-bold text-gradient mb-1 group-hover:scale-110 transition-transform">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
