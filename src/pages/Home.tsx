// ============================================
// 메인 랜딩 페이지
// ============================================

import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import SocialProof from '../components/landing/SocialProof';
import FeaturesSection from '../components/landing/FeaturesSection';
import PricingSection from '../components/landing/PricingSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import FAQSection from '../components/landing/FAQSection';
import CTASection from '../components/landing/CTASection';
import Footer from '../components/landing/Footer';
import SEO from '../components/SEO';
import { PAGE_SEO, generateFAQSchema, generateBreadcrumbSchema } from '../constants/seo';
import { FAQ } from '../constants/content';

export default function Home() {
  return (
    <main className="min-h-screen">
      <SEO
        {...PAGE_SEO['/home']}
        jsonLd={[
          generateFAQSchema(FAQ.list),
          generateBreadcrumbSchema([
            { name: '홈', url: 'https://marketinghelper.co.kr/' },
            { name: '제품 소개', url: 'https://marketinghelper.co.kr/home' }
          ])
        ]}
      />
      <Navbar />
      <HeroSection />
      <SocialProof />
      <section id="features"><FeaturesSection /></section>
      <section id="pricing"><PricingSection /></section>
      <section id="testimonials"><TestimonialsSection /></section>
      <section id="faq"><FAQSection /></section>
      <CTASection />
      <Footer />
    </main>
  );
}
