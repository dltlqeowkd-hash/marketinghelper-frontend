// ============================================
// 프로그램 다운로드 페이지
// 플랜별 프로그램 다운로드 + 설치 안내
// ============================================

import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import DashboardLayout from '../components/dashboard/DashboardLayout';

// 플랜별 다운로드 정보
interface DownloadItem {
  planKey: string;
  planName: string;
  version: string;
  lastUpdated: string;
  fileSize: string;
  description: string;
  downloadUrl: string;
  color: string;
  bgColor: string;
  borderColor: string;
  iconBg: string;
  features: string[];
}

const DOWNLOAD_LIST: DownloadItem[] = [
  {
    planKey: 'LIGHT',
    planName: 'Light',
    version: 'v2.1.0',
    lastUpdated: '2025-01-15',
    fileSize: '85 MB',
    description: '네이버 쇼핑 기본 자동화 도구',
    downloadUrl: '#',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconBg: 'bg-blue-100',
    features: ['네이버 쇼핑 자동화', '키워드 5개', '기본 순위 추적'],
  },
  {
    planKey: 'PREMIUM',
    planName: 'Premium',
    version: 'v2.1.0',
    lastUpdated: '2025-01-15',
    fileSize: '120 MB',
    description: '블로그 포스팅 + 고급 자동화',
    downloadUrl: '#',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    iconBg: 'bg-purple-100',
    features: ['키워드 20개', '블로그 자동 포스팅', '실시간 순위 추적'],
  },
  {
    planKey: 'VIP',
    planName: 'VIP',
    version: 'v2.1.0',
    lastUpdated: '2025-01-15',
    fileSize: '150 MB',
    description: 'AI 콘텐츠 + 프록시 분산 포함',
    downloadUrl: '#',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    iconBg: 'bg-amber-100',
    features: ['키워드 50개', 'AI 콘텐츠 생성', '프록시/IP 분산'],
  },
  {
    planKey: 'VIP_PRO',
    planName: 'VIP Pro',
    version: 'v2.1.0',
    lastUpdated: '2025-01-15',
    fileSize: '180 MB',
    description: '모든 기능 + 평생 업데이트',
    downloadUrl: '#',
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    iconBg: 'bg-rose-100',
    features: ['키워드 무제한', '모든 자동화 기능', '평생 업데이트'],
  },
];

export default function Download() {
  const { user } = useAuth();

  // 현재 구독 중인 플랜 확인
  const activeSub = user?.subscriptions?.find(
    (s) => s.status === 'ACTIVE' || s.status === 'TRIALING'
  );
  const activePlan = activeSub?.plan || null;

  // 플랜 등급 순서 (접근 권한 판단용)
  const planHierarchy: Record<string, number> = {
    LIGHT: 1,
    PREMIUM: 2,
    VIP: 3,
    VIP_PRO: 4,
  };

  const userPlanLevel = activePlan ? (planHierarchy[activePlan] || 0) : 0;

  const hasAccess = (planKey: string): boolean => {
    if (!activePlan) return false;
    const requiredLevel = planHierarchy[planKey] || 0;
    return userPlanLevel >= requiredLevel;
  };

  return (
    <DashboardLayout>
      {/* 페이지 헤더 */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">프로그램 다운로드</h2>
        <p className="text-gray-500 mt-1">
          구독 중인 플랜에 해당하는 프로그램을 다운로드하세요.
        </p>
      </div>

      {/* 현재 구독 상태 배너 */}
      {activePlan ? (
        <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="font-medium text-green-800">
              현재 <span className="font-bold">{activePlan.replace('_', ' ')}</span> 플랜 구독 중
            </p>
            <p className="text-sm text-green-600">
              만료일: {activeSub ? new Date(activeSub.endDate).toLocaleDateString('ko-KR') : '-'}
            </p>
          </div>
        </div>
      ) : (
        <div className="mb-8 p-4 bg-orange-50 border border-orange-200 rounded-xl flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-medium text-orange-800">
              활성화된 구독이 없습니다
            </p>
            <p className="text-sm text-orange-600">
              프로그램을 다운로드하려면 먼저 구독을 시작해주세요.
            </p>
          </div>
          <Link
            to="/payment"
            className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors flex-shrink-0"
          >
            구독 시작
          </Link>
        </div>
      )}

      {/* 다운로드 카드 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {DOWNLOAD_LIST.map((item) => {
          const accessible = hasAccess(item.planKey);

          return (
            <div
              key={item.planKey}
              className={`relative bg-white rounded-xl shadow-sm border overflow-hidden transition-all ${
                accessible ? 'hover:shadow-md' : 'opacity-75'
              }`}
            >
              {/* 상단 컬러 바 */}
              <div className={`h-1.5 ${item.bgColor}`} style={{
                background: item.planKey === 'LIGHT' ? '#3b82f6' :
                             item.planKey === 'PREMIUM' ? '#9333ea' :
                             item.planKey === 'VIP' ? '#d97706' : '#e11d48'
              }} />

              <div className="p-6">
                {/* 플랜 이름 + 뱃지 */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${item.iconBg} rounded-lg flex items-center justify-center`}>
                      <svg className={`w-5 h-5 ${item.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        마케팅헬퍼 {item.planName}
                      </h3>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                  </div>
                  {!accessible && (
                    <span className="px-2.5 py-1 bg-gray-100 text-gray-500 text-xs font-medium rounded-full whitespace-nowrap">
                      구독 필요
                    </span>
                  )}
                  {accessible && (
                    <span className="px-2.5 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full whitespace-nowrap">
                      다운로드 가능
                    </span>
                  )}
                </div>

                {/* 버전 정보 */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-400">버전</p>
                    <p className="text-sm font-medium text-gray-700">{item.version}</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-400">업데이트</p>
                    <p className="text-sm font-medium text-gray-700">{item.lastUpdated}</p>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <p className="text-xs text-gray-400">파일 크기</p>
                    <p className="text-sm font-medium text-gray-700">{item.fileSize}</p>
                  </div>
                </div>

                {/* 포함 기능 */}
                <div className="mb-4">
                  <p className="text-xs text-gray-400 mb-2">주요 기능</p>
                  <div className="flex flex-wrap gap-2">
                    {item.features.map((feature) => (
                      <span
                        key={feature}
                        className={`px-2 py-1 text-xs rounded-md ${item.bgColor} ${item.color}`}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* 시스템 요구사항 */}
                <div className="mb-5">
                  <p className="text-xs text-gray-400 mb-1">시스템 요구사항</p>
                  <p className="text-xs text-gray-500">
                    Windows 10 이상 / RAM 4GB 이상 / .NET Framework 4.8
                  </p>
                </div>

                {/* 다운로드 버튼 */}
                {accessible ? (
                  <a
                    href={item.downloadUrl}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    다운로드 ({item.fileSize})
                  </a>
                ) : (
                  <Link
                    to="/payment"
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 text-gray-500 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    구독 후 다운로드
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 설치 안내 */}
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
          <svg className="w-5 h-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          설치 안내
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 설치 단계 */}
          <div>
            <h4 className="font-medium text-gray-700 mb-3">설치 방법</h4>
            <ol className="space-y-3">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-700">프로그램 다운로드</p>
                  <p className="text-xs text-gray-400">위 카드에서 구독 플랜에 맞는 프로그램을 다운로드하세요.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-700">설치 파일 실행</p>
                  <p className="text-xs text-gray-400">다운로드된 .exe 파일을 실행하여 설치를 진행하세요.</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-700">라이선스 키 입력</p>
                  <p className="text-xs text-gray-400">
                    프로그램 실행 후 대시보드의{' '}
                    <Link to="/dashboard/licenses" className="text-primary-600 hover:underline">
                      라이선스 키
                    </Link>
                    를 입력하세요.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-700">사용 시작</p>
                  <p className="text-xs text-gray-400">인증 완료 후 바로 마케팅 자동화를 시작할 수 있습니다.</p>
                </div>
              </li>
            </ol>
          </div>

          {/* 시스템 요구사항 상세 */}
          <div>
            <h4 className="font-medium text-gray-700 mb-3">시스템 요구사항</h4>
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-700">운영 체제</p>
                  <p className="text-xs text-gray-500">Windows 10 / 11 (64bit)</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-700">메모리 (RAM)</p>
                  <p className="text-xs text-gray-500">최소 4GB / 권장 8GB 이상</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-700">저장 공간</p>
                  <p className="text-xs text-gray-500">최소 500MB 여유 공간</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-700">필수 소프트웨어</p>
                  <p className="text-xs text-gray-500">.NET Framework 4.8 이상</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-700">네트워크</p>
                  <p className="text-xs text-gray-500">안정적인 인터넷 연결 필요</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 주의사항 */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 mb-8">
        <h4 className="font-medium text-yellow-800 mb-2 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          설치 시 주의사항
        </h4>
        <ul className="text-sm text-yellow-700 space-y-1.5 ml-7">
          <li>Windows SmartScreen 경고가 나타날 수 있습니다. "추가 정보" 클릭 후 "실행"을 눌러주세요.</li>
          <li>백신 프로그램이 오탐지할 경우, 예외 처리를 추가해주세요.</li>
          <li>설치 경로에 한글이나 특수문자가 포함되지 않도록 해주세요.</li>
          <li>프로그램 실행 시 관리자 권한이 필요할 수 있습니다.</li>
          <li>라이선스 키 1개당 PC 1대에서만 사용 가능합니다.</li>
        </ul>
      </div>

      {/* 도움말 */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h4 className="font-medium text-gray-800 mb-3">문제가 있으신가요?</h4>
        <p className="text-sm text-gray-500 mb-4">
          설치 또는 실행에 문제가 있으시면 아래 방법으로 문의해주세요.
        </p>
        <div className="flex flex-wrap gap-3">
          <a
            href="mailto:support@partnerchain.co.kr"
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            이메일 문의
          </a>
          <a
            href="https://open.kakao.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            카카오톡 상담
          </a>
        </div>
      </div>
    </DashboardLayout>
  );
}
