import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const floatingYarns = [
  { size: 12, color: 'bg-gold/30', x: '15%', y: '20%', delay: 0 },
  { size: 8, color: 'bg-caramel/30', x: '80%', y: '30%', delay: 1.5 },
  { size: 16, color: 'bg-mocha/20', x: '70%', y: '70%', delay: 0.8 },
  { size: 10, color: 'bg-gold/20', x: '25%', y: '75%', delay: 2 },
  { size: 6, color: 'bg-caramel/25', x: '50%', y: '15%', delay: 1.2 },
]

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-chocolate via-mocha/80 to-gold/30" />
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 50%, rgba(201,169,78,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(150,121,105,0.3) 0%, transparent 50%)',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-chocolate/50 via-transparent to-transparent" />

      {/* Floating decorative elements */}
      {floatingYarns.map((yarn, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full ${yarn.color}`}
          style={{ width: yarn.size, height: yarn.size, left: yarn.x, top: yarn.y }}
          animate={{
            y: [0, -15, 0],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: yarn.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10 max-w-5xl px-4 text-center text-white sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-6 flex items-center justify-center gap-3"
        >
          <span className="h-px w-8 bg-gold/60" />
          <span className="text-xs font-medium uppercase tracking-[0.3em] text-gold">
            Handcrafted with Love
          </span>
          <span className="h-px w-8 bg-gold/60" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="font-display text-5xl font-bold leading-tight md:text-6xl lg:text-7xl xl:text-8xl"
        >
          Where Artistry Meets{' '}
          <span className="bg-gradient-to-r from-gold via-caramel to-gold bg-clip-text text-transparent">
            Craftsmanship
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mx-auto mt-6 max-w-2xl font-body text-lg text-white/70 md:text-xl"
        >
          Discover premium handmade crochet pieces, each uniquely crafted to bring warmth and beauty
          to your world.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link
            to="/shop"
            className="inline-flex items-center rounded-full bg-gold px-8 py-4 text-sm font-semibold text-chocolate shadow-xl transition-all duration-300 hover:bg-gold/90 hover:shadow-2xl hover:shadow-gold/20 active:scale-[0.98]"
          >
            Explore Collection
          </Link>
          <Link
            to="/about"
            className="inline-flex items-center rounded-full border border-white/30 px-8 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-all duration-300 hover:border-white/50 hover:bg-white/10"
          >
            Our Story
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ChevronDown className="h-6 w-6 text-white/40" />
      </motion.div>
    </section>
  )
}
