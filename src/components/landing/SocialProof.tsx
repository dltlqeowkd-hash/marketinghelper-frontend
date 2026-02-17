// Social Proof 섹션 (통계)
import { SOCIAL_PROOF } from '../../constants/content';

export default function SocialProof() {
  return (
    <section className="py-16 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-center text-gray-500 text-sm mb-10">{SOCIAL_PROOF.title}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {SOCIAL_PROOF.stats.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-primary-600 mb-1">
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
