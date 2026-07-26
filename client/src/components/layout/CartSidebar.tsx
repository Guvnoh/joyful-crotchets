import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'
import { useUIStore } from '@/stores/uiStore'
import { formatPrice } from '@/lib/utils'

export function CartSidebar() {
  const { isCartOpen, setCartOpen } = useUIStore()
  const { items, updateQuantity, removeItem, getSubtotal, getShipping, getItemCount } = useCartStore()

  const subtotal = getSubtotal()
  const shipping = getShipping()
  const itemCount = getItemCount()
  const total = subtotal + shipping

  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isCartOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        setCartOpen(false)
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isCartOpen, setCartOpen])

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setCartOpen(false)}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-chocolate-200">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-amber-700" />
                <h2 className="font-display text-2xl font-semibold text-chocolate-900">
                  Shopping Bag
                </h2>
                {itemCount > 0 && (
                  <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-sm font-medium rounded-full">
                    {itemCount}
                  </span>
                )}
              </div>
              <button
                onClick={() => setCartOpen(false)}
                className="p-2 rounded-full text-chocolate-400 hover:text-chocolate-600 hover:bg-chocolate-50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-24 h-24 rounded-full bg-amber-50 flex items-center justify-center mb-6">
                    <ShoppingBag className="w-12 h-12 text-amber-300" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-chocolate-900 mb-2">
                    Your bag is empty
                  </h3>
                  <p className="text-chocolate-500 mb-8">
                    Looks like you haven't added any items yet.
                  </p>
                  <Link
                    to="/shop"
                    onClick={() => setCartOpen(false)}
                    className="px-8 py-3 bg-gradient-to-r from-amber-600 to-yellow-500 text-white font-medium rounded-xl hover:from-amber-700 hover:to-yellow-600 transition-all shadow-lg shadow-amber-200 inline-flex items-center gap-2"
                  >
                    Start Shopping
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-6">
                  {items.map((item, index) => (
                    <motion.div
                      key={`${item.product._id}-${item.size}-${item.color}-${index}`}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 100 }}
                      className="flex gap-4"
                    >
                      <img
                        src={item.product.images?.[0]?.url || 'https://placehold.co/400x400/ivory/chocolate?text=No+Image'}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-chocolate-900 truncate">
                          {item.product.name}
                        </h4>
                        {(item.size || item.color) && (
                          <p className="text-sm text-chocolate-500 mt-0.5">
                            {[item.color, item.size].filter(Boolean).join(' / ')}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-2 bg-chocolate-50 rounded-lg p-1">
                            <button
                              onClick={() => updateQuantity(item.product._id, item.quantity - 1, item.color, item.size)}
                              disabled={item.quantity <= 1}
                              className="w-8 h-8 rounded-md flex items-center justify-center text-chocolate-600 hover:bg-white hover:shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-8 text-center font-medium text-chocolate-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product._id, item.quantity + 1, item.color, item.size)}
                              className="w-8 h-8 rounded-md flex items-center justify-center text-chocolate-600 hover:bg-white hover:shadow-sm transition-all"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="font-semibold text-amber-700">
                            {formatPrice(item.product.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => removeItem(item.product._id, item.color, item.size)}
                        className="p-2 text-chocolate-400 hover:text-red-500 transition-colors self-start"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-chocolate-200 p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-chocolate-600">Subtotal</span>
                    <span className="text-chocolate-800">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-chocolate-600">Shipping</span>
                    <span className="text-chocolate-800">
                      {shipping === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        formatPrice(shipping)
                      )}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="text-xs text-amber-600">
                      Add {formatPrice(100 - subtotal)} more for free shipping!
                    </p>
                  )}
                  <div className="flex justify-between pt-2 border-t border-chocolate-200">
                    <span className="font-medium text-chocolate-900">Total</span>
                    <span className="font-semibold text-lg text-chocolate-900">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                <Link
                  to="/cart"
                  onClick={() => setCartOpen(false)}
                  className="block w-full py-3 text-center text-chocolate-700 bg-chocolate-50 hover:bg-chocolate-100 rounded-xl font-medium transition-colors"
                >
                  View Cart
                </Link>
                <Link
                  to="/checkout"
                  onClick={() => setCartOpen(false)}
                  className="block w-full py-3 text-center text-white bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-700 hover:to-yellow-600 rounded-xl font-medium shadow-lg shadow-amber-200 transition-all"
                >
                  Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
