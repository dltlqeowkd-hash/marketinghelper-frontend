// 결제 내역 페이지
import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { getMyPayments } from '../../services/dashboard.service';

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  PENDING: { label: '대기중', color: 'bg-yellow-100 text-yellow-700' },
  COMPLETED: { label: '완료', color: 'bg-green-100 text-green-700' },
  FAILED: { label: '실패', color: 'bg-red-100 text-red-600' },
  REFUNDED: { label: '환불됨', color: 'bg-purple-100 text-purple-600' },
  CANCELLED: { label: '취소됨', color: 'bg-gray-100 text-gray-600' },
};

const METHOD_MAP: Record<string, string> = {
  TOSS_CARD: '카드 결제',
  TOSS_BILLING: '정기결제',
  PAYPAL: 'PayPal',
  BANK_TRANSFER: '계좌이체',
};

export default function Billing() {
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getMyPayments()
      .then(setPayments)
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">결제 내역</h2>

      {isLoading ? (
        <div className="text-center py-12 text-gray-400">로딩 중...</div>
      ) : payments.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <p className="text-gray-500">결제 내역이 없습니다.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          {/* 데스크톱 테이블 */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">일시</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">플랜</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">결제수단</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">금액</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payments.map((p: any) => {
                  const status = STATUS_MAP[p.status] || STATUS_MAP.PENDING;
                  return (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {new Date(p.createdAt).toLocaleDateString('ko-KR')}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">{p.plan}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{METHOD_MAP[p.method] || p.method}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">
                        ₩{p.amountKrw?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 모바일 카드 */}
          <div className="md:hidden divide-y divide-gray-100">
            {payments.map((p: any) => {
              const status = STATUS_MAP[p.status] || STATUS_MAP.PENDING;
              return (
                <div key={p.id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-800">{p.plan}</span>
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{METHOD_MAP[p.method] || p.method}</span>
                    <span className="font-medium text-gray-800">₩{p.amountKrw?.toLocaleString()}</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(p.createdAt).toLocaleDateString('ko-KR')}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
