// ============================================
// 결제 API 서비스
// ============================================

import api from './api';

// 플랜 정보 타입
export interface PlanInfo {
  plan: string;
  nameKo: string;
  nameEn: string;
  priceKrw: number;
  priceUsd: number;
  durationDays: number;
  isRecurring: boolean;
}

// 결제 결과 타입
export interface PaymentResult {
  message: string;
  subscription: {
    plan: string;
    endDate: string;
    nextBillingDate?: string;
  };
  license: {
    licenseKey: string;
    expiresAt?: string;
  };
}

// 플랜 목록 조회
export async function getPlans(): Promise<PlanInfo[]> {
  const res = await api.get('/payments/plans');
  return res.data.plans;
}

// ===== 토스페이먼츠 =====

// 토스 결제 준비
export async function prepareTossPayment(plan: string) {
  const res = await api.post('/payments/toss/prepare', { plan });
  return res.data;
}

// 토스 결제 승인
export async function confirmTossPayment(paymentKey: string, orderId: string, amount: number): Promise<PaymentResult> {
  const res = await api.post('/payments/toss/confirm', { paymentKey, orderId, amount });
  return res.data;
}

// 토스 정기결제 등록
export async function issueTossBilling(authKey: string, customerKey: string, plan: string): Promise<PaymentResult> {
  const res = await api.post('/payments/toss/billing', { authKey, customerKey, plan });
  return res.data;
}

// ===== PayPal =====

// PayPal 주문 생성
export async function createPayPalOrder(plan: string) {
  const res = await api.post('/payments/paypal/create', { plan });
  return res.data;
}

// PayPal 결제 캡처
export async function capturePayPalOrder(orderId: string): Promise<PaymentResult> {
  const res = await api.post('/payments/paypal/capture', { orderId });
  return res.data;
}

// ===== 계좌이체 =====

// 계좌이체 요청
export async function requestBankTransfer(plan: string, depositorName: string) {
  const res = await api.post('/payments/bank/request', { plan, depositorName });
  return res.data;
}
