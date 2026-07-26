import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import { SectionHeader } from '@/components/common/SectionHeader'
import { useCategories } from '@/hooks/useCategories'
import { Skeleton } from '@/components/ui/skeleton'

const categoryGradients = [
  'from-gold/30 to-caramel/50',
  'from-mocha/30 to-chocolate/50',
  'from-caramel/30 to-sand/50',
  'from-gold-muted/30 to-mocha/50',
  'from-chocolate/20 to-gold/40',
  'from-sand/40 to-caramel/50',
]

export function CategoriesShowcase() {
  const { data: categories = [], isLoading } = useCategories()

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Shop by Category"
          subtitle="Browse Our Collections"
        />

        {isLoading ? (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square w-full rounded-2xl" />
                <Skeleton className="h-5 w-2/3 rounded-full" />
                <Skeleton className="h-4 w-1/2 rounded-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((category, i) => (
              <motion.div
                key={category._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                whileHover={{ scale: 1.03 }}
                className="group"
              >
                <Link
                  to={`/shop?category=${category.slug}`}
                  className="block overflow-hidden rounded-2xl"
                >
                  <div className="relative aspect-square">
                    {category.image?.url ? (
                      <img
                        src={category.image.url}
                        alt={category.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div
                        className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${
                          categoryGradients[i % categoryGradients.length]
                        } transition-transform duration-500 group-hover:scale-110`}
                      >
                        <ShoppingBag className="h-12 w-12 text-white/40" />
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <h3 className="font-display text-lg font-semibold text-chocolate transition-colors group-hover:text-gold">
                      {category.name}
                    </h3>
                    {category.productCount !== undefined && (
                      <p className="text-xs text-mocha">
                        {category.productCount} {category.productCount === 1 ? 'product' : 'products'}
                      </p>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
