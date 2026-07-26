import { useRelatedProducts } from '@/hooks/useProducts'
import { ProductCard } from '@/components/common/ProductCard'
import { Skeleton } from '@/components/ui/skeleton'

interface RelatedProductsProps {
  productId: string
}

export function RelatedProducts({ productId }: RelatedProductsProps) {
  const { data: products, isLoading } = useRelatedProducts(productId)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h2 className="font-display text-2xl font-semibold text-chocolate">You May Also Like</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-square rounded-2xl" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (!products || products.length === 0) {
    return null
  }

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-semibold text-chocolate">You May Also Like</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <ProductCard key={product._id} product={product} index={index} />
        ))}
      </div>
    </div>
  )
}
