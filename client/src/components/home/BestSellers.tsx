import { ProductCard } from '@/components/common/ProductCard'
import { ProductSkeleton } from '@/components/common/ProductSkeleton'
import { useBestSellers } from '@/hooks/useProducts'

export function BestSellers() {
  const { data: products = [], isLoading } = useBestSellers()

  return (
    <section className="py-10 md:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-chocolate">
              Best Sellers
            </h2>
            <p className="text-sm text-mocha mt-1">What our customers love most</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)
            : products.slice(0, 8).map((product, i) => (
                <ProductCard key={product._id} product={product} index={i} />
              ))}
        </div>
      </div>
    </section>
  )
}
