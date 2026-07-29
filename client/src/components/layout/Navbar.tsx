import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
  ChevronDown,
  LogOut,
  Settings,
  Package,
} from 'lucide-react'
import { Logo } from '@/components/common/Logo'
import { useAuthStore } from '@/stores/authStore'
import { useCartStore } from '@/stores/cartStore'
import { useWishlistStore } from '@/stores/wishlistStore'
import { useUIStore } from '@/stores/uiStore'

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Shop', href: '/shop', hasMegaMenu: true },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

const shopCategories = [
  {
    title: 'Bags',
    items: [
      { name: 'Tote Bags', href: '/shop?category=bags&type=tote' },
      { name: 'Crossbody Bags', href: '/shop?category=bags&type=crossbody' },
      { name: 'Clutches', href: '/shop?category=bags&type=clutch' },
      { name: 'Backpacks', href: '/shop?category=bags&type=backpack' },
    ],
  },
  {
    title: 'Hats',
    items: [
      { name: 'Beanies', href: '/shop?category=hats&type=beanie' },
      { name: 'Bucket Hats', href: '/shop?category=hats&type=bucket' },
      { name: 'Sun Hats', href: '/shop?category=hats&type=sun' },
      { name: 'Berets', href: '/shop?category=hats&type=beret' },
    ],
  },
  {
    title: 'Clothing',
    items: [
      { name: 'Cardigans', href: '/shop?category=clothing&type=cardigan' },
      { name: 'Sweaters', href: '/shop?category=clothing&type=sweater' },
      { name: 'Scarves', href: '/shop?category=clothing&type=scarf' },
      { name: 'Shawls', href: '/shop?category=clothing&type=shawl' },
    ],
  },
  {
    title: 'Home Décor',
    items: [
      { name: 'Blankets', href: '/shop?category=home&type=blanket' },
      { name: 'Pillows', href: '/shop?category=home&type=pillow' },
      { name: 'Rugs', href: '/shop?category=home&type=rug' },
      { name: 'Wall Art', href: '/shop?category=home&type=wall-art' },
    ],
  },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const megaMenuTimeout = useRef<NodeJS.Timeout>()
  const userMenuTimeout = useRef<NodeJS.Timeout>()
  const location = useLocation()
  const navigate = useNavigate()

  const { user, isAuthenticated, logout } = useAuthStore()
  const { getItemCount } = useCartStore()
  const { items: wishlistItems } = useWishlistStore()
  const { setSearchOpen, setCartOpen } = useUIStore()

  const itemCount = getItemCount()
  const wishlistCount = wishlistItems.length

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
    setIsMegaMenuOpen(false)
    setIsUserMenuOpen(false)
  }, [location])

  const handleMegaMenuEnter = () => {
    clearTimeout(megaMenuTimeout.current)
    setIsMegaMenuOpen(true)
  }

  const handleMegaMenuLeave = () => {
    megaMenuTimeout.current = setTimeout(() => setIsMegaMenuOpen(false), 150)
  }

  const handleUserMenuEnter = () => {
    clearTimeout(userMenuTimeout.current)
    setIsUserMenuOpen(true)
  }

  const handleUserMenuLeave = () => {
    userMenuTimeout.current = setTimeout(() => setIsUserMenuOpen(false), 150)
  }

  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
    navigate('/')
  }

  return (
    <>
      <motion.header
        className={`fixed top-[3px] left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-lg shadow-amber-100/20'
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <Logo size="md" />
              <span className="font-cormorant text-2xl font-bold text-chocolate group-hover:text-gold transition-colors">
                Joyful Crochets
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <div
                  key={link.name}
                  className="relative"
                  onMouseEnter={link.hasMegaMenu ? handleMegaMenuEnter : undefined}
                  onMouseLeave={link.hasMegaMenu ? handleMegaMenuLeave : undefined}
                >
                  <Link
                    to={link.href}
                    className={`flex items-center gap-1 py-2 text-sm font-medium transition-colors ${
                      location.pathname === link.href
                        ? 'text-amber-700'
                        : 'text-chocolate-700 hover:text-amber-600'
                    }`}
                  >
                    {link.name}
                    {link.hasMegaMenu && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          isMegaMenuOpen ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </Link>

                  {/* Mega Menu */}
                  {link.hasMegaMenu && (
                    <AnimatePresence>
                      {isMegaMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-1/2 -translate-x-1/2 w-[800px] pt-4"
                          onMouseEnter={handleMegaMenuEnter}
                          onMouseLeave={handleMegaMenuLeave}
                        >
                          <div className="bg-white rounded-2xl shadow-2xl border border-amber-100 p-8">
                            <div className="grid grid-cols-4 gap-8">
                              {shopCategories.map((category) => (
                                <div key={category.title}>
                                  <h3 className="font-cormorant text-lg font-semibold text-chocolate-800 mb-4">
                                    {category.title}
                                  </h3>
                                  <ul className="space-y-3">
                                    {category.items.map((item) => (
                                      <li key={item.name}>
                                        <Link
                                          to={item.href}
                                          className="text-sm text-chocolate-600 hover:text-amber-600 transition-colors"
                                        >
                                          {item.name}
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ))}
                            </div>
                            <div className="mt-8 pt-6 border-t border-chocolate-100">
                              <Link
                                to="/shop"
                                className="text-sm font-medium text-amber-700 hover:text-amber-800 transition-colors"
                              >
                                View All Products →
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 rounded-full text-chocolate-600 hover:text-amber-700 hover:bg-amber-50 transition-all"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* User Menu */}
              <div
                className="relative"
                onMouseEnter={handleUserMenuEnter}
                onMouseLeave={handleUserMenuLeave}
              >
                <button
                  onClick={() => {
                    if (!isAuthenticated) {
                      navigate('/login')
                    }
                  }}
                  className="p-2.5 rounded-full text-chocolate-600 hover:text-amber-700 hover:bg-amber-50 transition-all"
                >
                  <User className="w-5 h-5" />
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && isAuthenticated && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full pt-2 w-64"
                      onMouseEnter={handleUserMenuEnter}
                      onMouseLeave={handleUserMenuLeave}
                    >
                      <div className="bg-white rounded-xl shadow-xl border border-amber-100 p-4">
                        <div className="px-3 py-2 border-b border-chocolate-100 mb-2">
                          <p className="font-medium text-chocolate-800">{user?.name}</p>
                          <p className="text-sm text-chocolate-500">{user?.email}</p>
                        </div>
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-chocolate-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          My Profile
                        </Link>
                        <Link
                          to="/profile?tab=orders"
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-chocolate-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                        >
                          <Package className="w-4 h-4" />
                          Orders
                        </Link>
                        <Link
                          to="/profile?tab=settings"
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-chocolate-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors mt-2 border-t border-chocolate-100 pt-3"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="relative p-2.5 rounded-full text-chocolate-600 hover:text-amber-700 hover:bg-amber-50 transition-all"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-2.5 rounded-full text-chocolate-600 hover:text-amber-700 hover:bg-amber-50 transition-all"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-full text-chocolate-600 hover:text-amber-700 hover:bg-amber-50 transition-all"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <Link to="/" className="flex items-center gap-2">
                    <Logo size="sm" />
                    <span className="font-cormorant text-xl font-bold text-chocolate">
                      Joyful Crochets
                    </span>
                  </Link>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 rounded-full text-chocolate-600 hover:bg-chocolate-50"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      className={`block px-4 py-3 rounded-lg text-base font-medium transition-colors ${
                        location.pathname === link.href
                          ? 'bg-amber-50 text-amber-700'
                          : 'text-chocolate-700 hover:bg-chocolate-50'
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </nav>

                <div className="mt-8 pt-6 border-t border-chocolate-100">
                  <h3 className="px-4 text-xs font-semibold text-chocolate-500 uppercase tracking-wider mb-3">
                    Shop by Category
                  </h3>
                  <div className="space-y-1">
                    {shopCategories.map((category) => (
                      <div key={category.title}>
                        <p className="px-4 py-2 text-sm font-medium text-chocolate-800">
                          {category.title}
                        </p>
                        {category.items.map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            className="block px-8 py-2 text-sm text-chocolate-600 hover:text-amber-600 transition-colors"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>

                {isAuthenticated && (
                  <div className="mt-8 pt-6 border-t border-chocolate-100">
                    <div className="px-4 py-3 bg-chocolate-50 rounded-lg mb-4">
                      <p className="font-medium text-chocolate-800">{user?.name}</p>
                      <p className="text-sm text-chocolate-500">{user?.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <LogOut className="w-5 h-5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
