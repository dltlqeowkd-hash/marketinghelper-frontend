// ============================================
// 대시보드 API 서비스
// ============================================

import api from './api';

// 내 구독 목록
export async function getMySubscriptions() {
  const res = await api.get('/dashboard/subscriptions');
  return res.data.subscriptions;
}

// 내 라이선스 목록
export async function getMyLicenses() {
  const res = await api.get('/dashboard/licenses');
  return res.data.licenses;
}

// 내 결제 내역
export async function getMyPayments() {
  const res = await api.get('/dashboard/payments');
  return res.data.payments;
}

// 구독 취소
export async function cancelSubscription(subscriptionId: string) {
  const res = await api.post(`/dashboard/subscriptions/${subscriptionId}/cancel`);
  return res.data;
}

// 프로필 수정
export async function updateProfile(data: { name?: string; phone?: string }) {
  const res = await api.put('/dashboard/profile', data);
  return res.data;
}

// 비밀번호 변경
export async function changePassword(currentPassword: string, newPassword: string) {
  const res = await api.put('/dashboard/password', { currentPassword, newPassword });
  return res.data;
}
