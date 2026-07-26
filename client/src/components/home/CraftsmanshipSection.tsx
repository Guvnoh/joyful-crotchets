import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Scissors, Heart, Sparkles } from 'lucide-react'
import { SectionHeader } from '@/components/common/SectionHeader'

const features = [
  {
    icon: Scissors,
    title: 'Precision Crafted',
    description: 'Every stitch is placed with meticulous attention to detail.',
  },
  {
    icon: Heart,
    title: 'Made with Love',
    description: 'Each piece carries the warmth and care of our artisans.',
  },
  {
    icon: Sparkles,
    title: 'Premium Quality',
    description: 'We use only the finest materials for lasting beauty.',
  },
]

export function CraftsmanshipSection() {
  return (
    <section className="overflow-hidden py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              The Art of Crochet
            </p>
            <h2 className="font-display text-3xl font-bold text-chocolate md:text-4xl lg:text-5xl">
              Every Stitch Tells a Story
            </h2>
            <div className="mt-4 h-0.5 w-16 bg-gradient-to-r from-gold/60 via-gold to-gold/60" />
            <p className="mt-6 leading-relaxed text-mocha">
              At Joyful Crotchets, each piece is handcrafted with devotion and precision. Our skilled
              artisans pour their hearts into every creation, using premium yarns and time-honored
              techniques to produce works of art that are as functional as they are beautiful.
            </p>
            <p className="mt-4 leading-relaxed text-mocha">
              From selecting the finest materials to the final quality check, every step reflects our
              unwavering commitment to excellence. This is not mass production — it is craftsmanship
              at its finest.
            </p>

            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.title} className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/10">
                    <feature.icon className="h-5 w-5 text-gold" />
                  </div>
                  <div>
                    <h4 className="font-display text-sm font-semibold text-chocolate">
                      {feature.title}
                    </h4>
                    <p className="mt-1 text-xs leading-relaxed text-mocha">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/about"
              className="mt-10 inline-flex items-center rounded-full border-2 border-gold px-7 py-3 text-sm font-semibold text-gold transition-all duration-300 hover:bg-gold hover:text-white"
            >
              Learn More About Us
            </Link>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1693326873444-d7cf33cad3e0?w=800&q=80"
                alt="Artisan carefully crocheting with yarn and hook"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-2xl bg-gold/10" />
            <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-caramel/10" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
