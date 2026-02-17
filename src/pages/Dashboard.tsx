// ============================================
// 대시보드 - 개요 페이지
// ============================================

import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import DashboardLayout from '../components/dashboard/DashboardLayout';

export default function Dashboard() {
  const { user } = useAuth();

  const sub = user?.subscriptions?.[0];
  const license = user?.licenses?.[0];

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        안녕하세요, {user?.name}님!
      </h2>

      {/* 상태 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* 구독 상태 */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-500">구독 상태</h3>
            <Link to="/dashboard/subscription" className="text-xs text-primary-600 hover:text-primary-700">관리</Link>
          </div>
          {sub ? (
            <>
              <p className="text-2xl font-bold text-primary-600">{sub.plan}</p>
              <p className="text-sm text-gray-500 mt-1">
                {new Date(sub.endDate).toLocaleDateString('ko-KR')}까지
              </p>
              <div className="mt-3">
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  활성
                </span>
              </div>
            </>
          ) : (
            <>
              <p className="text-2xl font-bold text-gray-400">무료</p>
              <p className="text-sm text-gray-500 mt-1">구독을 시작해보세요</p>
              <Link
                to="/payment"
                className="mt-3 inline-block px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors"
              >
                구독 시작
              </Link>
            </>
          )}
        </div>

        {/* 라이선스 */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-500">라이선스</h3>
            <Link to="/dashboard/licenses" className="text-xs text-primary-600 hover:text-primary-700">상세</Link>
          </div>
          {license ? (
            <>
              <p className="text-base font-mono font-bold text-green-600 break-all">
                {license.licenseKey}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                만료: {new Date(license.expiresAt).toLocaleDateString('ko-KR')}
              </p>
              <button
                onClick={() => navigator.clipboard.writeText(license.licenseKey)}
                className="mt-3 px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                키 복사
              </button>
            </>
          ) : (
            <>
              <p className="text-lg font-bold text-gray-400">없음</p>
              <p className="text-sm text-gray-500 mt-1">결제 후 자동 발급됩니다</p>
            </>
          )}
        </div>

        {/* 계정 정보 */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-500">계정 정보</h3>
            <Link to="/dashboard/settings" className="text-xs text-primary-600 hover:text-primary-700">설정</Link>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">이메일 인증</span>
              <span className={user?.emailVerified ? 'text-green-600 font-medium' : 'text-orange-500 font-medium'}>
                {user?.emailVerified ? '완료' : '미완료'}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">로그인 방식</span>
              <span className="text-gray-700">{user?.oauthProvider || '이메일'}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">역할</span>
              <span className={user?.role === 'ADMIN' ? 'text-red-600 font-medium' : 'text-gray-700'}>
                {user?.role === 'ADMIN' ? '관리자' : '일반'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 빠른 액션 */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">빠른 시작</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            to="/payment"
            className="p-4 border border-gray-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition-all text-center"
          >
            <div className="text-2xl mb-2">💳</div>
            <div className="font-medium text-gray-800">플랜 구매</div>
            <div className="text-sm text-gray-500 mt-1">구독 시작 또는 업그레이드</div>
          </Link>
          <Link
            to="/download"
            className="p-4 border border-gray-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition-all text-center"
          >
            <div className="text-2xl mb-2">📥</div>
            <div className="font-medium text-gray-800">프로그램 다운로드</div>
            <div className="text-sm text-gray-500 mt-1">마케팅헬퍼 설치</div>
          </Link>
          <Link
            to="/guide"
            className="p-4 border border-gray-200 rounded-xl hover:border-primary-300 hover:bg-primary-50 transition-all text-center"
          >
            <div className="text-2xl mb-2">📖</div>
            <div className="font-medium text-gray-800">사용 가이드</div>
            <div className="text-sm text-gray-500 mt-1">시작하기 튜토리얼</div>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
