export default function Refund() {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-3xl font-bold mb-8">환불정책</h1>

        <div className="space-y-6 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold mb-3">1. 환불 가능 기간</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300 text-sm">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 text-left">구분</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">환불 조건</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">환불 금액</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">결제 후 7일 이내</td>
                    <td className="border border-gray-300 px-4 py-2">서비스 미사용 시</td>
                    <td className="border border-gray-300 px-4 py-2">전액 환불</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">결제 후 7일 이내</td>
                    <td className="border border-gray-300 px-4 py-2">서비스 사용 시</td>
                    <td className="border border-gray-300 px-4 py-2">잔여 기간 일할 계산 환불</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">결제 후 7일 초과</td>
                    <td className="border border-gray-300 px-4 py-2">-</td>
                    <td className="border border-gray-300 px-4 py-2">잔여 기간 일할 계산 환불</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">평생 플랜</td>
                    <td className="border border-gray-300 px-4 py-2">결제 후 14일 이내, 미사용 시</td>
                    <td className="border border-gray-300 px-4 py-2">전액 환불</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">평생 플랜</td>
                    <td className="border border-gray-300 px-4 py-2">결제 후 14일 초과 또는 사용 시</td>
                    <td className="border border-gray-300 px-4 py-2">환불 불가</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">2. 환불 절차</h2>
            <ol className="list-decimal ml-5 space-y-1">
              <li>대시보드 &gt; 구독관리에서 환불 요청 또는 고객센터로 연락</li>
              <li>환불 사유 확인 후 영업일 기준 3~5일 내 처리</li>
              <li>카드결제: 카드사를 통한 취소 (영업일 3~7일 소요)</li>
              <li>PayPal: PayPal 계정으로 환불 (영업일 3~5일 소요)</li>
              <li>계좌이체: 입금 계좌로 환불 (영업일 3~5일 소요)</li>
            </ol>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">3. 환불 불가 사유</h2>
            <ul className="list-disc ml-5 space-y-1">
              <li>이용약관 위반으로 인한 서비스 이용 정지</li>
              <li>라이선스 키를 제3자에게 양도 또는 공유한 경우</li>
              <li>서비스를 부정한 목적으로 사용한 경우</li>
              <li>환불 가능 기간을 초과한 평생 플랜</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">4. 정기결제 해지</h2>
            <ul className="list-disc ml-5 space-y-1">
              <li>정기결제는 대시보드 &gt; 구독관리에서 직접 해지할 수 있습니다.</li>
              <li>해지 후 남은 구독 기간까지 서비스를 이용할 수 있습니다.</li>
              <li>다음 결제 예정일 전에 해지하면 추가 결제가 발생하지 않습니다.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-3">5. 문의</h2>
            <p>
              환불 관련 문의는 아래로 연락해주세요.
            </p>
            <ul className="list-none mt-2 space-y-1">
              <li>이메일: support@marketinghelper.co.kr</li>
              <li>처리 시간: 평일 09:00 ~ 18:00 (공휴일 제외)</li>
            </ul>
          </section>

          <p className="text-sm text-gray-500 mt-8">
            시행일: 2026년 2월 12일
          </p>
        </div>
      </div>
    </div>
  );
}
