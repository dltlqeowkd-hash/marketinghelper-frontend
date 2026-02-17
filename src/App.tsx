import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthProvider from './components/AuthProvider';
import AnalyticsProvider from './components/AnalyticsProvider';
import ProtectedRoute from './components/ProtectedRoute';

// 공개 페이지 (즉시 로드)
import Home from './pages/Home';

// 나머지 페이지 (코드 스플리팅 - 필요 시 로드)
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const OAuthCallback = lazy(() => import('./pages/OAuthCallback'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Subscription = lazy(() => import('./pages/dashboard/Subscription'));
const Licenses = lazy(() => import('./pages/dashboard/Licenses'));
const Billing = lazy(() => import('./pages/dashboard/Billing'));
const Settings = lazy(() => import('./pages/dashboard/Settings'));
const Download = lazy(() => import('./pages/Download'));
const Guide = lazy(() => import('./pages/Guide'));
const Payment = lazy(() => import('./pages/Payment'));
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'));
const PaymentFail = lazy(() => import('./pages/PaymentFail'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminPayments = lazy(() => import('./pages/admin/AdminPayments'));
const AdminLicenses = lazy(() => import('./pages/admin/AdminLicenses'));
const AdminSerials = lazy(() => import('./pages/admin/AdminSerials'));
const SeoDoctor = lazy(() => import('./pages/SeoDoctor'));
const Terms = lazy(() => import('./pages/Terms'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Refund = lazy(() => import('./pages/Refund'));
const NotFound = lazy(() => import('./pages/NotFound'));

// 로딩 스피너
function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AnalyticsProvider>
          <Suspense fallback={<Loading />}>
            <Routes>
              {/* 공개 페이지 */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/oauth/callback" element={<OAuthCallback />} />

              {/* 대시보드 (로그인 필수) */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/dashboard/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
              <Route path="/dashboard/licenses" element={<ProtectedRoute><Licenses /></ProtectedRoute>} />
              <Route path="/dashboard/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
              <Route path="/dashboard/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/download" element={<ProtectedRoute><Download /></ProtectedRoute>} />
              <Route path="/guide" element={<Guide />} />
              <Route path="/seo-doctor" element={<SeoDoctor />} />

              {/* 결제 (로그인 필수) */}
              <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
              <Route path="/payment/success" element={<ProtectedRoute><PaymentSuccess /></ProtectedRoute>} />
              <Route path="/payment/fail" element={<ProtectedRoute><PaymentFail /></ProtectedRoute>} />

              {/* 관리자 (ADMIN 전용) */}
              <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute>} />
              <Route path="/admin/payments" element={<ProtectedRoute adminOnly><AdminPayments /></ProtectedRoute>} />
              <Route path="/admin/licenses" element={<ProtectedRoute adminOnly><AdminLicenses /></ProtectedRoute>} />
              <Route path="/admin/serials" element={<ProtectedRoute adminOnly><AdminSerials /></ProtectedRoute>} />

              {/* 법률 문서 */}
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/refund" element={<Refund />} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AnalyticsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
