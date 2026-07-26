import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Minus, Plus, ShoppingBag, ArrowLeft, Tag, X } from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { formatPrice, getImageUrl } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function Cart() {
  const {
    items,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
    couponCode,
    discount,
    getSubtotal,
    getShipping,
    getTax,
    getTotal,
    getItemCount,
  } = useCartStore()

  const [couponInput, setCouponInput] = useState('')
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false)

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return
    setIsApplyingCoupon(true)
    try {
      await applyCoupon(couponInput.trim())
      setCouponInput('')
    } catch (error) {
      // Error handled in store
    } finally {
      setIsApplyingCoupon(false)
    }
  }

  const subtotal = getSubtotal()
  const shipping = getShipping()
  const tax = getTax()
  const total = getTotal()
  const itemCount = getItemCount()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-ivory">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md mx-auto"
          >
            <div className="w-32 h-32 rounded-full bg-beige/50 flex items-center justify-center mx-auto mb-8">
              <ShoppingBag className="h-16 w-16 text-mocha/30" />
            </div>
            <h1 className="font-display text-3xl font-bold text-chocolate mb-4">Your Bag is Empty</h1>
            <p className="text-mocha mb-8">
              Looks like you haven't added any items to your bag yet. 
              Explore our collection to find something you love.
            </p>
            <Link to="/shop">
              <Button size="lg" className="bg-gold text-white hover:bg-gold/90 px-8">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Continue Shopping
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ivory">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-chocolate">Shopping Bag</h1>
            <p className="text-mocha mt-1">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
          </div>
          <Link to="/shop" className="text-sm text-mocha hover:text-gold transition-colors flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
        </div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-8">
          {/* Cart Items */}
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div
                  key={`${item.product._id}-${item.color}-${item.size}`}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  className="bg-white rounded-2xl p-4 sm:p-6 premium-shadow"
                >
                  <div className="flex gap-4 sm:gap-6">
                    {/* Product Image */}
                    <Link
                      to={`/product/${item.product.slug}`}
                      className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 rounded-xl overflow-hidden bg-cream"
                    >
                      {item.product.images?.[0] ? (
                        <img
                          src={getImageUrl(item.product.images[0].url)}
                          alt={item.product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cream to-beige">
                          <ShoppingBag className="h-8 w-8 text-mocha/30" />
                        </div>
                      )}
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <Link
                            to={`/product/${item.product.slug}`}
                            className="font-display text-lg font-semibold text-chocolate hover:text-gold transition-colors line-clamp-1"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-sm text-mocha mt-0.5">{item.product.category?.name}</p>
                        </div>
                        <button
                          onClick={() => removeItem(item.product._id, item.color, item.size)}
                          className="p-2 text-mocha hover:text-destructive transition-colors rounded-lg hover:bg-destructive/5"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Options */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {item.color && (
                          <span className="text-xs bg-beige/50 text-mocha px-2 py-1 rounded">
                            Color: {item.color}
                          </span>
                        )}
                        {item.size && (
                          <span className="text-xs bg-beige/50 text-mocha px-2 py-1 rounded">
                            Size: {item.size}
                          </span>
                        )}
                      </div>

                      {/* Price & Quantity */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-sand/50 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.product._id, item.quantity - 1, item.color, item.size)}
                            className="p-2 text-mocha hover:text-gold transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-10 text-center text-sm font-medium text-chocolate">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product._id, item.quantity + 1, item.color, item.size)}
                            className="p-2 text-mocha hover:text-gold transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="font-display text-lg font-bold text-chocolate">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-2xl p-6 premium-shadow">
              <h2 className="font-display text-xl font-semibold text-chocolate mb-6">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-mocha">Subtotal</span>
                  <span className="text-chocolate font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-mocha">Shipping</span>
                  <span className="text-chocolate font-medium">
                    {shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-mocha">
                    Free shipping on orders over $100
                  </p>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-mocha">Estimated Tax</span>
                  <span className="text-chocolate font-medium">{formatPrice(tax)}</span>
                </div>

                {/* Coupon Code */}
                {couponCode ? (
                  <div className="flex items-center justify-between p-3 bg-gold/5 rounded-lg border border-gold/20">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-gold" />
                      <span className="text-sm font-medium text-gold">{couponCode}</span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-mocha hover:text-destructive transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      placeholder="Coupon code"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="h-10 text-sm"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleApplyCoupon}
                      disabled={isApplyingCoupon || !couponInput.trim()}
                      className="border-gold/30 text-chocolate hover:bg-gold hover:text-white"
                    >
                      Apply
                    </Button>
                  </div>
                )}

                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Discount</span>
                    <span className="text-green-600 font-medium">-{formatPrice(discount)}</span>
                  </div>
                )}

                <Separator className="bg-sand/30" />

                <div className="flex justify-between">
                  <span className="font-display text-lg font-semibold text-chocolate">Total</span>
                  <span className="font-display text-lg font-bold text-chocolate">{formatPrice(total)}</span>
                </div>
              </div>

              <Link to="/checkout" className="block mt-6">
                <Button className="w-full h-12 bg-gold text-white hover:bg-gold/90 text-lg font-semibold rounded-xl">
                  Proceed to Checkout
                </Button>
              </Link>

              <Link
                to="/shop"
                className="block mt-4 text-center text-sm text-mocha hover:text-gold transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
