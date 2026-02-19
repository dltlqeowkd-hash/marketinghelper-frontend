// 고객 후기 섹션 - 프리미엄 디자인
import { TESTIMONIALS } from '../../constants/content';

// 아바타 그라디언트 색상
const AVATAR_COLORS = [
  'from-primary-500 to-blue-600',
  'from-accent-500 to-purple-600',
  'from-emerald-500 to-teal-600',
];

export default function TestimonialsSection() {
  return (
    <section id="reviews" className="py-24 relative overflow-hidden">
      {/* 배경 */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 via-white to-gray-50" />
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-primary-100/40 rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-0 w-72 h-72 bg-accent-100/40 rounded-full blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-accent-100 text-accent-700 rounded-full text-sm font-medium mb-4">
            고객 후기
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{TESTIMONIALS.title}</h2>
          <p className="text-lg text-gray-500">{TESTIMONIALS.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {TESTIMONIALS.list.map((review, i) => (
            <div
              key={i}
              className="group relative bg-white rounded-2xl p-8 border border-gray-100 hover:border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* 인용 부호 */}
              <div className="absolute -top-3 left-8 text-5xl text-gradient font-serif leading-none select-none">
                "
              </div>

              {/* 별점 */}
              <div className="flex gap-1 mb-4 mt-2">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <svg key={j} className="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* 후기 내용 */}
              <p className="text-gray-600 leading-relaxed mb-6">"{review.content}"</p>

              {/* 작성자 */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <div className={`w-10 h-10 bg-gradient-to-br ${AVATAR_COLORS[i % AVATAR_COLORS.length]} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                  {review.name[0]}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{review.name}</div>
                  <div className="text-sm text-gray-400">{review.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
