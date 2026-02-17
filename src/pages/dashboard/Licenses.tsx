// 라이선스 조회 페이지
import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { getMyLicenses } from '../../services/dashboard.service';

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: '활성', color: 'bg-green-100 text-green-700' },
  EXPIRED: { label: '만료', color: 'bg-gray-100 text-gray-600' },
  REVOKED: { label: '회수됨', color: 'bg-red-100 text-red-600' },
  SUSPENDED: { label: '정지됨', color: 'bg-orange-100 text-orange-600' },
};

export default function Licenses() {
  const [licenses, setLicenses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    getMyLicenses()
      .then(setLicenses)
      .finally(() => setIsLoading(false));
  }, []);

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">라이선스</h2>

      {isLoading ? (
        <div className="text-center py-12 text-gray-400">로딩 중...</div>
      ) : licenses.length === 0 ? (
        <div className="bg-white rounded-xl border p-12 text-center">
          <p className="text-gray-500">라이선스가 없습니다. 플랜을 구매하면 자동으로 발급됩니다.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {licenses.map((lic: any) => {
            const status = STATUS_MAP[lic.status] || STATUS_MAP.EXPIRED;
            return (
              <div key={lic.id} className="bg-white rounded-xl border p-6">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="font-bold text-gray-800">{lic.plan} 플랜</h3>
                  <span className={`px-2 py-0.5 text-xs rounded-full font-medium ${status.color}`}>
                    {status.label}
                  </span>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <code className="text-lg font-mono font-bold text-primary-600 break-all">
                      {lic.licenseKey}
                    </code>
                    <button
                      onClick={() => copyKey(lic.licenseKey)}
                      className="ml-3 px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-white transition-colors flex-shrink-0"
                    >
                      {copied === lic.licenseKey ? '복사됨!' : '복사'}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">활성화일</span>
                    <p className="font-medium">{new Date(lic.activatedAt).toLocaleDateString('ko-KR')}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">만료일</span>
                    <p className="font-medium">{new Date(lic.expiresAt).toLocaleDateString('ko-KR')}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">기기 등록</span>
                    <p className="font-medium">{lic.machineId ? '등록됨' : '미등록'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">인증 횟수</span>
                    <p className="font-medium">{lic.checkCount}회</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
