// ============================================
// 인증 API 서비스
// ============================================

import api from './api';

// 타입 정의
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  emailVerified: boolean;
  avatarUrl: string | null;
  phone?: string;
  oauthProvider?: string | null;
  createdAt?: string;
  lastLoginAt?: string;
  subscriptions?: Array<{
    id: string;
    plan: string;
    status: string;
    startDate: string;
    endDate: string;
    isRecurring: boolean;
  }>;
  licenses?: Array<{
    id: string;
    licenseKey: string;
    plan: string;
    status: string;
    expiresAt: string;
  }>;
}

export interface LoginResponse {
  message: string;
  accessToken: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
  user: { id: string; email: string; name: string };
}

// 회원가입
export async function registerUser(data: {
  email: string;
  password: string;
  name: string;
  phone?: string;
  referralCode?: string;
}): Promise<RegisterResponse> {
  const res = await api.post('/auth/register', data);
  return res.data;
}

// 로그인
export async function loginUser(data: {
  email: string;
  password: string;
}): Promise<LoginResponse> {
  const res = await api.post('/auth/login', data);
  // 액세스 토큰 저장
  localStorage.setItem('accessToken', res.data.accessToken);
  return res.data;
}

// 토큰 갱신
export async function refreshToken(): Promise<{ accessToken: string }> {
  const res = await api.post('/auth/refresh');
  localStorage.setItem('accessToken', res.data.accessToken);
  return res.data;
}

// 로그아웃
export async function logoutUser(): Promise<void> {
  try {
    await api.post('/auth/logout');
  } finally {
    localStorage.removeItem('accessToken');
  }
}

// 내 정보 조회
export async function getMe(): Promise<User> {
  const res = await api.get('/auth/me');
  return res.data.user;
}

// 비밀번호 재설정 요청
export async function forgotPassword(email: string): Promise<void> {
  await api.post('/auth/forgot-password', { email });
}

// 비밀번호 재설정
export async function resetPassword(token: string, password: string): Promise<void> {
  await api.post('/auth/reset-password', { token, password });
}

// Google OAuth URL
export function getGoogleLoginUrl(): string {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return `${apiUrl}/api/auth/google`;
}

// Naver OAuth URL
export function getNaverLoginUrl(): string {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return `${apiUrl}/api/auth/naver`;
}
