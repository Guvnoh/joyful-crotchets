import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SectionHeader } from '@/components/common/SectionHeader'

const collections = [
  {
    name: 'Bags & Totes',
    slug: 'bags',
    image: 'https://images.unsplash.com/photo-1759544632264-a31a9ff1e60b?w=600&q=80',
  },
  {
    name: 'Bucket Hats',
    slug: 'hats',
    image: 'https://images.unsplash.com/photo-1693387359607-f48d0a824b1e?w=600&q=80',
  },
  {
    name: 'Floral Arrangements',
    slug: 'floral',
    image: 'https://images.unsplash.com/photo-1529636798458-92182e662485?w=600&q=80',
  },
  {
    name: 'Home Décor',
    slug: 'home-decor',
    image: 'https://images.unsplash.com/photo-1747856056384-ba35f5ed353d?w=600&q=80',
  },
  {
    name: 'Baby Collection',
    slug: 'baby',
    image: 'https://images.unsplash.com/photo-1728372923987-15d70bc4946a?w=600&q=80',
  },
]

export function FeaturedCollections() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Featured Collections"
          subtitle="Curated for You"
          action={{ label: 'View All', href: '/shop' }}
        />

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {collections.map((collection, i) => (
            <motion.div
              key={collection.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="group relative aspect-[3/4] cursor-pointer overflow-hidden rounded-2xl"
            >
              <Link
                to={`/shop?category=${collection.slug}`}
                className="absolute inset-0"
              >
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-chocolate/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="font-display text-xl font-semibold text-white drop-shadow-lg">
                    {collection.name}
                  </h3>
                  <span className="mt-1 inline-block text-xs font-medium uppercase tracking-wider text-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    Shop Now →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
