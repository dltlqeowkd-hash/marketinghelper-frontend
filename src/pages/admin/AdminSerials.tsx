// ============================================
// 관리자 - 시리얼 키 관리 페이지
// ============================================

import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  getSerialKeys,
  createSerialKey,
  deleteSerialKey,
} from '../../services/admin.service';

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: '활성', color: 'bg-green-100 text-green-700' },
  USED: { label: '사용됨', color: 'bg-blue-100 text-blue-700' },
  EXPIRED: { label: '만료', color: 'bg-gray-100 text-gray-600' },
  REVOKED: { label: '회수됨', color: 'bg-red-100 text-red-600' },
};

const PLAN_MAP: Record<string, { label: string; color: string }> = {
  LIGHT: { label: 'Light', color: 'bg-sky-100 text-sky-700' },
  PREMIUM: { label: 'Premium', color: 'bg-purple-100 text-purple-700' },
  VIP: { label: 'VIP', color: 'bg-amber-100 text-amber-700' },
  VIP_PRO: { label: 'VIP Pro', color: 'bg-rose-100 text-rose-700' },
};

const DURATION_PRESETS = [
  { label: '30일', value: 30 },
  { label: '90일', value: 90 },
  { label: '365일', value: 365 },
  { label: '평생', value: 36500 },
];

interface SerialKey {
  id: string;
  serialKey: string;
  plan: string;
  status: string;
  durationDays: number | null;
  isTrial: boolean;
  trialHours: number | null;
  companyName: string | null;
  memo: string | null;
  usedByUserId: string | null;
  usedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export default function AdminSerials() {
  // 리스트 상태
  const [serialKeys, setSerialKeys] = useState<SerialKey[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // 검색/필터
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // 복사 상태
  const [copied, setCopied] = useState<string | null>(null);

  // 생성 모달
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({
    plan: 'LIGHT',
    duration: 30,
    companyName: '',
    isTrial: false,
    trialHours: 2,
    memo: '',
  });
  const [isCreating, setIsCreating] = useState(false);

  // 데이터 로드
  const fetchSerialKeys = async (p = page) => {
    setIsLoading(true);
    try {
      const data = await getSerialKeys({
        search: search || undefined,
        plan: planFilter || undefined,
        status: statusFilter || undefined,
        page: p,
      });
      setSerialKeys(data.serialKeys);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err: any) {
      console.error('시리얼 키 목록 조회 실패:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSerialKeys(1);
  }, []);

  // 검색
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchSerialKeys(1);
  };

  // 페이지 변경
  const handlePageChange = (p: number) => {
    setPage(p);
    fetchSerialKeys(p);
  };

  // 키 복사
  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  // 시리얼 키 생성
  const handleCreate = async () => {
    setIsCreating(true);
    try {
      const payload: any = {
        plan: createForm.plan,
        isTrial: createForm.isTrial,
      };

      if (createForm.isTrial) {
        payload.trialHours = createForm.trialHours;
        // trial에도 duration이 필요할 수 있으니 기본값 설정
        payload.duration = 1;
      } else {
        payload.duration = createForm.duration;
      }

      if (createForm.companyName.trim()) {
        payload.companyName = createForm.companyName.trim();
      }
      if (createForm.memo.trim()) {
        payload.memo = createForm.memo.trim();
      }

      const data = await createSerialKey(payload);
      alert(`시리얼 키 생성 완료: ${data.serialKey?.serialKey}`);
      setShowCreate(false);
      setCreateForm({
        plan: 'LIGHT',
        duration: 30,
        companyName: '',
        isTrial: false,
        trialHours: 2,
        memo: '',
      });
      fetchSerialKeys(1);
    } catch (err: any) {
      alert(err.response?.data?.error || '시리얼 키 생성 실패');
    } finally {
      setIsCreating(false);
    }
  };

  // 시리얼 키 회수
  const handleRevoke = async (id: string) => {
    if (!confirm('이 시리얼 키를 회수하시겠습니까?')) return;
    try {
      await deleteSerialKey(id);
      alert('시리얼 키가 회수되었습니다.');
      fetchSerialKeys();
    } catch (err: any) {
      alert(err.response?.data?.error || '회수 실패');
    }
  };

  // 날짜 포맷
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    // 2099년이면 "평생" 표시
    if (d.getFullYear() >= 2099) return '평생';
    return d.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">시리얼 키 관리</h2>
        <button
          onClick={() => setShowCreate(true)}
          className="px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors"
        >
          시리얼 키 생성
        </button>
      </div>

      {/* 검색/필터 */}
      <form onSubmit={handleSearch} className="bg-white rounded-xl border p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="시리얼 키 또는 회사명 검색..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
        />
        <select
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
        >
          <option value="">전체 플랜</option>
          <option value="LIGHT">Light</option>
          <option value="PREMIUM">Premium</option>
          <option value="VIP">VIP</option>
          <option value="VIP_PRO">VIP Pro</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
        >
          <option value="">전체 상태</option>
          <option value="ACTIVE">활성</option>
          <option value="USED">사용됨</option>
          <option value="EXPIRED">만료</option>
          <option value="REVOKED">회수됨</option>
        </select>
        <button
          type="submit"
          className="px-6 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors"
        >
          검색
        </button>
      </form>

      {/* 결과 정보 */}
      <div className="text-sm text-gray-500 mb-3">총 {total}개</div>

      {/* 테이블 */}
      {isLoading ? (
        <div className="text-center py-12 text-gray-400">로딩 중...</div>
      ) : serialKeys.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <p className="text-gray-500">시리얼 키가 없습니다.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">시리얼 키</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">플랜</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">회사명</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">생성일</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">만료일</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">작업</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {serialKeys.map((sk) => {
                  const statusInfo = STATUS_MAP[sk.status] || STATUS_MAP.EXPIRED;
                  const planInfo = PLAN_MAP[sk.plan] || { label: sk.plan, color: 'bg-gray-100 text-gray-600' };
                  return (
                    <tr key={sk.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <code className="font-mono text-sm font-bold text-primary-600">{sk.serialKey}</code>
                          {sk.isTrial && (
                            <span className="px-1.5 py-0.5 text-[10px] bg-yellow-100 text-yellow-700 rounded font-medium">
                              체험판
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${planInfo.color}`}>
                          {planInfo.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${statusInfo.color}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{sk.companyName || '-'}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{formatDate(sk.createdAt)}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{formatDate(sk.expiresAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => copyKey(sk.serialKey)}
                            className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                          >
                            {copied === sk.serialKey ? '복사됨!' : '복사'}
                          </button>
                          {(sk.status === 'ACTIVE' || sk.status === 'USED') && (
                            <button
                              onClick={() => handleRevoke(sk.id)}
                              className="px-3 py-1 text-xs border border-red-300 text-red-600 rounded hover:bg-red-50 transition-colors"
                            >
                              회수
                            </button>
                          )}
                        </div>
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
                  className={`px-3 py-1 text-sm rounded ${
                    p === page
                      ? 'bg-gray-800 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 시리얼 키 생성 모달 */}
      {showCreate && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowCreate(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">시리얼 키 생성</h3>
              <button
                onClick={() => setShowCreate(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {/* 플랜 선택 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">플랜</label>
                <select
                  value={createForm.plan}
                  onChange={(e) => setCreateForm({ ...createForm, plan: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                >
                  <option value="LIGHT">Light</option>
                  <option value="PREMIUM">Premium</option>
                  <option value="VIP">VIP</option>
                  <option value="VIP_PRO">VIP Pro</option>
                </select>
              </div>

              {/* 체험판 여부 */}
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={createForm.isTrial}
                    onChange={(e) =>
                      setCreateForm({ ...createForm, isTrial: e.target.checked })
                    }
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700">체험판</span>
                </label>
              </div>

              {/* 체험판: 시간 입력 / 일반: 기간 입력 */}
              {createForm.isTrial ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    체험 시간
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      max={72}
                      value={createForm.trialHours}
                      onChange={(e) =>
                        setCreateForm({
                          ...createForm,
                          trialHours: Number(e.target.value),
                        })
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                    <span className="text-sm text-gray-500">시간</span>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    유효 기간
                  </label>
                  <div className="flex gap-2 mb-2">
                    {DURATION_PRESETS.map((preset) => (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() =>
                          setCreateForm({ ...createForm, duration: preset.value })
                        }
                        className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                          createForm.duration === preset.value
                            ? 'bg-primary-600 text-white border-primary-600'
                            : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={1}
                      value={createForm.duration}
                      onChange={(e) =>
                        setCreateForm({
                          ...createForm,
                          duration: Number(e.target.value),
                        })
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    />
                    <span className="text-sm text-gray-500">일</span>
                  </div>
                </div>
              )}

              {/* 회사명 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  회사명 <span className="text-gray-400">(선택)</span>
                </label>
                <input
                  type="text"
                  value={createForm.companyName}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, companyName: e.target.value })
                  }
                  placeholder="회사명을 입력하세요"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>

              {/* 메모 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  메모 <span className="text-gray-400">(선택)</span>
                </label>
                <input
                  type="text"
                  value={createForm.memo}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, memo: e.target.value })
                  }
                  placeholder="관리자 메모"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>

              {/* 버튼 */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowCreate(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleCreate}
                  disabled={isCreating}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCreating ? '생성 중...' : '생성'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
