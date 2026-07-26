import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag } from 'lucide-react'
import { useWishlistStore } from '@/stores/wishlistStore'
import { useCartStore } from '@/stores/cartStore'
import { ProductCard } from '@/components/common/ProductCard'
import { Button } from '@/components/ui/button'

export default function Wishlist() {
  const { items, fetchWishlist } = useWishlistStore()
  const addToCart = useCartStore((s) => s.addToCart)

  useEffect(() => {
    fetchWishlist()
  }, [fetchWishlist])

  const moveAllToCart = () => {
    items.forEach((product) => {
      addToCart(product)
    })
  }

  return (
    <div className="min-h-screen bg-ivory">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-chocolate">My Wishlist</h1>
            <p className="text-mocha mt-1">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
          </div>
          {items.length > 0 && (
            <Button
              onClick={moveAllToCart}
              className="bg-gold text-white hover:bg-gold/90"
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Move All to Cart
            </Button>
          )}
        </div>

        {/* Wishlist Content */}
        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 rounded-full bg-beige/50 flex items-center justify-center mx-auto mb-6">
              <Heart className="h-12 w-12 text-mocha/30" />
            </div>
            <h2 className="font-display text-2xl font-semibold text-chocolate mb-3">Your Wishlist is Empty</h2>
            <p className="text-mocha mb-8 max-w-md mx-auto">
              Save your favorite items to your wishlist and come back to them anytime.
            </p>
            <Link to="/shop">
              <Button size="lg" className="bg-gold text-white hover:bg-gold/90 px-8">
                Discover Our Collection
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((product, index) => (
              <ProductCard key={product._id} product={product} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
