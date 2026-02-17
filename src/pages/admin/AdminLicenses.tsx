// ============================================
// 관리자 - 라이선스 관리 페이지
// ============================================

import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getAdminUsers, issueLicense, revokeLicense } from '../../services/admin.service';
import api from '../../services/api';

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: '활성', color: 'bg-green-100 text-green-700' },
  EXPIRED: { label: '만료', color: 'bg-gray-100 text-gray-600' },
  REVOKED: { label: '회수됨', color: 'bg-red-100 text-red-600' },
  SUSPENDED: { label: '정지됨', color: 'bg-orange-100 text-orange-600' },
};

export default function AdminLicenses() {
  const [licenses, setLicenses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  // 수동 발급 모달
  const [showIssue, setShowIssue] = useState(false);
  const [issueUserId, setIssueUserId] = useState('');
  const [issuePlan, setIssuePlan] = useState('MONTHLY');
  const [users, setUsers] = useState<any[]>([]);

  const fetchLicenses = async () => {
    setIsLoading(true);
    try {
      // 전체 라이선스를 가져오기 위해 직접 API 호출
      const res = await api.get('/admin/users', { params: { page: 1 } });
      // 각 유저의 라이선스를 모아서 표시
      const allLicenses: any[] = [];
      for (const user of res.data.users) {
        try {
          const detail = await api.get(`/admin/users/${user.id}`);
          if (detail.data.user.licenses) {
            detail.data.user.licenses.forEach((lic: any) => {
              allLicenses.push({
                ...lic,
                userName: detail.data.user.name,
                userEmail: detail.data.user.email,
                userId: detail.data.user.id,
              });
            });
          }
        } catch { /* 무시 */ }
      }
      setLicenses(allLicenses);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchLicenses(); }, []);

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleRevoke = async (licenseId: string) => {
    if (!confirm('라이선스를 비활성화하시겠습니까?')) return;
    try {
      await revokeLicense(licenseId);
      alert('비활성화 완료');
      fetchLicenses();
    } catch (err: any) {
      alert(err.response?.data?.error || '비활성화 실패');
    }
  };

  const openIssueModal = async () => {
    setShowIssue(true);
    try {
      const data = await getAdminUsers({ page: 1 });
      setUsers(data.users);
    } catch { /* 무시 */ }
  };

  const handleIssue = async () => {
    if (!issueUserId) {
      alert('사용자를 선택하세요.');
      return;
    }
    try {
      const data = await issueLicense(issueUserId, issuePlan);
      alert(`라이선스 발급 완료: ${data.license?.licenseKey}`);
      setShowIssue(false);
      setIssueUserId('');
      fetchLicenses();
    } catch (err: any) {
      alert(err.response?.data?.error || '발급 실패');
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">라이선스 관리</h2>
        <button
          onClick={openIssueModal}
          className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors"
        >
          수동 발급
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-gray-400">로딩 중...</div>
      ) : licenses.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <p className="text-gray-500">라이선스가 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {licenses.map((lic: any) => {
            const status = STATUS_MAP[lic.status] || STATUS_MAP.EXPIRED;
            return (
              <div key={lic.id} className="bg-white rounded-xl border p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-gray-800">{lic.plan} 플랜</span>
                    <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => copyKey(lic.licenseKey)}
                      className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                    >
                      {copied === lic.licenseKey ? '복사됨!' : '키 복사'}
                    </button>
                    {lic.status === 'ACTIVE' && (
                      <button
                        onClick={() => handleRevoke(lic.id)}
                        className="px-3 py-1 text-xs border border-red-300 text-red-600 rounded hover:bg-red-50 transition-colors"
                      >
                        비활성화
                      </button>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <code className="font-mono text-sm font-bold text-primary-600 break-all">{lic.licenseKey}</code>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                  <div>
                    <span className="text-gray-500">사용자</span>
                    <p className="font-medium">{lic.userName || '-'}</p>
                    <p className="text-xs text-gray-400">{lic.userEmail}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">활성화일</span>
                    <p className="font-medium">{new Date(lic.activatedAt).toLocaleDateString('ko-KR')}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">만료일</span>
                    <p className="font-medium">{new Date(lic.expiresAt).toLocaleDateString('ko-KR')}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">기기</span>
                    <p className="font-medium">{lic.machineId ? '등록됨' : '미등록'}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 수동 발급 모달 */}
      {showIssue && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowIssue(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-800 mb-4">라이선스 수동 발급</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">사용자 선택</label>
                <select
                  value={issueUserId}
                  onChange={(e) => setIssueUserId(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                >
                  <option value="">사용자를 선택하세요</option>
                  {users.map((u: any) => (
                    <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">플랜</label>
                <select
                  value={issuePlan}
                  onChange={(e) => setIssuePlan(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                >
                  <option value="WEEKLY">주간</option>
                  <option value="MONTHLY">월간</option>
                  <option value="QUARTERLY">분기</option>
                  <option value="YEARLY">연간</option>
                  <option value="LIFETIME">평생</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowIssue(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleIssue}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
                >
                  발급
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
