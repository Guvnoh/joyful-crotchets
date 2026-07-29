import { motion } from 'framer-motion'
import { Instagram } from 'lucide-react'
import { SectionHeader } from '@/components/common/SectionHeader'

const galleryItems = [
  'from-gold/30 to-caramel/50',
  'from-mocha/30 to-chocolate/50',
  'from-caramel/30 to-sand/50',
  'from-gold-muted/30 to-mocha/50',
  'from-chocolate/20 to-gold/40',
  'from-sand/40 to-caramel/50',
]

export function GallerySection() {
  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Follow Our Journey"
          subtitle="@joyfulcrochets"
          action={{ label: 'Follow Us', href: 'https://instagram.com' }}
        />

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-6">
          {galleryItems.map((gradient, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              whileHover={{ scale: 1.05 }}
              className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-transform duration-500 group-hover:scale-110`}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-chocolate/0 opacity-0 transition-all duration-300 group-hover:bg-chocolate/50 group-hover:opacity-100">
                <Instagram className="h-8 w-8 text-white" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
