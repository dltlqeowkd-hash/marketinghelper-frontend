// ============================================
// 가격 플랜 상수 (프론트엔드용)
// ============================================

export interface PlanFeature {
  text: string;
  included: boolean;
}

export interface PlanDisplay {
  key: string;
  nameKo: string;
  nameEn: string;
  priceKrw: number;       // 정가 (2개월차부터)
  discountedKrw: number;  // 첫 달 할인가
  priceUsd: number;
  discountedUsd: number;
  discountRate: string;
  period: string;
  isRecurring: boolean;
  isPopular?: boolean;
  isLifetime?: boolean;
  isIntroOffer?: boolean; // 첫 달 한정 할인
  keywords: number | '무제한';
  features: PlanFeature[];
  color: string;
}

export const FREE_TRIAL = {
  nameKo: '무료 체험',
  nameEn: 'Free Trial',
  duration: '2시간',
  features: 'Light 기능 체험',
  keywords: 5,
};

export const PLAN_LIST: PlanDisplay[] = [
  {
    key: 'LIGHT',
    nameKo: 'Light',
    nameEn: 'Light',
    priceKrw: 89000,
    discountedKrw: 8900,
    priceUsd: 89,
    discountedUsd: 9,
    discountRate: '90%',
    period: '월',
    isRecurring: true,
    isIntroOffer: true,
    keywords: 5,
    color: 'blue',
    features: [
      { text: '키워드 5개', included: true },
      { text: '네이버 쇼핑 자동화', included: true },
      { text: '기본 순위 추적', included: true },
      { text: '1개 계정 관리', included: true },
      { text: '이메일 지원', included: true },
      { text: '경쟁사 순위 분석', included: false },
      { text: '자동 스케줄링', included: false },
      { text: '프록시/IP 분산', included: false },
    ],
  },
  {
    key: 'PREMIUM',
    nameKo: 'Premium',
    nameEn: 'Premium',
    priceKrw: 109000,
    discountedKrw: 10900,
    priceUsd: 109,
    discountedUsd: 11,
    discountRate: '90%',
    period: '월',
    isRecurring: true,
    isPopular: true,
    isIntroOffer: true,
    keywords: 20,
    color: 'purple',
    features: [
      { text: '키워드 20개', included: true },
      { text: '네이버 쇼핑 자동화', included: true },
      { text: '실시간 순위 추적', included: true },
      { text: '3개 계정 관리', included: true },
      { text: '경쟁사 순위 분석', included: true },
      { text: '우선 고객 지원', included: true },
      { text: '자동 스케줄링', included: false },
      { text: '프록시/IP 분산', included: false },
    ],
  },
  {
    key: 'VIP',
    nameKo: 'VIP',
    nameEn: 'VIP',
    priceKrw: 129000,
    discountedKrw: 12900,
    priceUsd: 129,
    discountedUsd: 13,
    discountRate: '90%',
    period: '월',
    isRecurring: true,
    isIntroOffer: true,
    keywords: 50,
    color: 'amber',
    features: [
      { text: '키워드 50개', included: true },
      { text: '네이버 쇼핑 자동화', included: true },
      { text: '실시간 순위 추적', included: true },
      { text: '10개 계정 관리', included: true },
      { text: '경쟁사 순위 분석', included: true },
      { text: '자동 스케줄링', included: true },
      { text: '프록시/IP 분산', included: true },
      { text: '전담 매니저 지원', included: true },
    ],
  },
  {
    key: 'VIP_PRO',
    nameKo: 'VIP Pro',
    nameEn: 'VIP Pro',
    priceKrw: 1990000,
    discountedKrw: 1990000,
    priceUsd: 1990,
    discountedUsd: 1990,
    discountRate: '',
    period: '평생',
    isRecurring: false,
    isLifetime: true,
    keywords: '무제한',
    color: 'rose',
    features: [
      { text: '키워드 무제한', included: true },
      { text: '모든 자동화 기능', included: true },
      { text: '실시간 순위 추적', included: true },
      { text: '무제한 계정 관리', included: true },
      { text: '경쟁사 순위 분석', included: true },
      { text: '자동 스케줄링', included: true },
      { text: '프록시/IP 분산', included: true },
      { text: '평생 업데이트 + VIP 전담 지원', included: true },
    ],
  },
];

// 금액 포맷팅
export function formatKrw(amount: number): string {
  return `₩${amount.toLocaleString('ko-KR')}`;
}

export function formatUsd(amount: number): string {
  return `$${amount.toLocaleString('en-US')}`;
}
