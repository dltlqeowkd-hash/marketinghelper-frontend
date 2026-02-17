// 계정 설정 페이지
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { updateProfile, changePassword } from '../../services/dashboard.service';

export default function Settings() {
  const { user, refreshUser } = useAuth();

  // 프로필 수정
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileMsg, setProfileMsg] = useState('');

  // 비밀번호 변경
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [pwError, setPwError] = useState('');

  const handleProfileSave = async () => {
    try {
      await updateProfile({ name, phone });
      await refreshUser();
      setProfileMsg('프로필이 수정되었습니다.');
      setTimeout(() => setProfileMsg(''), 3000);
    } catch (err: any) {
      setProfileMsg(err.response?.data?.error || '수정에 실패했습니다.');
    }
  };

  const handlePasswordChange = async () => {
    setPwError('');
    setPwMsg('');

    if (newPw !== confirmPw) {
      setPwError('새 비밀번호가 일치하지 않습니다.');
      return;
    }
    if (newPw.length < 8) {
      setPwError('비밀번호는 최소 8자 이상이어야 합니다.');
      return;
    }

    try {
      await changePassword(currentPw, newPw);
      setPwMsg('비밀번호가 변경되었습니다.');
      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
      setTimeout(() => setPwMsg(''), 3000);
    } catch (err: any) {
      setPwError(err.response?.data?.error || '비밀번호 변경에 실패했습니다.');
    }
  };

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">계정 설정</h2>

      <div className="space-y-8 max-w-2xl">
        {/* 프로필 수정 */}
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">프로필 정보</h3>

          {profileMsg && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
              {profileMsg}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">이메일은 변경할 수 없습니다.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="010-1234-5678"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>

            <button
              onClick={handleProfileSave}
              className="px-6 py-2.5 bg-primary-600 text-white rounded-lg text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              저장
            </button>
          </div>
        </div>

        {/* 비밀번호 변경 */}
        {!user?.oauthProvider && (
          <div className="bg-white rounded-xl border p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">비밀번호 변경</h3>

            {pwMsg && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-600 text-sm">
                {pwMsg}
              </div>
            )}
            {pwError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                {pwError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">현재 비밀번호</label>
                <input
                  type="password"
                  value={currentPw}
                  onChange={(e) => setCurrentPw(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">새 비밀번호</label>
                <input
                  type="password"
                  value={newPw}
                  onChange={(e) => setNewPw(e.target.value)}
                  placeholder="영문, 숫자, 특수문자 포함 8자 이상"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">새 비밀번호 확인</label>
                <input
                  type="password"
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
              <button
                onClick={handlePasswordChange}
                className="px-6 py-2.5 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors"
              >
                비밀번호 변경
              </button>
            </div>
          </div>
        )}

        {/* 계정 정보 */}
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">계정 정보</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">가입일</span>
              <span className="text-gray-700">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ko-KR') : '-'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">마지막 로그인</span>
              <span className="text-gray-700">
                {user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString('ko-KR') : '-'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">로그인 방식</span>
              <span className="text-gray-700">{user?.oauthProvider || '이메일'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">이메일 인증</span>
              <span className={user?.emailVerified ? 'text-green-600' : 'text-orange-500'}>
                {user?.emailVerified ? '완료' : '미완료'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
