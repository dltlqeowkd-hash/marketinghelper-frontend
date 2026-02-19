export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold mb-8">개인정보처리방침</h1>

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. 개인정보 수집 항목</h2>
            <p className="mb-2">회사는 서비스 제공을 위해 다음의 개인정보를 수집합니다.</p>
            <ul className="list-disc ml-5 space-y-1">
              <li><strong>필수 항목:</strong> 이메일, 이름, 비밀번호(암호화 저장)</li>
              <li><strong>선택 항목:</strong> 전화번호, 프로필 이미지</li>
              <li><strong>자동 수집:</strong> IP 주소, 접속 브라우저 정보, 접속 일시</li>
              <li><strong>결제 시:</strong> 결제 수단 정보(카드사/PayPal 처리, 회사 미보관)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. 개인정보 수집 목적</h2>
            <ul className="list-disc ml-5 space-y-1">
              <li>회원 가입, 본인 확인, 서비스 제공</li>
              <li>구독 및 결제 처리, 라이선스 발급</li>
              <li>고객 문의 응대 및 공지사항 전달</li>
              <li>서비스 개선 및 통계 분석 (비식별 처리)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. 개인정보 보유 및 이용 기간</h2>
            <ul className="list-disc ml-5 space-y-1">
              <li><strong>회원 정보:</strong> 회원 탈퇴 시까지 (탈퇴 후 즉시 파기)</li>
              <li><strong>결제 기록:</strong> 전자상거래법에 따라 5년 보관</li>
              <li><strong>접속 기록:</strong> 통신비밀보호법에 따라 3개월 보관</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. 개인정보 제3자 제공</h2>
            <p>
              회사는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다.
              다만, 다음의 경우에는 예외로 합니다.
            </p>
            <ul className="list-disc ml-5 space-y-1">
              <li>이용자가 사전에 동의한 경우</li>
              <li>법령에 의해 요구되는 경우</li>
              <li>결제 처리를 위한 PG사(토스페이먼츠, PayPal) 전달</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. 개인정보 보호 조치</h2>
            <ul className="list-disc ml-5 space-y-1">
              <li>비밀번호 bcrypt 암호화 저장</li>
              <li>HTTPS(TLS) 통신 암호화</li>
              <li>JWT 토큰 기반 인증, httpOnly 쿠키</li>
              <li>API Rate Limiting으로 무차별 공격 방지</li>
              <li>데이터베이스 접근 권한 최소화</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">6. 이용자의 권리</h2>
            <p>이용자는 언제든지 다음의 권리를 행사할 수 있습니다.</p>
            <ul className="list-disc ml-5 space-y-1">
              <li>개인정보 열람, 정정, 삭제 요청</li>
              <li>개인정보 처리 정지 요청</li>
              <li>회원 탈퇴를 통한 개인정보 삭제</li>
            </ul>
            <p className="mt-2">위 요청은 계정 설정 페이지 또는 고객센터를 통해 가능합니다.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">7. 개인정보 보호 책임자</h2>
            <ul className="list-none space-y-1">
              <li>담당: 개인정보 보호 담당자</li>
              <li>이메일: dltlqeowkd@gmail.com</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">8. 방침 변경</h2>
            <p>
              본 방침은 관련 법령 또는 서비스 변경에 따라 수정될 수 있으며,
              변경 시 서비스 내 공지사항을 통해 안내합니다.
            </p>
          </section>

          <p className="text-sm text-gray-500 mt-8">
            시행일: 2026년 2월 12일
          </p>
        </div>
      </div>
    </div>
  );
}
