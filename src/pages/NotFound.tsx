import { Link } from 'react-router-dom';
import SEO from '../components/SEO';

/**
 * NotFound.tsx - 404 페이지
 */
function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <SEO title="페이지를 찾을 수 없습니다" description="요청하신 페이지를 찾을 수 없습니다." noindex={true} />
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-6">
          페이지를 찾을 수 없습니다
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
