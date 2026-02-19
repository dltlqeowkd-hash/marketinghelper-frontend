// ============================================
// 비밀번호 찾기 페이지
// ============================================

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../services/auth.service';
import SEO from '../components/SEO';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await forgotPassword(email);
      setIsSuccess(true);
    } catch (err: any) {
      setError(
        err.response?.data?.error || '요청 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center px-4">
      <SEO title="비밀번호 찾기" description="마케팅헬퍼 비밀번호를 재설정합니다." noindex={true} />
      <div className="w-full max-w-md">
        {/* 로고 */}
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold text-primary-600">
            마케팅헬퍼
          </Link>
          <p className="mt-2 text-gray-500">비밀번호 재설정</p>
        </div>

        {/* 카드 */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {isSuccess ? (
            // 성공 상태
            <div>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">이메일을 확인해주세요</h2>
                <p className="text-gray-500 text-sm leading-relaxed">
                  <span className="font-medium text-gray-700">{email}</span>으로<br />
                  비밀번호 재설정 링크가 발송되었습니다.
                </p>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-6">
                <p className="text-amber-700 text-sm">
                  이메일이 도착하지 않는 경우 스팸함을 확인해주세요.<br />
                  링크는 1시간 동안 유효합니다.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setIsSuccess(false);
                    setEmail('');
                  }}
                  className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  다른 이메일로 재시도
                </button>
                <Link
                  to="/login"
                  className="block w-full py-3 text-center text-primary-600 hover:text-primary-700 font-medium"
                >
                  로그인으로 돌아가기
                </Link>
              </div>
            </div>
          ) : (
            // 입력 폼
            <div>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">비밀번호를 잊으셨나요?</h2>
                <p className="text-gray-500 text-sm leading-relaxed">
                  가입 시 사용한 이메일을 입력하시면<br />
                  비밀번호 재설정 링크를 보내드립니다.
                </p>
              </div>

              {/* 에러 메시지 */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    이메일
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="example@email.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                    autoFocus
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      처리 중...
                    </span>
                  ) : (
                    '재설정 링크 발송'
                  )}
                </button>
              </form>

              {/* 로그인으로 돌아가기 */}
              <p className="mt-6 text-center text-sm text-gray-500">
                비밀번호가 기억나셨나요?{' '}
                <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                  로그인
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
