import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
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
  X,
  Scissors,
  ChevronLeft,
  ChevronRight,
  Activity,
} from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { cn } from '@/lib/utils'

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

interface AdminSidebarProps {
  isCollapsed: boolean
  onToggle: () => void
  isMobileOpen: boolean
  onMobileClose: () => void
}

export function AdminSidebar({
  isCollapsed,
  onToggle,
  isMobileOpen,
  onMobileClose,
}: AdminSidebarProps) {
  const { user, logout } = useAuthStore()

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 lg:hidden"
            onClick={onMobileClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={cn(
          'fixed top-0 left-0 bottom-0 bg-white border-r border-chocolate-200 z-50 flex flex-col transition-all duration-300',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        style={{ width: isCollapsed ? 80 : 280 }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-chocolate-200">
          <Link to="/admin" className="flex items-center gap-2" onClick={onMobileClose}>
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center shrink-0">
              <Scissors className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="font-display text-xl font-bold text-chocolate-800 whitespace-nowrap overflow-hidden"
              >
                Joyful Admin
              </motion.span>
            )}
          </Link>
          <button
            onClick={onMobileClose}
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
                  onClick={onMobileClose}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all',
                      isActive
                        ? 'bg-amber-50 text-amber-700 border-l-4 border-amber-500 font-medium'
                        : 'text-chocolate-600 hover:bg-chocolate-50 hover:text-chocolate-900'
                    )
                  }
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {!isCollapsed && (
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

        {/* Collapse Toggle - Desktop */}
        <button
          onClick={onToggle}
          className="hidden lg:flex items-center justify-center h-10 border-t border-chocolate-200 text-chocolate-400 hover:text-chocolate-600 hover:bg-chocolate-50 transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>

        {/* User Info */}
        <div className="border-t border-chocolate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-yellow-300 flex items-center justify-center text-white font-medium shrink-0">
              {user?.name?.charAt(0) || 'A'}
            </div>
            {!isCollapsed && (
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
            {!isCollapsed && (
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
    </>
  )
}
