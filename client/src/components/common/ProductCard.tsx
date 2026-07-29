import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, Heart, Eye, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'
import { useWishlistStore } from '@/stores/wishlistStore'
import { useUIStore } from '@/stores/uiStore'
import { formatPrice, calculateDiscount } from '@/lib/utils'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  index?: number
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const addToCart = useCartStore((s) => s.addToCart)
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist)
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(product._id))
  const setQuickView = useUIStore((s) => s.setQuickView)

  const imageUrl = product.images?.[0]?.url || null
  const discount = product.compareAtPrice
    ? calculateDiscount(product.price, product.compareAtPrice)
    : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: 'easeOut' }}
      className="group relative"
    >
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-cream">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.images?.[0]?.alt || product.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cream via-linen to-beige">
              <ShoppingBag className="h-16 w-16 text-mocha/30" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-2">
            {product.isNewArrival && (
              <span className="inline-flex items-center rounded-full bg-chocolate px-3 py-1 text-xs font-semibold text-white shadow-lg">
                New
              </span>
            )}
            {discount > 0 && (
              <span className="inline-flex items-center rounded-full bg-gold px-3 py-1 text-xs font-semibold text-white shadow-lg">
                -{discount}%
              </span>
            )}
            {product.isBestSeller && (
              <span className="inline-flex items-center rounded-full border border-gold/30 bg-white/90 px-3 py-1 text-xs font-semibold text-gold shadow-lg backdrop-blur-sm">
                Best Seller
              </span>
            )}
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 flex items-center justify-center gap-3 bg-chocolate/0 opacity-0 transition-all duration-300 group-hover:bg-chocolate/40 group-hover:opacity-100">
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setQuickView(true, product._id)
              }}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-chocolate shadow-lg transition-transform hover:scale-110 hover:bg-gold hover:text-white"
              title="Quick View"
            >
              <Eye className="h-5 w-5" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                toggleWishlist(product)
              }}
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-chocolate shadow-lg transition-transform hover:scale-110 hover:bg-gold hover:text-white"
              title="Add to Wishlist"
            >
              <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-gold text-gold' : ''}`} />
            </button>
          </div>

          {/* Floating Heart */}
          <button
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              toggleWishlist(product)
            }}
            className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/80 text-chocolate shadow-md backdrop-blur-sm transition-all hover:bg-white hover:text-gold hover:shadow-lg sm:opacity-0 sm:group-hover:opacity-100"
          >
            <Heart className={`h-4 w-4 ${isInWishlist ? 'fill-gold text-gold' : ''}`} />
          </button>
        </div>
      </Link>

      {/* Content */}
      <div className="mt-4 space-y-2 px-3">
        <p className="text-xs font-medium uppercase tracking-wider text-mocha">
          {product.category?.name || 'Uncategorized'}
        </p>
        <Link to={`/product/${product.slug}`}>
          <h3 className="font-display text-lg font-semibold text-chocolate transition-colors duration-200 hover:text-gold">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-3.5 w-3.5 ${
                  i < Math.round(product.averageRating)
                    ? 'fill-gold text-gold'
                    : 'fill-beige text-beige'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-mocha">
            ({product.numReviews})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="font-body text-lg font-bold text-chocolate">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <>
              <span className="text-sm text-mocha line-through">
                {formatPrice(product.compareAtPrice)}
              </span>
              <span className="rounded-full bg-gold/10 px-2 py-0.5 text-xs font-semibold text-gold">
                Save {discount}%
              </span>
            </>
          )}
        </div>

        {/* Add to Cart - always visible on mobile, hover on desktop */}
        <button
          onClick={() => addToCart(product)}
          className="mt-3 w-full rounded-full border-2 border-gold bg-gold px-6 py-2.5 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:bg-gold/90 hover:shadow-lg active:scale-[0.98] sm:translate-y-2 sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100"
        >
          Add to Cart
        </button>
      </div>
    </motion.div>
  )
}
