// 구독 관리 페이지
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { getMySubscriptions, cancelSubscription } from '../../services/dashboard.service';

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: '활성', color: 'bg-green-100 text-green-700' },
  EXPIRED: { label: '만료', color: 'bg-gray-100 text-gray-600' },
  CANCELLED: { label: '취소됨', color: 'bg-red-100 text-red-600' },
  SUSPENDED: { label: '정지됨', color: 'bg-orange-100 text-orange-600' },
};

export default function Subscription() {
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getMySubscriptions()
      .then(setSubscriptions)
      .finally(() => setIsLoading(false));
  }, []);

  const handleCancel = async (id: string) => {
    if (!confirm('정말 구독을 취소하시겠습니까? 남은 기간까지는 계속 이용 가능합니다.')) return;
    try {
      await cancelSubscription(id);
      const updated = await getMySubscriptions();
      setSubscriptions(updated);
    } catch (err: any) {
      alert(err.response?.data?.error || '구독 취소에 실패했습니다.');
    }
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">구독 관리</h2>
        <Link to="/payment" className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors">
          플랜 구매 / 업그레이드
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-400">로딩 중...</div>
      ) : subscriptions.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <p className="text-gray-500 mb-4">구독 내역이 없습니다.</p>
          <Link to="/payment" className="text-primary-600 font-medium hover:text-primary-700">플랜 구매하기</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {subscriptions.map((sub: any) => {
            const status = STATUS_MAP[sub.status] || STATUS_MAP.EXPIRED;
            return (
              <div key={sub.id} className="bg-white rounded-xl border p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-800">{sub.plan} 플랜</h3>
                      <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 space-y-1">
                      <p>시작: {new Date(sub.startDate).toLocaleDateString('ko-KR')}</p>
                      <p>만료: {new Date(sub.endDate).toLocaleDateString('ko-KR')}</p>
                      {sub.isRecurring && sub.nextBillingDate && (
                        <p>다음 결제: {new Date(sub.nextBillingDate).toLocaleDateString('ko-KR')}</p>
                      )}
                      <p>금액: ₩{sub.priceKrw?.toLocaleString()}</p>
                    </div>
                  </div>
                  {sub.status === 'ACTIVE' && (
                    <button
                      onClick={() => handleCancel(sub.id)}
                      className="px-4 py-2 text-sm border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      구독 취소
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
