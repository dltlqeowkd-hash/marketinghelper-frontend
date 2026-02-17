// ============================================
// 토스페이먼츠 결제 실패 페이지
// ============================================

import { useSearchParams, Link } from 'react-router-dom';

export default function PaymentFail() {
  const [searchParams] = useSearchParams();
  const code = searchParams.get('code');
  const message = searchParams.get('message');

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">결제 실패</h2>
        <p className="text-gray-500 mb-2">
          {message || '결제 처리 중 오류가 발생했습니다.'}
        </p>
        {code && (
          <p className="text-xs text-gray-400 mb-6">에러 코드: {code}</p>
        )}

        <div className="flex gap-3">
          <Link
            to="/payment"
            className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            다시 시도
          </Link>
          <Link
            to="/"
            className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            홈으로
          </Link>
        </div>
      </div>
    </div>
  );
}
