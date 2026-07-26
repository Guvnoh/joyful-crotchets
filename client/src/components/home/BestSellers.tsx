import { SectionHeader } from '@/components/common/SectionHeader'
import { ProductCard } from '@/components/common/ProductCard'
import { ProductSkeleton } from '@/components/common/ProductSkeleton'
import { useBestSellers } from '@/hooks/useProducts'

export function BestSellers() {
  const { data: products = [], isLoading } = useBestSellers()

  return (
    <section className="bg-cream/50 py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Best Sellers"
          subtitle="Customer Favorites"
          action={{ label: 'View All', href: '/shop' }}
        />

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
