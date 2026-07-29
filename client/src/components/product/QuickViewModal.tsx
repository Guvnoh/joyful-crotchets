import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useUIStore } from '@/stores/uiStore'
import { useCartStore } from '@/stores/cartStore'
import { formatPrice, calculateDiscount, getImageUrl } from '@/lib/utils'
import { useProduct } from '@/hooks/useProducts'

export function QuickViewModal() {
  const { isQuickViewOpen, quickViewProductId, setQuickView } = useUIStore()
  const addToCart = useCartStore((s) => s.addToCart)
  const { data: product, isLoading } = useProduct(quickViewProductId || '')
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)

  const handleClose = () => {
    setQuickView(false)
    setSelectedImageIndex(0)
    setSelectedColor(null)
    setSelectedSize(null)
    setQuantity(1)
  }

  if (!quickViewProductId) return null

  return (
    <Dialog open={isQuickViewOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-3xl p-0 gap-0 overflow-hidden">
        {isLoading || !product ? (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2">
            {/* Image */}
            <div className="relative aspect-square bg-cream">
              {product.images?.length > 0 ? (
                <>
                  <img
                    src={getImageUrl(product.images[selectedImageIndex].url)}
                    alt={product.images[selectedImageIndex].alt || product.name}
                    className="h-full w-full object-cover"
                  />
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={() => setSelectedImageIndex((prev) => prev === 0 ? product.images.length - 1 : prev - 1)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white shadow-md"
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setSelectedImageIndex((prev) => prev === product.images.length - 1 ? 0 : prev + 1)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white shadow-md"
                      >
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <ShoppingBag className="h-16 w-16 text-mocha/30" />
                </div>
              )}
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="absolute top-3 left-3 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-white shadow-lg">
                  -{calculateDiscount(product.price, product.compareAtPrice)}%
                </span>
              )}
            </div>

            {/* Details */}
            <div className="p-6 flex flex-col max-h-[80vh] overflow-y-auto">
              <p className="text-xs font-medium uppercase tracking-wider text-mocha mb-1">
                {product.category?.name || 'Uncategorized'}
              </p>
              <h2 className="font-display text-2xl font-bold text-chocolate mb-2">
                {product.name}
              </h2>

              {/* Price */}
              <div className="flex items-center gap-3 mb-4">
                <span className="font-body text-2xl font-bold text-chocolate">
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span className="text-lg text-mocha line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-mocha leading-relaxed mb-4">
                {product.shortDescription || product.description?.slice(0, 150)}
              </p>

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-chocolate mb-2">Color</p>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`h-8 w-8 rounded-full border-2 transition-all ${
                          selectedColor === color.name
                            ? 'border-gold ring-2 ring-gold/20'
                            : 'border-sand/50 hover:border-gold/50'
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-medium text-chocolate mb-2">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size.name}
                        onClick={() => setSelectedSize(size.name)}
                        className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                          selectedSize === size.name
                            ? 'border-gold bg-gold text-white'
                            : 'border-sand/50 text-chocolate hover:border-gold/50'
                        }`}
                      >
                        {size.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <p className="text-sm font-medium text-chocolate mb-2">Quantity</p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-9 w-9 rounded-lg border border-sand/50 flex items-center justify-center hover:border-gold/50 transition-colors"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-medium text-chocolate">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-9 w-9 rounded-lg border border-sand/50 flex items-center justify-center hover:border-gold/50 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-auto">
                <Button
                  onClick={() => {
                    for (let i = 0; i < quantity; i++) {
                      addToCart(product)
                    }
                    handleClose()
                  }}
                  className="flex-1 bg-gold text-white hover:bg-gold/90 h-12"
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Link to={`/product/${product.slug}`} onClick={handleClose}>
                  <Button variant="outline" className="h-12 px-4 border-sand/50 hover:border-gold/50">
                    View Full Details
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
