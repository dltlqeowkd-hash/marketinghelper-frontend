// ============================================
// Polar 결제 성공 페이지
// ============================================

import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { getPolarCheckoutStatus, PaymentResult } from '../services/payment.service';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkoutId = searchParams.get('checkout_id');
    if (!checkoutId) {
      setError('결제 정보가 올바르지 않습니다.');
      setIsLoading(false);
      return;
    }

    let attempts = 0;
    const maxAttempts = 12; // 5초 × 12 = 60초

    const checkStatus = async () => {
      try {
        const data = await getPolarCheckoutStatus(checkoutId);
        if (data.payment) {
          setResult({
            message: '결제 완료',
            subscription: data.payment.subscription || { plan: data.payment.plan, endDate: '' },
            license: data.payment.license || { licenseKey: '' },
          });
          setIsLoading(false);
          return;
        }
        if (data.status === 'succeeded' || data.status === 'confirmed') {
          // 웹훅 처리 대기 중
          attempts++;
          if (attempts < maxAttempts) {
            setTimeout(checkStatus, 5000);
          } else {
            setResult({
              message: '결제 완료',
              subscription: { plan: '', endDate: '' },
              license: { licenseKey: '처리 중입니다. 잠시 후 대시보드에서 확인해주세요.' },
            });
            setIsLoading(false);
          }
          return;
        }
        if (data.status === 'failed' || data.status === 'expired') {
          setError('결제에 실패했습니다.');
          setIsLoading(false);
          return;
        }
        // still processing
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(checkStatus, 5000);
        } else {
          setError('결제 확인 시간이 초과되었습니다. 대시보드에서 확인해주세요.');
          setIsLoading(false);
        }
      } catch (err: any) {
        setError(err.response?.data?.error || '결제 확인에 실패했습니다.');
        setIsLoading(false);
      }
    };

    checkStatus();
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-500">결제를 확인하고 있습니다...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">결제 실패</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <Link to="/payment" className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            다시 시도
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">결제 완료!</h2>
        <p className="text-gray-500 mb-6">마케팅헬퍼 구독이 활성화되었습니다.</p>

        {result && (
          <div className="bg-gray-50 rounded-lg p-4 text-left space-y-2 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-500">플랜</span>
              <span className="font-medium">{result.subscription.plan}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">만료일</span>
              <span className="font-medium">
                {new Date(result.subscription.endDate).toLocaleDateString('ko-KR')}
              </span>
            </div>
            <hr />
            <div>
              <span className="text-gray-500 text-sm">라이선스 키</span>
              <div className="font-mono font-bold text-primary-600 mt-1 break-all">
                {result.license.licenseKey}
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <Link
            to="/dashboard"
            className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            대시보드
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
