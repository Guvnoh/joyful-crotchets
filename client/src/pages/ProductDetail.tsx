import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Home, Star, Heart, ShoppingBag, Minus, Plus, Truck, RotateCcw,
  Shield, ChevronDown, Package
} from 'lucide-react'
import { useProduct } from '@/hooks/useProducts'
import { useCartStore } from '@/stores/cartStore'
import { useWishlistStore } from '@/stores/wishlistStore'
import { ImageGallery } from '@/components/product/ImageGallery'
import { ReviewList } from '@/components/product/ReviewList'
import { RelatedProducts } from '@/components/product/RelatedProducts'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Skeleton } from '@/components/ui/skeleton'
import { cn, formatPrice, calculateDiscount, formatDate } from '@/lib/utils'

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { data: product, isLoading, error } = useProduct(slug || '')
  const addToCart = useCartStore((s) => s.addToCart)
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist)
  const isInWishlist = useWishlistStore((s) => s.isInWishlist(product?._id || ''))

  const [selectedColor, setSelectedColor] = useState<string>('')
  const [selectedSize, setSelectedSize] = useState<string>('')
  const [quantity, setQuantity] = useState(1)
  const [customizationNotes, setCustomizationNotes] = useState('')
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-ivory">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
            <Skeleton className="aspect-square rounded-2xl" />
            <div className="space-y-6">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <div className="text-center">
          <Package className="h-16 w-16 text-mocha/30 mx-auto mb-4" />
          <h2 className="font-display text-2xl font-semibold text-chocolate mb-2">Product Not Found</h2>
          <p className="text-mocha mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <Link to="/shop">
            <Button className="bg-gold text-white hover:bg-gold/90">Browse Shop</Button>
          </Link>
        </div>
      </div>
    )
  }

  const discount = product.compareAtPrice ? calculateDiscount(product.price, product.compareAtPrice) : 0
  const primaryImage = product.images?.[0]
  const estimatedDelivery = product.estimatedDelivery || '3-5 business days'

  const handleAddToCart = async () => {
    setIsAddingToCart(true)
    await addToCart(product, quantity, selectedColor || undefined, selectedSize || undefined)
    setTimeout(() => setIsAddingToCart(false), 500)
  }

  return (
    <div className="min-h-screen bg-ivory">
      <div className="container mx-auto px-4 pt-28 pb-8">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-sm text-mocha mb-8 overflow-hidden flex-wrap"
        >
          <Link to="/" className="hover:text-gold transition-colors flex items-center gap-1 shrink-0">
            <Home className="h-3.5 w-3.5" />
            Home
          </Link>
          <span className="text-sand shrink-0">/</span>
          <Link to="/shop" className="hover:text-gold transition-colors shrink-0">Shop</Link>
          <span className="text-sand shrink-0">/</span>
          {product.category && (
            <>
              <Link
                to={`/shop?category=${product.category.slug}`}
                className="hover:text-gold transition-colors shrink-0"
              >
                {product.category.name}
              </Link>
              <span className="text-sand shrink-0">/</span>
            </>
          )}
          <span className="text-chocolate font-medium truncate min-w-0">{product.name}</span>
        </motion.nav>

        {/* Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12">
          {/* Left - Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ImageGallery images={product.images || []} />
          </motion.div>

          {/* Right - Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {/* Category */}
            {product.category && (
              <Link
                to={`/shop?category=${product.category.slug}`}
                className="text-sm font-medium uppercase tracking-wider text-mocha hover:text-gold transition-colors"
              >
                {product.category.name}
              </Link>
            )}

            {/* Product Name */}
            <h1 className="font-display text-3xl md:text-4xl font-bold text-chocolate leading-tight">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      'h-5 w-5',
                      i < Math.round(product.averageRating)
                        ? 'fill-gold text-gold'
                        : 'fill-beige text-beige'
                    )}
                  />
                ))}
              </div>
              <button className="text-sm text-mocha hover:text-gold transition-colors underline">
                {product.numReviews} reviews
              </button>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="font-display text-3xl font-bold text-chocolate">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <>
                  <span className="text-lg text-mocha line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                  <Badge className="bg-gold text-white">Save {discount}%</Badge>
                </>
              )}
            </div>

            {/* Short Description */}
            {product.shortDescription && (
              <p className="text-mocha leading-relaxed">{product.shortDescription}</p>
            )}

            <Separator className="bg-sand/30" />

            {/* Color Selector */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-chocolate">
                  Color: <span className="text-mocha">{selectedColor || 'Select'}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => color.inStock && setSelectedColor(color.name)}
                      disabled={!color.inStock}
                      className={cn(
                        'h-10 w-10 rounded-full border-2 transition-all duration-200 hover:scale-110',
                        selectedColor === color.name
                          ? 'border-gold ring-2 ring-gold/30 scale-110'
                          : 'border-white hover:border-sand',
                        !color.inStock && 'opacity-40 cursor-not-allowed'
                      )}
                      style={{ backgroundColor: color.hex }}
                      title={`${color.name}${!color.inStock ? ' (Out of Stock)' : ''}`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-chocolate">
                  Size: <span className="text-mocha">{selectedSize || 'Select'}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size.name}
                      onClick={() => size.inStock && setSelectedSize(size.name)}
                      disabled={!size.inStock}
                      className={cn(
                        'px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all duration-200',
                        selectedSize === size.name
                          ? 'border-gold bg-gold text-white'
                          : 'border-sand/50 text-chocolate hover:border-gold',
                        !size.inStock && 'opacity-40 cursor-not-allowed line-through'
                      )}
                    >
                      {size.name}
                      {size.price !== product.price && (
                        <span className="ml-1 text-xs">({formatPrice(size.price)})</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Customization Options */}
            {product.customizationOptions?.allowsCustomization && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-chocolate">
                  Customization Notes
                  {product.customizationOptions.additionalPrice && (
                    <span className="text-mocha ml-1">
                      (+{formatPrice(product.customizationOptions.additionalPrice)})
                    </span>
                  )}
                </label>
                <textarea
                  value={customizationNotes}
                  onChange={(e) => setCustomizationNotes(e.target.value)}
                  placeholder={product.customizationOptions.customizationNote || 'Add your customization details...'}
                  className="w-full rounded-lg border border-sand/50 bg-cream/50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold resize-none"
                  rows={3}
                />
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-chocolate">Quantity</label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-sand/50 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 text-mocha hover:text-gold transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-medium text-chocolate">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 text-mocha hover:text-gold transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                {product.stock < 10 && product.stock > 0 && (
                  <span className="text-sm text-amber-600">Only {product.stock} left in stock</span>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={isAddingToCart || product.stock === 0}
                className="w-full h-14 bg-gold text-white hover:bg-gold/90 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 active:scale-[0.98]"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                {product.stock === 0 ? 'Out of Stock' : isAddingToCart ? 'Adding...' : 'Add to Bag'}
              </Button>
              <Button
                variant="outline"
                onClick={() => toggleWishlist(product)}
                className={cn(
                  'w-full h-12 border-2 rounded-xl transition-all duration-300',
                  isInWishlist
                    ? 'border-gold bg-gold/5 text-gold'
                    : 'border-sand/50 text-chocolate hover:border-gold hover:text-gold'
                )}
              >
                <Heart className={cn('mr-2 h-5 w-5', isInWishlist && 'fill-gold')} />
                {isInWishlist ? 'In Wishlist' : 'Add to Wishlist'}
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { icon: Truck, label: 'Free Shipping', sub: 'Orders over ₦100' },
                { icon: RotateCcw, label: 'Easy Returns', sub: '14-day policy' },
                { icon: Shield, label: 'Secure Checkout', sub: '100% protected' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="text-center">
                  <Icon className="h-5 w-5 text-gold mx-auto mb-1" />
                  <p className="text-xs font-medium text-chocolate">{label}</p>
                  <p className="text-[10px] text-mocha">{sub}</p>
                </div>
              ))}
            </div>

            <Separator className="bg-sand/30" />

            {/* Expandable Sections */}
            <Accordion type="single" collapsible className="space-y-2">
              <AccordionItem value="description" className="border-sand/30">
                <AccordionTrigger className="text-sm font-semibold text-chocolate hover:text-gold">
                  Description
                </AccordionTrigger>
                <AccordionContent className="text-sm text-mocha leading-relaxed">
                  {product.description}
                </AccordionContent>
              </AccordionItem>

              {product.materials && product.materials.length > 0 && (
                <AccordionItem value="materials" className="border-sand/30">
                  <AccordionTrigger className="text-sm font-semibold text-chocolate hover:text-gold">
                    Materials & Care
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-mocha leading-relaxed">
                    <p className="mb-2"><strong>Materials:</strong> {product.materials.join(', ')}</p>
                    {product.careInstructions && (
                      <p><strong>Care:</strong> {product.careInstructions}</p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              )}

              <AccordionItem value="shipping" className="border-sand/30">
                <AccordionTrigger className="text-sm font-semibold text-chocolate hover:text-gold">
                  Shipping & Delivery
                </AccordionTrigger>
                <AccordionContent className="text-sm text-mocha leading-relaxed">
                  <p>Standard shipping: 3-5 business days within the US.</p>
                  <p>International orders: 7-14 business days.</p>
                  <p className="mt-2">Free shipping on orders over ₦100.</p>
                </AccordionContent>
              </AccordionItem>

              {product.dimensions && (
                <AccordionItem value="dimensions" className="border-sand/30">
                  <AccordionTrigger className="text-sm font-semibold text-chocolate hover:text-gold">
                    Dimensions & Weight
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-mocha leading-relaxed">
                    <p>
                      {product.dimensions.length} × {product.dimensions.width} × {product.dimensions.height} {product.dimensions.unit}
                    </p>
                    {product.weight && <p>Weight: {product.weight}g</p>}
                  </AccordionContent>
                </AccordionItem>
              )}
            </Accordion>

            {/* Estimated Delivery */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-cream/50 border border-sand/30">
              <Truck className="h-5 w-5 text-gold flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-chocolate">Estimated Delivery</p>
                <p className="text-xs text-mocha">{estimatedDelivery}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs Section */}
        <div className="mt-16">
          <Tabs defaultValue="reviews">
            <TabsList className="w-full justify-start bg-transparent border-b border-sand/30 rounded-none h-auto p-0 gap-0">
              <TabsTrigger
                value="reviews"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-gold data-[state=active]:bg-transparent data-[state=active]:text-chocolate font-display text-lg px-8 py-4"
              >
                Reviews ({product.numReviews})
              </TabsTrigger>
              <TabsTrigger
                value="related"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-gold data-[state=active]:bg-transparent data-[state=active]:text-chocolate font-display text-lg px-8 py-4"
              >
                Related Products
              </TabsTrigger>
            </TabsList>

            <TabsContent value="reviews" className="mt-8">
              <ReviewList productId={product._id} />
            </TabsContent>

            <TabsContent value="related" className="mt-8">
              <RelatedProducts productId={product._id} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
