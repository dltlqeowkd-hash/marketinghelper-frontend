// CTA 섹션
import { Link } from 'react-router-dom';
import { CTA } from '../../constants/content';

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{CTA.title}</h2>
        <p className="text-lg text-primary-100 whitespace-pre-line mb-10">{CTA.subtitle}</p>

        <Link
          to="/register"
          className="inline-block px-10 py-4 bg-white text-primary-700 rounded-xl font-bold text-lg hover:bg-primary-50 shadow-lg transition-all hover:-translate-y-0.5"
        >
          {CTA.button}
        </Link>

        <p className="mt-4 text-sm text-primary-200">{CTA.note}</p>
      </div>
    </section>
  );
}
