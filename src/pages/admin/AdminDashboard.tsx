// ============================================
// 관리자 대시보드 (통계 개요)
// ============================================

import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getAdminStats } from '../../services/admin.service';

interface Stats {
  totalUsers: number;
  activeSubscriptions: number;
  totalRevenue: number;
  monthlyRevenue: number;
  activeLicenses: number;
  pendingTransfers: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAdminStats()
      .then(setStats)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="text-center py-12 text-gray-400">로딩 중...</div>
      </AdminLayout>
    );
  }

  const cards = [
    {
      label: '전체 사용자',
      value: stats?.totalUsers?.toLocaleString() || '0',
      color: 'bg-blue-500',
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
    },
    {
      label: '활성 구독',
      value: stats?.activeSubscriptions?.toLocaleString() || '0',
      color: 'bg-green-500',
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    },
    {
      label: '총 매출',
      value: `₩${(stats?.totalRevenue || 0).toLocaleString()}`,
      color: 'bg-purple-500',
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    },
    {
      label: '이번 달 매출',
      value: `₩${(stats?.monthlyRevenue || 0).toLocaleString()}`,
      color: 'bg-indigo-500',
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
    },
    {
      label: '활성 라이선스',
      value: stats?.activeLicenses?.toLocaleString() || '0',
      color: 'bg-teal-500',
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>,
    },
    {
      label: '입금 대기',
      value: stats?.pendingTransfers?.toLocaleString() || '0',
      color: 'bg-orange-500',
      icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    },
  ];

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">대시보드</h2>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border p-6 flex items-center gap-4">
            <div className={`${card.color} text-white p-3 rounded-lg`}>
              {card.icon}
            </div>
            <div>
              <div className="text-sm text-gray-500">{card.label}</div>
              <div className="text-2xl font-bold text-gray-800">{card.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 빠른 링크 */}
      <div className="bg-white rounded-xl border p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">빠른 작업</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <a href="/admin/users" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center">
            <div className="text-sm font-medium text-gray-700">사용자 관리</div>
            <div className="text-xs text-gray-400 mt-1">검색, 상태 변경</div>
          </a>
          <a href="/admin/payments" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center">
            <div className="text-sm font-medium text-gray-700">결제 관리</div>
            <div className="text-xs text-gray-400 mt-1">환불, 입금 확인</div>
          </a>
          <a href="/admin/licenses" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center">
            <div className="text-sm font-medium text-gray-700">라이선스 관리</div>
            <div className="text-xs text-gray-400 mt-1">발급, 비활성화</div>
          </a>
          <a href="/admin/serials" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center">
            <div className="text-sm font-medium text-gray-700">시리얼키 관리</div>
            <div className="text-xs text-gray-400 mt-1">생성, 회수</div>
          </a>
          <a href="/dashboard" className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-center">
            <div className="text-sm font-medium text-gray-700">사용자 대시보드</div>
            <div className="text-xs text-gray-400 mt-1">사용자 화면으로</div>
          </a>
        </div>
      </div>
    </AdminLayout>
  );
}
