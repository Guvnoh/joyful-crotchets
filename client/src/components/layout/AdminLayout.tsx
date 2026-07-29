import { useState, useCallback } from 'react'
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Outlet } from 'react-router-dom'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  Star,
  MessageSquare,
  PenTool,
  Tag,
  HelpCircle,
  Mail,
  Image,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Activity,
} from 'lucide-react'
import { Logo } from '@/components/common/Logo'
import { useAuthStore } from '@/stores/authStore'

const sidebarItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  { name: 'Products', icon: Package, href: '/admin/products' },
  { name: 'Categories', icon: FolderTree, href: '/admin/categories' },
  { name: 'Orders', icon: ShoppingBag, href: '/admin/orders' },
  { name: 'Customers', icon: Users, href: '/admin/customers' },
  { name: 'Reviews', icon: Star, href: '/admin/reviews' },
  { name: 'Testimonials', icon: MessageSquare, href: '/admin/testimonials' },
  { name: 'Custom Orders', icon: PenTool, href: '/admin/custom-orders' },
  { name: 'Coupons', icon: Tag, href: '/admin/coupons' },
  { name: 'FAQ', icon: HelpCircle, href: '/admin/faq' },
  { name: 'Subscribers', icon: Mail, href: '/admin/subscribers' },
  { name: 'Media', icon: Image, href: '/admin/media' },
  { name: 'Activity Log', icon: Activity, href: '/admin/activity-log' },
  { name: 'Settings', icon: Settings, href: '/admin/settings' },
]

export function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, logout } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()

  useKeyboardShortcuts([
    { key: 'n', ctrl: true, handler: () => navigate('/admin/products/new') },
    { key: 'Escape', handler: () => (document.activeElement as HTMLElement)?.blur() },
    { key: 'd', ctrl: true, handler: () => navigate('/admin') },
    { key: 'p', ctrl: true, handler: () => navigate('/admin/products') },
    { key: 'o', ctrl: true, handler: () => navigate('/admin/orders') },
  ])

  return (
    <div className="min-h-screen bg-chocolate-50">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setIsMobileSidebarOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg text-chocolate-700 hover:text-amber-700 transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed top-0 left-0 bottom-0 bg-white border-r border-chocolate-200 z-50 flex flex-col ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300`}
        style={{ width: isSidebarOpen ? 280 : 80 }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-chocolate-200">
          <Link to="/admin" className="flex items-center gap-2">
            <Logo size="sm" />
            {isSidebarOpen && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="font-cormorant text-xl font-bold text-chocolate whitespace-nowrap overflow-hidden"
              >
                Joyful Admin
              </motion.span>
            )}
          </Link>
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-chocolate-500 hover:bg-chocolate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {sidebarItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  end={item.href === '/admin'}
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                      isActive
                        ? 'bg-amber-50 text-amber-700 border-l-4 border-amber-500 font-medium'
                        : 'text-chocolate-600 hover:bg-chocolate-50 hover:text-chocolate-900'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {isSidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="whitespace-nowrap"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Info */}
        <div className="border-t border-chocolate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-yellow-300 flex items-center justify-center text-white font-medium">
              {user?.name?.charAt(0) || 'A'}
            </div>
            {isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-medium text-chocolate-900 truncate">
                  {user?.name || 'Admin User'}
                </p>
                <p className="text-xs text-chocolate-500 truncate">
                  {user?.role || 'Administrator'}
                </p>
              </motion.div>
            )}
            {isSidebarOpen && (
              <button
                onClick={logout}
                className="p-2 text-chocolate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          isSidebarOpen ? 'lg:ml-[280px]' : 'lg:ml-20'
        }`}
      >
        {/* Top Bar */}
        <header className="sticky top-0 z-40 h-16 bg-white border-b border-chocolate-200 flex items-center justify-between px-6">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden lg:flex p-2 rounded-lg text-chocolate-500 hover:bg-chocolate-50 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-chocolate-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-yellow-300 flex items-center justify-center text-white text-sm font-medium">
                  {user?.name?.charAt(0) || 'A'}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-chocolate-800 leading-tight">{user?.name || 'Admin'}</p>
                  <p className="text-xs text-chocolate-500 leading-tight">Administrator</p>
                </div>
                <ChevronDown className="w-4 h-4 text-chocolate-500" />
              </button>

              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-chocolate-100 py-2 z-50"
                  >
                    <div className="px-4 py-2 border-b border-chocolate-100">
                      <p className="font-medium text-chocolate-900">{user?.name || 'Admin User'}</p>
                      <p className="text-sm text-chocolate-500">{user?.email || 'admin@example.com'}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-chocolate-700 hover:bg-chocolate-50 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      My Profile
                    </Link>
                    <Link
                      to="/admin/settings"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-chocolate-700 hover:bg-chocolate-50 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false)
                        logout()
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors border-t border-chocolate-100 mt-2 pt-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6"><Outlet /></main>
      </div>
    </div>
  )
}
