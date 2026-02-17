// ============================================
// API 클라이언트 (axios 인스턴스)
// 토큰 자동 갱신 인터셉터 포함
// ============================================

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true, // 쿠키 전송 허용 (refreshToken)
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: accessToken 자동 첨부
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터: 401 에러 시 토큰 자동 갱신
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고, 재시도하지 않은 요청인 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      // refresh 요청 자체가 실패한 경우는 로그아웃
      if (originalRequest.url === '/auth/refresh') {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const { data } = await api.post('/auth/refresh');
          const newToken = data.accessToken;
          localStorage.setItem('accessToken', newToken);
          isRefreshing = false;
          onRefreshed(newToken);

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return api(originalRequest);
        } catch {
          isRefreshing = false;
          localStorage.removeItem('accessToken');
          window.location.href = '/login';
          return Promise.reject(error);
        }
      }

      // 다른 요청들은 토큰 갱신 완료까지 대기
      return new Promise((resolve) => {
        refreshSubscribers.push((token: string) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(api(originalRequest));
        });
      });
    }

    return Promise.reject(error);
  }
);

export default api;
