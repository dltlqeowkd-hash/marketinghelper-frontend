// ============================================
// 관리자 - 결제 관리 페이지
// ============================================

import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getAdminPayments, refundPayment } from '../../services/admin.service';

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

export default function AdminPayments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchPayments = async (p = page) => {
    setIsLoading(true);
    try {
      const data = await getAdminPayments({
        status: statusFilter || undefined,
        method: methodFilter || undefined,
        page: p,
      });
      setPayments(data.payments);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchPayments(1); }, []);

  const handleFilter = () => {
    setPage(1);
    fetchPayments(1);
  };

  const handlePageChange = (p: number) => {
    setPage(p);
    fetchPayments(p);
  };

  const handleRefund = async (paymentId: string) => {
    const reason = prompt('환불 사유를 입력하세요:', '관리자 환불');
    if (reason === null) return;
    try {
      await refundPayment(paymentId, reason);
      alert('환불 처리 완료');
      fetchPayments();
    } catch (err: any) {
      alert(err.response?.data?.error || '환불 처리 실패');
    }
  };

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">결제 관리</h2>

      {/* 필터 */}
      <div className="bg-white rounded-xl border p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
        >
          <option value="">전체 상태</option>
          <option value="PENDING">대기중</option>
          <option value="COMPLETED">완료</option>
          <option value="FAILED">실패</option>
          <option value="REFUNDED">환불됨</option>
          <option value="CANCELLED">취소됨</option>
        </select>
        <select
          value={methodFilter}
          onChange={(e) => setMethodFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
        >
          <option value="">전체 결제수단</option>
          <option value="TOSS_CARD">카드 결제</option>
          <option value="TOSS_BILLING">정기결제</option>
          <option value="PAYPAL">PayPal</option>
          <option value="BANK_TRANSFER">계좌이체</option>
        </select>
        <button onClick={handleFilter} className="px-6 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors">
          필터 적용
        </button>
      </div>

      <div className="text-sm text-gray-500 mb-3">총 {total}건</div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-400">로딩 중...</div>
      ) : payments.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <p className="text-gray-500">결제 내역이 없습니다.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">일시</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">사용자</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">플랜</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">결제수단</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">금액</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">작업</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {payments.map((p: any) => {
                  const status = STATUS_MAP[p.status] || STATUS_MAP.PENDING;
                  return (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {new Date(p.createdAt).toLocaleDateString('ko-KR')}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="font-medium text-gray-700">{p.user?.name || '-'}</div>
                        <div className="text-xs text-gray-400">{p.user?.email}</div>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">{p.plan}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{METHOD_MAP[p.method] || p.method}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">
                        ₩{p.amountKrw?.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${status.color}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {p.status === 'COMPLETED' && (
                          <button
                            onClick={() => handleRefund(p.id)}
                            className="px-3 py-1 text-xs border border-purple-300 text-purple-600 rounded hover:bg-purple-50 transition-colors"
                          >
                            환불
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 p-4 border-t">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className={`px-3 py-1 text-sm rounded ${p === page ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </AdminLayout>
  );
}
