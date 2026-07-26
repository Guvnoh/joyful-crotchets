import { HeroSection } from '@/components/home/HeroSection'
import { FeaturedCollections } from '@/components/home/FeaturedCollections'
import { BestSellers } from '@/components/home/BestSellers'
import { CraftsmanshipSection } from '@/components/home/CraftsmanshipSection'
import { CategoriesShowcase } from '@/components/home/CategoriesShowcase'
import { StatsSection } from '@/components/home/StatsSection'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { GallerySection } from '@/components/home/GallerySection'
import { NewsletterSection } from '@/components/home/NewsletterSection'
import { AnimatedSection } from '@/components/common/AnimatedSection'

export default function Home() {
  return (
    <div className="overflow-hidden">
      <HeroSection />
      <AnimatedSection>
        <FeaturedCollections />
      </AnimatedSection>
      <AnimatedSection>
        <BestSellers />
      </AnimatedSection>
      <AnimatedSection>
        <CraftsmanshipSection />
      </AnimatedSection>
      <AnimatedSection>
        <CategoriesShowcase />
      </AnimatedSection>
      <AnimatedSection>
        <StatsSection />
      </AnimatedSection>
      <AnimatedSection>
        <TestimonialsSection />
      </AnimatedSection>
      <AnimatedSection>
        <GallerySection />
      </AnimatedSection>
      <AnimatedSection>
        <NewsletterSection />
      </AnimatedSection>
    </div>
  )
}
