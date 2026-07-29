import { Link } from 'react-router-dom'
import { BestSellers } from '@/components/home/BestSellers'
import { CraftsmanshipSection } from '@/components/home/CraftsmanshipSection'
import { CategoriesShowcase } from '@/components/home/CategoriesShowcase'
import { StatsSection } from '@/components/home/StatsSection'
import { GallerySection } from '@/components/home/GallerySection'
import { AnimatedSection } from '@/components/common/AnimatedSection'
import { useCategories } from '@/hooks/useCategories'

export default function Home() {
  const { data: categories = [] } = useCategories()

  return (
    <div className="overflow-hidden">
      {/* Category Chips */}
      <section className="pt-24 md:pt-28 pb-4 md:pb-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            <Link
              to="/shop"
              className="shrink-0 px-4 py-2 rounded-full bg-chocolate text-white text-sm font-medium hover:bg-chocolate/90 transition-colors"
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/shop?category=${cat.slug}`}
                className="shrink-0 px-4 py-2 rounded-full bg-cream text-chocolate text-sm font-medium border border-sand/30 hover:border-gold hover:bg-gold/10 transition-all"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="pb-4 md:pb-6">
        <CategoriesShowcase />
      </section>

      {/* Best Sellers */}
      <AnimatedSection>
        <BestSellers />
      </AnimatedSection>

      {/* Craftsmanship */}
      <AnimatedSection>
        <CraftsmanshipSection />
      </AnimatedSection>

      {/* Stats */}
      <AnimatedSection>
        <StatsSection />
      </AnimatedSection>

      {/* Gallery */}
      <AnimatedSection>
        <GallerySection />
      </AnimatedSection>
    </div>
  )
}
