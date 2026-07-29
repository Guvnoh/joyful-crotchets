import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { QueryProvider } from '@/context/QueryProvider'
import { Toaster } from 'react-hot-toast'
import { Layout } from '@/components/layout/Layout'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { useAuthStore } from '@/stores/authStore'
import { useScrollToTop } from '@/hooks/useScrollToTop'

// Public pages
import Home from '@/pages/Home'
import Shop from '@/pages/Shop'
import ProductDetail from '@/pages/ProductDetail'
import About from '@/pages/About'
import Contact from '@/pages/Contact'
import FAQs from '@/pages/FAQs'
import Gallery from '@/pages/Gallery'
import Cart from '@/pages/Cart'
import Checkout from '@/pages/Checkout'
import OrderConfirmation from '@/pages/OrderConfirmation'
import Wishlist from '@/pages/Wishlist'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import ForgotPassword from '@/pages/ForgotPassword'
import ResetPassword from '@/pages/ResetPassword'
import CustomOrders from '@/pages/CustomOrders'
import UserProfile from '@/pages/UserProfile'
import NotFound from '@/pages/NotFound'

// Admin pages
import AdminDashboard from '@/pages/admin/AdminDashboard'
import AdminProducts from '@/pages/admin/AdminProducts'
import AdminProductForm from '@/pages/admin/AdminProductForm'
import AdminCategories from '@/pages/admin/AdminCategories'
import AdminOrders from '@/pages/admin/AdminOrders'
import AdminOrderDetail from '@/pages/admin/AdminOrderDetail'
import AdminCustomers from '@/pages/admin/AdminCustomers'
import AdminReviews from '@/pages/admin/AdminReviews'
import AdminTestimonials from '@/pages/admin/AdminTestimonials'
import AdminFAQs from '@/pages/admin/AdminFAQs'
import AdminSubscribers from '@/pages/admin/AdminSubscribers'
import AdminCoupons from '@/pages/admin/AdminCoupons'
import AdminCustomOrders from '@/pages/admin/AdminCustomOrders'
import AdminSettings from '@/pages/admin/AdminSettings'
import AdminMedia from '@/pages/admin/AdminMedia'
import AdminActivityLog from '@/pages/admin/AdminActivityLog'

// Loading component
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-gold/20 border-t-gold rounded-full animate-spin" />
        <p className="text-muted-foreground font-body text-sm">Loading...</p>
      </div>
    </div>
  )
}

// Protected route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

// Admin route wrapper
function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (user?.role !== 'admin') return <Navigate to="/" replace />
  return <>{children}</>
}

function ScrollToTop() {
  useScrollToTop()
  return null
}

function App() {
  return (
    <QueryProvider>
      <Router>
        <ScrollToTop />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#FFFFF0',
              color: '#3E2723',
              border: '1px solid #C2B280',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
            },
            success: {
              iconTheme: { primary: '#C9A94E', secondary: '#FFFFF0' },
            },
          }}
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/shop" element={<Layout><Shop /></Layout>} />
          <Route path="/product/:slug" element={<Layout><ProductDetail /></Layout>} />
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          <Route path="/faq" element={<Layout><FAQs /></Layout>} />
          <Route path="/gallery" element={<Layout><Gallery /></Layout>} />
          <Route path="/cart" element={<Layout><Cart /></Layout>} />
          <Route path="/wishlist" element={<Layout><Wishlist /></Layout>} />
          <Route path="/custom-orders" element={<Layout><CustomOrders /></Layout>} />
          <Route path="/order-confirmation" element={<Layout><OrderConfirmation /></Layout>} />

          {/* Auth Routes (no layout) */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* Protected Routes */}
          <Route path="/checkout" element={<ProtectedRoute><Layout><Checkout /></Layout></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Layout><UserProfile /></Layout></ProtectedRoute>} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/new" element={<AdminProductForm />} />
            <Route path="products/:id/edit" element={<AdminProductForm />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="orders/:id" element={<AdminOrderDetail />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="testimonials" element={<AdminTestimonials />} />
            <Route path="faqs" element={<AdminFAQs />} />
            <Route path="subscribers" element={<AdminSubscribers />} />
            <Route path="coupons" element={<AdminCoupons />} />
            <Route path="custom-orders" element={<AdminCustomOrders />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="media" element={<AdminMedia />} />
            <Route path="activity-log" element={<AdminActivityLog />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<Layout><NotFound /></Layout>} />
        </Routes>
      </Router>
    </QueryProvider>
  )
}

export default App
