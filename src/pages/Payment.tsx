// ============================================
// 결제 페이지
// Polar 카드결제 + PayPal + 계좌이체
// ============================================

import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { PLAN_LIST, formatKrw, formatUsd } from '../constants/plans';
import { createPolarCheckout, createPayPalOrder, requestBankTransfer } from '../services/payment.service';

export default function Payment() {
  const [searchParams] = useSearchParams();
  const preselectedPlan = searchParams.get('plan')?.toUpperCase() || '';

  const [selectedPlan, setSelectedPlan] = useState(preselectedPlan || 'PREMIUM');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'bank'>('card');

  const [bankName, setBankName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [bankResult, setBankResult] = useState<any>(null);

  const plan = PLAN_LIST.find((p) => p.key === selectedPlan);

  const handlePolarPayment = async () => {
    setError('');
    setIsLoading(true);
    try {
      const data = await createPolarCheckout(selectedPlan);
      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        setError('결제 URL을 받지 못했습니다.');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || '카드 결제 준비에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayPalPayment = async () => {
    setError('');
    setIsLoading(true);

    try {
      const data = await createPayPalOrder(selectedPlan);
      if (data.approvalUrl) {
        window.location.href = data.approvalUrl;
      } else {
        setError('PayPal 결제 URL을 받지 못했습니다.');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'PayPal 결제 준비에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBankTransfer = async () => {
    if (!bankName.trim()) {
      setError('입금자명을 입력해주세요.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const data = await requestBankTransfer(selectedPlan, bankName);
      setBankResult(data);
    } catch (err: any) {
      setError(err.response?.data?.error || '계좌이체 요청에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = () => {
    switch (paymentMethod) {
      case 'card': return handlePolarPayment();
      case 'paypal': return handlePayPalPayment();
      case 'bank': return handleBankTransfer();
    }
  };

  // 계좌이체 완료 화면
  if (bankResult) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">계좌이체 안내</h2>
          <p className="text-gray-500 mb-6">아래 계좌로 입금해주세요</p>

          <div className="bg-gray-50 rounded-lg p-4 text-left space-y-2 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-500">은행</span>
              <span className="font-medium">{bankResult.bankInfo.bank}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">계좌번호</span>
              <span className="font-medium font-mono">{bankResult.bankInfo.account}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">예금주</span>
              <span className="font-medium">{bankResult.bankInfo.holder}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">입금액</span>
              <span className="font-bold text-primary-600">{formatKrw(bankResult.bankInfo.amount)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">입금자명</span>
              <span className="font-medium">{bankResult.bankInfo.depositorName}</span>
            </div>
          </div>

          <p className="text-sm text-gray-400 mb-4">
            입금 확인 후 관리자가 승인하면 라이선스가 발급됩니다.
            <br />평일 기준 1~2시간 내 처리됩니다.
          </p>

          <Link to="/dashboard" className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            대시보드로 이동
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-bold text-primary-600">마케팅헬퍼</Link>
          <h1 className="text-3xl font-bold text-gray-800 mt-4">플랜 선택 및 결제</h1>
          <p className="text-gray-500 mt-2">원하시는 플랜과 결제 수단을 선택해주세요</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-center">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 왼쪽: 플랜 선택 */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-bold text-gray-800">1. 플랜 선택</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PLAN_LIST.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setSelectedPlan(p.key)}
                  className={`relative p-4 rounded-xl border-2 text-left transition-all ${
                    selectedPlan === p.key
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {p.isPopular && (
                    <span className="absolute -top-2 right-3 px-2 py-0.5 bg-primary-600 text-white text-xs rounded-full">
                      인기
                    </span>
                  )}
                  <div className="font-bold text-gray-800">{p.nameKo} ({p.isRecurring ? `${p.period} 구독` : p.period})</div>
                  {p.isIntroOffer ? (
                    <>
                      <div className="text-xs text-gray-400 line-through mt-1">{formatKrw(p.priceKrw)}/월</div>
                      <div className="text-xl font-bold text-primary-600">
                        {formatKrw(p.discountedKrw)}<span className="text-sm font-normal text-gray-500">/첫 달</span>
                      </div>
                      <div className="text-xs text-orange-500 font-medium mt-1">첫 달 {p.discountRate} OFF · 2개월차부터 {formatKrw(p.priceKrw)}/월</div>
                    </>
                  ) : (
                    <>
                      <div className="text-xl font-bold text-primary-600 mt-1">
                        {formatKrw(p.discountedKrw)}
                      </div>
                      <div className="text-sm text-gray-400">{formatUsd(p.discountedUsd)}</div>
                    </>
                  )}
                </button>
              ))}
            </div>

            <h2 className="text-lg font-bold text-gray-800 mt-8">2. 결제 수단</h2>
            <div className="space-y-3">
              <button
                onClick={() => setPaymentMethod('card')}
                className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${
                  paymentMethod === 'card' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                }`}
              >
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xl">
                  💳
                </div>
                <div className="text-left">
                  <div className="font-medium">카드결제 (Polar)</div>
                  <div className="text-sm text-gray-500">신용카드 / 체크카드</div>
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod('paypal')}
                className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${
                  paymentMethod === 'paypal' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                }`}
              >
                <div className="w-10 h-10 bg-[#003087] rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  P
                </div>
                <div className="text-left">
                  <div className="font-medium">PayPal</div>
                  <div className="text-sm text-gray-500">해외 결제 ({plan ? formatUsd(plan.discountedUsd) : ''})</div>
                </div>
              </button>

              <button
                onClick={() => setPaymentMethod('bank')}
                className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${
                  paymentMethod === 'bank' ? 'border-primary-500 bg-primary-50' : 'border-gray-200'
                }`}
              >
                <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  B
                </div>
                <div className="text-left">
                  <div className="font-medium">계좌이체</div>
                  <div className="text-sm text-gray-500">무통장 입금 (관리자 확인 후 처리)</div>
                </div>
              </button>
            </div>

            {/* 계좌이체 입금자명 입력 */}
            {paymentMethod === 'bank' && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">입금자명</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="입금자명을 입력하세요"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
            )}
          </div>

          {/* 오른쪽: 주문 요약 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4">주문 요약</h3>

              {plan && (
                <>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-500">플랜</span>
                      <span className="font-medium">마케팅헬퍼 {plan.nameKo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">이용 기간</span>
                      <span className="font-medium">{plan.period}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">자동 갱신</span>
                      <span className="font-medium">{plan.isRecurring ? '예' : '아니오 (1회)'}</span>
                    </div>
                    <hr />
                    {plan.isIntroOffer ? (
                      <>
                        <div className="flex justify-between text-sm text-gray-400">
                          <span>정가</span>
                          <span className="line-through">
                            {paymentMethod === 'paypal' ? formatUsd(plan.priceUsd) : formatKrw(plan.priceKrw)}/월
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-lg">첫 달 결제</span>
                          <div className="text-right">
                            <span className="font-bold text-lg text-primary-600">
                              {paymentMethod === 'paypal' ? formatUsd(plan.discountedUsd) : formatKrw(plan.discountedKrw)}
                            </span>
                            <span className="ml-2 text-xs text-red-500 font-medium">{plan.discountRate} OFF</span>
                          </div>
                        </div>
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <p className="text-xs text-amber-700">
                            2개월차부터 {paymentMethod === 'paypal' ? formatUsd(plan.priceUsd) : formatKrw(plan.priceKrw)}/월 자동 결제
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-lg">결제 금액</span>
                        <span className="font-bold text-lg text-primary-600">
                          {paymentMethod === 'paypal' ? formatUsd(plan.discountedUsd) : formatKrw(plan.discountedKrw)}
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handlePayment}
                    disabled={isLoading}
                    className="w-full py-4 bg-primary-600 text-white rounded-xl font-bold text-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? '처리 중...' : '결제하기'}
                  </button>

                  <p className="text-xs text-gray-400 text-center mt-3">
                    결제 시 이용약관 및 환불정책에 동의하게 됩니다.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
