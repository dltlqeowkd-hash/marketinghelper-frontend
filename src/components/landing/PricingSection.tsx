// 가격 플랜 섹션
import { Link } from 'react-router-dom';
import { PLAN_LIST, FREE_TRIAL, formatKrw } from '../../constants/plans';

const CheckIcon = () => (
  <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
  </svg>
);

const XIcon = () => (
  <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
  </svg>
);

export default function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">합리적인 가격, 강력한 기능</h2>
          <p className="text-lg text-gray-500">
            비즈니스 규모에 맞는 플랜을 선택하세요
          </p>
        </div>

        {/* 무료 체험 배너 */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-gradient-to-r from-primary-500 to-primary-700 rounded-2xl p-6 text-center text-white shadow-lg">
            <p className="text-sm font-medium opacity-90 mb-1">{FREE_TRIAL.nameKo}</p>
            <p className="text-2xl font-bold mb-2">{FREE_TRIAL.features} - {FREE_TRIAL.duration} 무료!</p>
            <p className="text-sm opacity-80 mb-3">카드 등록 불필요 · 키워드 {FREE_TRIAL.keywords}개 체험</p>
            <Link
              to="/register"
              className="inline-block px-6 py-2 bg-white text-primary-700 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              무료 체험 시작
            </Link>
          </div>
        </div>

        {/* 신규 할인 안내 */}
        <div className="text-center mb-8">
          <span className="inline-block px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-medium border border-red-200">
            신규 가입자 한정 최대 50% 할인 진행중!
          </span>
        </div>

        {/* 플랜 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {PLAN_LIST.map((plan) => (
            <div
              key={plan.key}
              className={`relative rounded-2xl p-6 border-2 transition-all flex flex-col ${
                plan.isPopular
                  ? 'border-primary-500 bg-white shadow-xl scale-[1.02]'
                  : plan.isLifetime
                  ? 'border-amber-400 bg-gradient-to-b from-amber-50 to-white shadow-lg'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary-600 text-white text-xs font-bold rounded-full whitespace-nowrap">
                  가장 인기
                </div>
              )}
              {plan.isLifetime && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-500 text-white text-xs font-bold rounded-full whitespace-nowrap">
                  평생 소장
                </div>
              )}

              <div className="text-center flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{plan.nameKo}</h3>
                <p className="text-sm text-gray-400 mb-4">
                  키워드 {typeof plan.keywords === 'number' ? `${plan.keywords}개` : plan.keywords}
                </p>

                {/* 가격 */}
                <div className="mb-4">
                  <div className="text-sm text-gray-400 line-through">{formatKrw(plan.priceKrw)}{plan.isRecurring ? '/월' : ''}</div>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold text-gray-900">{formatKrw(plan.discountedKrw)}</span>
                    <span className="text-gray-400 text-sm">
                      {plan.isLifetime ? '(평생)' : plan.isIntroOffer ? '/첫 달' : '/월'}
                    </span>
                  </div>
                  {plan.discountRate && (
                    <div className="inline-block mt-2 px-3 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full">
                      {plan.discountRate} OFF
                    </div>
                  )}
                  {plan.isIntroOffer && (
                    <p className="text-xs text-amber-600 mt-2">2개월차~ {formatKrw(plan.priceKrw)}/월</p>
                  )}
                </div>

                {/* 기능 목록 */}
                <ul className="text-sm space-y-2 mb-6 text-left flex-1">
                  {plan.features.map((feat, i) => (
                    <li key={i} className={`flex items-center gap-2 ${feat.included ? 'text-gray-700' : 'text-gray-300'}`}>
                      {feat.included ? <CheckIcon /> : <XIcon />}
                      <span className={feat.included ? '' : 'line-through'}>{feat.text}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  to={`/payment?plan=${plan.key}`}
                  className={`block w-full py-3 rounded-xl font-medium text-center transition-colors ${
                    plan.isPopular
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : plan.isLifetime
                      ? 'bg-amber-500 text-white hover:bg-amber-600'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {plan.isLifetime ? '평생 라이선스 구매' : '구독 시작하기'}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* 추천인 혜택 */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 text-center">
            <h3 className="text-lg font-bold text-blue-800 mb-2">친구 추천 혜택</h3>
            <p className="text-blue-600 text-sm">
              친구에게 추천 코드를 공유하세요! 친구가 가입하면 <strong>구독 1개월 무료 연장</strong> 혜택을 드립니다.
            </p>
          </div>
        </div>

        {/* 결제수단 안내 */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400 mb-4">지원 결제수단</p>
          <div className="flex items-center justify-center gap-6 text-gray-400">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white text-xs font-bold">T</div>
              <span className="text-sm">토스페이먼츠</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#003087] rounded flex items-center justify-center text-white text-xs font-bold">P</div>
              <span className="text-sm">PayPal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center text-white text-xs font-bold">B</div>
              <span className="text-sm">계좌이체</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
