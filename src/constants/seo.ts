// 페이지별 SEO 설정 및 구조화된 데이터 스키마 생성 유틸리티

const BASE_URL = 'https://marketinghelper.co.kr';

// SEO Props 타입 (SEO 컴포넌트와 동일)
interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  noindex?: boolean;
  jsonLd?: object | object[];
}

// ============================================================
// 페이지별 SEO 설정
// ============================================================

export const PAGE_SEO: Record<string, SEOConfig> = {
  // 메인 랜딩 (SEO Doctor)
  '/': {
    title: '무료 SEO 진단 도구 | 마케팅헬퍼',
    description:
      '무료 웹사이트 SEO 점수 분석 도구. 네이버·구글 검색 최적화 상태를 즉시 확인하고, 구체적인 개선 방법을 제공합니다.',
    keywords:
      'SEO 진단, SEO 점수, 웹사이트 분석, 검색엔진 최적화, SEO 체크리스트, 사이트 진단',
    canonical: '/',
  },

  // 제품 랜딩
  '/home': {
    title: '마케팅헬퍼 | 네이버 쇼핑·블로그 마케팅 자동화 프로그램',
    description:
      '네이버 쇼핑 순위 추적, 경쟁사 분석, 키워드 최적화를 자동화하는 마케팅 솔루션. 2,500명 이상의 셀러가 선택했습니다.',
    keywords:
      '마케팅헬퍼, 네이버 쇼핑 자동화, 키워드 순위 추적, 블로그 자동화, 네이버 마케팅, 쇼핑 순위 추적기',
    canonical: '/home',
  },

  // SEO Doctor 별칭
  '/seo-doctor': {
    title: '무료 SEO 진단 도구 | 마케팅헬퍼',
    description:
      '무료 웹사이트 SEO 점수 분석 도구. 네이버·구글 검색 최적화 상태를 즉시 확인하고, 구체적인 개선 방법을 제공합니다.',
    keywords:
      'SEO 진단, SEO 점수, 웹사이트 분석, 검색엔진 최적화, SEO 체크리스트, 사이트 진단',
    canonical: '/',
  },

  // 사용 가이드
  '/guide': {
    title: '사용 가이드 | 마케팅헬퍼',
    description:
      '마케팅헬퍼 설치 방법, 키워드 순위 추적 설정, 경쟁사 분석 사용법 등 모든 기능의 상세 가이드입니다.',
    keywords:
      '마케팅헬퍼 사용법, 마케팅헬퍼 가이드, 키워드 추적 설정, 네이버 마케팅 가이드',
    canonical: '/guide',
  },

  // 로그인
  '/login': {
    title: '로그인 | 마케팅헬퍼',
    description: '마케팅헬퍼 계정에 로그인하세요.',
    noindex: true,
    canonical: '/login',
  },

  // 회원가입
  '/register': {
    title: '무료 회원가입 | 마케팅헬퍼',
    description:
      '마케팅헬퍼에 가입하고 2시간 무료 체험을 시작하세요. 카드 등록 불필요.',
    keywords: '마케팅헬퍼 가입, 무료 체험, 네이버 마케팅 자동화',
    canonical: '/register',
  },

  // 이용약관
  '/terms': {
    title: '이용약관 | 마케팅헬퍼',
    description: '마케팅헬퍼 서비스 이용약관입니다.',
    noindex: true,
    canonical: '/terms',
  },

  // 개인정보처리방침
  '/privacy': {
    title: '개인정보처리방침 | 마케팅헬퍼',
    description: '마케팅헬퍼 개인정보처리방침입니다.',
    noindex: true,
    canonical: '/privacy',
  },

  // 환불 정책
  '/refund': {
    title: '환불 정책 | 마케팅헬퍼',
    description: '마케팅헬퍼 환불 및 결제 취소 정책 안내입니다.',
    canonical: '/refund',
  },
};

// ============================================================
// JSON-LD 구조화된 데이터 스키마 생성 함수
// ============================================================

/**
 * FAQ 스키마 생성 (FAQPage)
 * Google 검색결과에 FAQ 리치 스니펫으로 표시됨
 */
export function generateFAQSchema(
  faqs: { question: string; answer: string }[]
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * BreadcrumbList 스키마 생성
 * Google 검색결과에 breadcrumb 경로로 표시됨
 */
export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`,
    })),
  };
}

/**
 * WebPage 스키마 생성
 * 페이지의 기본 구조화된 데이터
 */
export function generateWebPageSchema(
  name: string,
  description: string,
  url: string
): object {
  const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description,
    url: fullUrl,
    publisher: {
      '@type': 'Organization',
      name: '마케팅헬퍼',
      url: BASE_URL,
    },
    inLanguage: 'ko-KR',
  };
}
