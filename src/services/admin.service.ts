// ============================================
// 관리자 API 서비스
// ============================================

import api from './api';

// ===== 통계 =====
export async function getAdminStats() {
  const res = await api.get('/admin/stats');
  return res.data;
}

// ===== 유저 관리 =====
export async function getAdminUsers(params: { search?: string; role?: string; page?: number }) {
  const res = await api.get('/admin/users', { params });
  return res.data;
}

export async function getAdminUserDetail(userId: string) {
  const res = await api.get(`/admin/users/${userId}`);
  return res.data;
}

export async function toggleUserStatus(userId: string) {
  const res = await api.patch(`/admin/users/${userId}/toggle`);
  return res.data;
}

// ===== 결제 관리 =====
export async function getAdminPayments(params: { status?: string; method?: string; page?: number }) {
  const res = await api.get('/admin/payments', { params });
  return res.data;
}

export async function refundPayment(paymentId: string, reason?: string) {
  const res = await api.post(`/admin/payments/${paymentId}/refund`, { reason });
  return res.data;
}

// ===== 구독 관리 =====
export async function extendSubscription(subscriptionId: string, days: number) {
  const res = await api.post(`/admin/subscriptions/${subscriptionId}/extend`, { days });
  return res.data;
}

// ===== 라이선스 관리 =====
export async function issueLicense(userId: string, plan: string) {
  const res = await api.post('/admin/licenses/issue', { userId, plan });
  return res.data;
}

export async function revokeLicense(licenseId: string) {
  const res = await api.patch(`/admin/licenses/${licenseId}/revoke`);
  return res.data;
}

// ===== 시리얼 키 관리 =====
export async function getSerialKeys(params: {
  search?: string;
  plan?: string;
  status?: string;
  page?: number;
}) {
  const res = await api.get('/admin/serials', { params });
  return res.data;
}

export async function createSerialKey(data: {
  plan: string;
  duration?: number;
  companyName?: string;
  isTrial: boolean;
  trialHours?: number;
  memo?: string;
}) {
  const res = await api.post('/admin/serials', data);
  return res.data;
}

export async function updateSerialKey(id: string, data: {
  status?: string;
  durationDays?: number;
  expiresAt?: string;
  companyName?: string;
  memo?: string;
}) {
  const res = await api.put(`/admin/serials/${id}`, data);
  return res.data;
}

export async function deleteSerialKey(id: string) {
  const res = await api.delete(`/admin/serials/${id}`);
  return res.data;
}
