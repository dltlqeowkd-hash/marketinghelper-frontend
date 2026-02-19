import SEO from '../components/SEO';
import { PAGE_SEO } from '../constants/seo';

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <SEO {...PAGE_SEO['/terms']} />
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold mb-8">이용약관</h1>

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold mb-3">제1조 (목적)</h2>
            <p>
              이 약관은 마케팅헬퍼(이하 "회사")가 제공하는 마케팅 자동화 서비스(이하 "서비스")의
              이용 조건 및 절차, 회사와 이용자의 권리·의무 및 책임 사항을 규정함을 목적으로 합니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">제2조 (정의)</h2>
            <ol className="list-decimal ml-5 space-y-1">
              <li>"서비스"란 회사가 제공하는 마케팅 자동화 소프트웨어 및 관련 부가 서비스를 말합니다.</li>
              <li>"이용자"란 이 약관에 따라 회사가 제공하는 서비스를 이용하는 회원을 말합니다.</li>
              <li>"회원"이란 회사에 개인정보를 제공하여 회원등록을 한 자를 말합니다.</li>
              <li>"구독"이란 일정 기간 동안 서비스를 이용할 수 있는 유료 이용권을 말합니다.</li>
              <li>"라이선스"란 서비스 이용을 위해 발급되는 고유 인증키를 말합니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">제3조 (약관의 효력 및 변경)</h2>
            <ol className="list-decimal ml-5 space-y-1">
              <li>이 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력을 발생합니다.</li>
              <li>회사는 관련 법령을 위배하지 않는 범위에서 약관을 개정할 수 있습니다.</li>
              <li>개정 약관은 적용일자 7일 전부터 공지하며, 이용자가 동의하지 않을 경우 서비스 이용을 중단하고 탈퇴할 수 있습니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">제4조 (회원가입)</h2>
            <ol className="list-decimal ml-5 space-y-1">
              <li>이용자는 회사가 정한 절차에 따라 회원가입을 신청합니다.</li>
              <li>회사는 부정한 목적으로 가입을 신청한 경우 승낙을 거절할 수 있습니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">제5조 (서비스 이용)</h2>
            <ol className="list-decimal ml-5 space-y-1">
              <li>서비스는 구독 기간 동안 제공되며, 무료 플랜은 기능이 제한될 수 있습니다.</li>
              <li>회사는 서비스의 안정적 운영을 위해 점검, 업데이트 등의 사유로 서비스를 일시 중단할 수 있습니다.</li>
              <li>이용자는 서비스를 본래의 목적 외 용도로 사용하거나, 제3자에게 양도·대여할 수 없습니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">제6조 (결제 및 환불)</h2>
            <ol className="list-decimal ml-5 space-y-1">
              <li>유료 서비스의 결제는 카드결제, PayPal, 계좌이체를 통해 이루어집니다.</li>
              <li>환불 정책은 별도의 환불정책 페이지를 따릅니다.</li>
              <li>정기결제는 이용자가 직접 해지하지 않는 한 자동으로 갱신됩니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">제7조 (회사의 의무)</h2>
            <ol className="list-decimal ml-5 space-y-1">
              <li>회사는 안정적인 서비스 제공을 위해 최선을 다합니다.</li>
              <li>회사는 이용자의 개인정보를 관련 법령에 따라 보호합니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">제8조 (이용자의 의무)</h2>
            <ol className="list-decimal ml-5 space-y-1">
              <li>이용자는 관계 법령 및 본 약관을 준수해야 합니다.</li>
              <li>이용자는 타인의 정보를 도용하거나 부정 사용해서는 안 됩니다.</li>
              <li>이용자는 서비스를 이용하여 불법 행위를 해서는 안 됩니다.</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">제9조 (면책 조항)</h2>
            <p>
              회사는 천재지변, 전쟁, 해킹 등 불가항력적 사유로 인한 서비스 중단에 대해 책임을 지지 않습니다.
              이용자가 서비스를 이용하여 발생한 손해에 대해 회사의 고의 또는 중과실이 없는 한 책임을 지지 않습니다.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">제10조 (분쟁 해결)</h2>
            <p>
              서비스 이용과 관련하여 발생한 분쟁은 대한민국 법률에 따르며,
              관할 법원은 회사의 소재지를 관할하는 법원으로 합니다.
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
