import { Helmet } from 'react-helmet-async';

// SEO 컴포넌트 Props 인터페이스
interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string; // 경로 (예: "/guide") - baseUrl이 자동으로 앞에 붙음
  ogImage?: string;
  ogType?: string;
  noindex?: boolean;
  jsonLd?: object | object[]; // 구조화된 데이터 (JSON-LD)
}

const BASE_URL = 'https://marketinghelper.co.kr';
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-image.png`;
const SITE_NAME = '마케팅헬퍼';

/**
 * 재사용 가능한 SEO 컴포넌트
 * - 동적 title (사이트명 접미사 자동 추가)
 * - Open Graph / Twitter Card 메타 태그
 * - JSON-LD 구조화된 데이터
 * - robots 메타 태그 (noindex 지원)
 * - canonical URL
 */
export default function SEO({
  title,
  description,
  keywords,
  canonical,
  ogImage,
  ogType = 'website',
  noindex = false,
  jsonLd,
}: SEOProps) {
  // title에 이미 사이트명이 포함되어 있으면 그대로, 아니면 접미사 추가
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const canonicalUrl = canonical ? `${BASE_URL}${canonical}` : undefined;
  const ogImageUrl = ogImage || DEFAULT_OG_IMAGE;
  const robotsContent = noindex ? 'noindex, nofollow' : 'index, follow';

  // JSON-LD 스크립트 생성 (단일 객체 또는 배열)
  const renderJsonLd = () => {
    if (!jsonLd) return null;

    const schemas = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
    return schemas.map((schema, index) => (
      <script
        key={`jsonld-${index}`}
        type="application/ld+json"
      >
        {JSON.stringify(schema)}
      </script>
    ));
  };

  return (
    <Helmet>
      {/* 기본 메타 태그 */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={robotsContent} />

      {/* Canonical URL */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph 태그 */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImageUrl} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:locale" content="ko_KR" />
      <meta property="og:site_name" content={SITE_NAME} />

      {/* Twitter Card 태그 */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImageUrl} />

      {/* JSON-LD 구조화된 데이터 */}
      {renderJsonLd()}
    </Helmet>
  );
}
