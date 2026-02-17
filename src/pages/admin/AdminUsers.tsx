// ============================================
// 관리자 - 사용자 관리 페이지
// ============================================

import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  getAdminUsers,
  getAdminUserDetail,
  toggleUserStatus,
  extendSubscription,
  issueLicense,
  revokeLicense,
} from '../../services/admin.service';

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // 유저 상세 모달
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);

  const fetchUsers = async (p = page) => {
    setIsLoading(true);
    try {
      const data = await getAdminUsers({ search: search || undefined, role: roleFilter || undefined, page: p });
      setUsers(data.users);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchUsers(1); }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers(1);
  };

  const handlePageChange = (p: number) => {
    setPage(p);
    fetchUsers(p);
  };

  const handleToggleStatus = async (userId: string) => {
    if (!confirm('사용자 상태를 변경하시겠습니까?')) return;
    try {
      await toggleUserStatus(userId);
      fetchUsers();
    } catch (err: any) {
      alert(err.response?.data?.error || '상태 변경 실패');
    }
  };

  const openDetail = async (userId: string) => {
    setDetailLoading(true);
    setShowDetail(true);
    try {
      const data = await getAdminUserDetail(userId);
      setSelectedUser(data.user);
    } finally {
      setDetailLoading(false);
    }
  };

  // 구독 연장
  const handleExtend = async (subId: string) => {
    const days = prompt('연장할 일수를 입력하세요:', '30');
    if (!days) return;
    try {
      await extendSubscription(subId, Number(days));
      alert(`${days}일 연장 완료`);
      if (selectedUser) openDetail(selectedUser.id);
    } catch (err: any) {
      alert(err.response?.data?.error || '연장 실패');
    }
  };

  // 라이선스 수동 발급
  const handleIssueLicense = async (userId: string) => {
    const plan = prompt('플랜을 입력하세요 (WEEKLY, MONTHLY, QUARTERLY, YEARLY, LIFETIME):', 'MONTHLY');
    if (!plan) return;
    try {
      const data = await issueLicense(userId, plan);
      alert(`라이선스 발급 완료: ${data.license?.licenseKey}`);
      openDetail(userId);
    } catch (err: any) {
      alert(err.response?.data?.error || '발급 실패');
    }
  };

  // 라이선스 비활성화
  const handleRevokeLicense = async (licenseId: string) => {
    if (!confirm('라이선스를 비활성화하시겠습니까?')) return;
    try {
      await revokeLicense(licenseId);
      alert('비활성화 완료');
      if (selectedUser) openDetail(selectedUser.id);
    } catch (err: any) {
      alert(err.response?.data?.error || '비활성화 실패');
    }
  };

  return (
    <AdminLayout>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">사용자 관리</h2>

      {/* 검색/필터 */}
      <form onSubmit={handleSearch} className="bg-white rounded-xl border p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="이메일 또는 이름 검색..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
        >
          <option value="">전체 역할</option>
          <option value="USER">일반 사용자</option>
          <option value="ADMIN">관리자</option>
        </select>
        <button type="submit" className="px-6 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors">
          검색
        </button>
      </form>

      {/* 결과 정보 */}
      <div className="text-sm text-gray-500 mb-3">총 {total}명</div>

      {/* 테이블 */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-400">로딩 중...</div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">이메일</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">이름</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">역할</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">구독</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">가입일</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">작업</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u: any) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-700">{u.email}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{u.name || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${u.role === 'ADMIN' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
                        {u.role === 'ADMIN' ? '관리자' : '사용자'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                        {u.isActive ? '활성' : '비활성'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{u._count?.subscriptions || 0}건</td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openDetail(u.id)}
                          className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                        >
                          상세
                        </button>
                        <button
                          onClick={() => handleToggleStatus(u.id)}
                          className={`px-3 py-1 text-xs rounded transition-colors ${
                            u.isActive
                              ? 'border border-red-300 text-red-600 hover:bg-red-50'
                              : 'border border-green-300 text-green-600 hover:bg-green-50'
                          }`}
                        >
                          {u.isActive ? '비활성화' : '활성화'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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

      {/* 유저 상세 모달 */}
      {showDetail && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowDetail(false)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {detailLoading ? (
              <div className="p-12 text-center text-gray-400">로딩 중...</div>
            ) : selectedUser ? (
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800">사용자 상세</h3>
                  <button onClick={() => setShowDetail(false)} className="text-gray-400 hover:text-gray-600">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                {/* 기본 정보 */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span className="text-gray-500">이메일:</span> <span className="font-medium">{selectedUser.email}</span></div>
                    <div><span className="text-gray-500">이름:</span> <span className="font-medium">{selectedUser.name || '-'}</span></div>
                    <div><span className="text-gray-500">역할:</span> <span className="font-medium">{selectedUser.role}</span></div>
                    <div><span className="text-gray-500">상태:</span> <span className={`font-medium ${selectedUser.isActive ? 'text-green-600' : 'text-red-600'}`}>{selectedUser.isActive ? '활성' : '비활성'}</span></div>
                    <div><span className="text-gray-500">가입일:</span> <span className="font-medium">{new Date(selectedUser.createdAt).toLocaleDateString('ko-KR')}</span></div>
                    <div><span className="text-gray-500">로그인:</span> <span className="font-medium">{selectedUser.oauthProvider || '이메일'}</span></div>
                  </div>
                </div>

                {/* 구독 */}
                <div className="mb-4">
                  <h4 className="font-bold text-gray-700 mb-2">구독 ({selectedUser.subscriptions?.length || 0})</h4>
                  {selectedUser.subscriptions?.length > 0 ? (
                    <div className="space-y-2">
                      {selectedUser.subscriptions.map((sub: any) => (
                        <div key={sub.id} className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                          <div className="text-sm">
                            <span className="font-medium">{sub.plan}</span>
                            <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${sub.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                              {sub.status}
                            </span>
                            <span className="text-gray-400 ml-2">
                              ~{new Date(sub.endDate).toLocaleDateString('ko-KR')}
                            </span>
                          </div>
                          {sub.status === 'ACTIVE' && (
                            <button onClick={() => handleExtend(sub.id)} className="px-3 py-1 text-xs border border-blue-300 text-blue-600 rounded hover:bg-blue-50">
                              연장
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">구독 없음</p>
                  )}
                </div>

                {/* 라이선스 */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-gray-700">라이선스 ({selectedUser.licenses?.length || 0})</h4>
                    <button
                      onClick={() => handleIssueLicense(selectedUser.id)}
                      className="px-3 py-1 text-xs bg-primary-600 text-white rounded hover:bg-primary-700"
                    >
                      수동 발급
                    </button>
                  </div>
                  {selectedUser.licenses?.length > 0 ? (
                    <div className="space-y-2">
                      {selectedUser.licenses.map((lic: any) => (
                        <div key={lic.id} className="bg-gray-50 rounded-lg p-3 flex items-center justify-between">
                          <div className="text-sm">
                            <code className="font-mono text-xs">{lic.licenseKey}</code>
                            <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${lic.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                              {lic.status}
                            </span>
                          </div>
                          {lic.status === 'ACTIVE' && (
                            <button onClick={() => handleRevokeLicense(lic.id)} className="px-3 py-1 text-xs border border-red-300 text-red-600 rounded hover:bg-red-50">
                              비활성화
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">라이선스 없음</p>
                  )}
                </div>

                {/* 결제 내역 */}
                <div>
                  <h4 className="font-bold text-gray-700 mb-2">결제 내역 ({selectedUser.payments?.length || 0})</h4>
                  {selectedUser.payments?.length > 0 ? (
                    <div className="space-y-2">
                      {selectedUser.payments.slice(0, 5).map((pay: any) => (
                        <div key={pay.id} className="bg-gray-50 rounded-lg p-3 flex items-center justify-between text-sm">
                          <div>
                            <span className="font-medium">{pay.plan}</span>
                            <span className="text-gray-400 ml-2">₩{pay.amountKrw?.toLocaleString()}</span>
                            <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${pay.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : pay.status === 'REFUNDED' ? 'bg-purple-100 text-purple-600' : 'bg-yellow-100 text-yellow-700'}`}>
                              {pay.status}
                            </span>
                          </div>
                          <span className="text-gray-400 text-xs">
                            {new Date(pay.createdAt).toLocaleDateString('ko-KR')}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">결제 내역 없음</p>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
