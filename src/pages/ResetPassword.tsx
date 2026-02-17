// ============================================
// 비밀번호 재설정 페이지
// URL: /reset-password?token=xxx&email=xxx
// ============================================

import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { resetPassword } from '../services/auth.service';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ password?: string; confirm?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // 토큰이나 이메일이 없으면 에러 표시
  const isInvalidLink = !token || !email;

  // 3초 후 로그인 페이지로 리다이렉트 (성공 시)
  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        navigate('/login?reset=success');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, navigate]);

  const validateForm = (): boolean => {
    const errors: { password?: string; confirm?: string } = {};

    if (password.length < 8) {
      errors.password = '비밀번호는 최소 8자 이상이어야 합니다.';
    } else if (!/(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)) {
      errors.password = '영문, 숫자, 특수문자를 각각 1개 이상 포함해야 합니다.';
    }

    if (password !== confirmPassword) {
      errors.confirm = '비밀번호가 일치하지 않습니다.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await resetPassword(token, password);
      setIsSuccess(true);
    } catch (err: any) {
      const errorMsg = err.response?.data?.error;
      if (errorMsg?.includes('만료') || errorMsg?.includes('유효하지')) {
        setError('비밀번호 재설정 링크가 만료되었거나 유효하지 않습니다. 다시 요청해주세요.');
      } else {
        setError(errorMsg || '비밀번호 재설정 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* 로고 */}
        <div className="text-center mb-8">
          <Link to="/" className="text-3xl font-bold text-primary-600">
            마케팅헬퍼
          </Link>
          <p className="mt-2 text-gray-500">새 비밀번호 설정</p>
        </div>

        {/* 카드 */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {isInvalidLink ? (
            // 유효하지 않은 링크
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">유효하지 않은 링크</h2>
              <p className="text-gray-500 text-sm mb-6">
                비밀번호 재설정 링크가 올바르지 않습니다.<br />
                이메일에서 링크를 다시 클릭하거나 새로 요청해주세요.
              </p>
              <div className="space-y-3">
                <Link
                  to="/forgot-password"
                  className="block w-full py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors text-center"
                >
                  비밀번호 재설정 다시 요청
                </Link>
                <Link
                  to="/login"
                  className="block w-full py-3 text-center text-primary-600 hover:text-primary-700 font-medium"
                >
                  로그인으로 돌아가기
                </Link>
              </div>
            </div>
          ) : isSuccess ? (
            // 성공 상태
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">비밀번호가 변경되었습니다</h2>
              <p className="text-gray-500 text-sm mb-6">
                새로운 비밀번호로 로그인할 수 있습니다.<br />
                잠시 후 로그인 페이지로 이동합니다...
              </p>
              <Link
                to="/login"
                className="block w-full py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors text-center"
              >
                지금 로그인하기
              </Link>
            </div>
          ) : (
            // 비밀번호 재설정 폼
            <div>
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">새 비밀번호 설정</h2>
                <p className="text-gray-500 text-sm">
                  <span className="font-medium text-gray-700">{decodeURIComponent(email)}</span> 계정의<br />
                  새로운 비밀번호를 입력해주세요.
                </p>
              </div>

              {/* 에러 메시지 */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                  {error.includes('만료') && (
                    <Link
                      to="/forgot-password"
                      className="block mt-2 text-primary-600 hover:text-primary-700 font-medium"
                    >
                      다시 요청하기 &rarr;
                    </Link>
                  )}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    새 비밀번호
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    required
                    placeholder="8자 이상, 영문+숫자+특수문자"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all ${
                      fieldErrors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    autoFocus
                  />
                  {fieldErrors.password && (
                    <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    비밀번호 확인
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (fieldErrors.confirm) setFieldErrors((prev) => ({ ...prev, confirm: undefined }));
                    }}
                    required
                    placeholder="비밀번호를 다시 입력하세요"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all ${
                      fieldErrors.confirm ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {fieldErrors.confirm && (
                    <p className="mt-1 text-xs text-red-500">{fieldErrors.confirm}</p>
                  )}
                </div>

                {/* 비밀번호 요구사항 */}
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs font-medium text-gray-600 mb-2">비밀번호 요구사항:</p>
                  <ul className="space-y-1">
                    <li className={`text-xs flex items-center gap-1.5 ${password.length >= 8 ? 'text-green-600' : 'text-gray-400'}`}>
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        {password.length >= 8 ? (
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        ) : (
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                        )}
                      </svg>
                      최소 8자 이상
                    </li>
                    <li className={`text-xs flex items-center gap-1.5 ${/[a-zA-Z]/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        {/[a-zA-Z]/.test(password) ? (
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        ) : (
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                        )}
                      </svg>
                      영문 포함
                    </li>
                    <li className={`text-xs flex items-center gap-1.5 ${/\d/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        {/\d/.test(password) ? (
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        ) : (
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                        )}
                      </svg>
                      숫자 포함
                    </li>
                    <li className={`text-xs flex items-center gap-1.5 ${/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? 'text-green-600' : 'text-gray-400'}`}>
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        {/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) ? (
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        ) : (
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                        )}
                      </svg>
                      특수문자 포함
                    </li>
                  </ul>
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
                    '비밀번호 변경'
                  )}
                </button>
              </form>

              {/* 로그인으로 돌아가기 */}
              <p className="mt-6 text-center text-sm text-gray-500">
                <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                  로그인으로 돌아가기
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
