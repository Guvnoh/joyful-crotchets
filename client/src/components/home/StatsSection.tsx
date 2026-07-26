import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

interface StatItemProps {
  value: number
  suffix?: string
  label: string
  duration?: number
}

function AnimatedCounter({ value, suffix = '', label, duration = 2 }: StatItemProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView) return
    let start = 0
    const increment = value / (duration * 60)
    const timer = setInterval(() => {
      start += increment
      if (start >= value) {
        setCount(value)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 1000 / 60)
    return () => clearInterval(timer)
  }, [isInView, value, duration])

  return (
    <div ref={ref} className="text-center">
      <div className="font-display text-4xl font-bold text-gold md:text-5xl">
        {count.toLocaleString()}
        {suffix}
      </div>
      <p className="mt-2 text-sm font-medium text-mocha">{label}</p>
    </div>
  )
}

const stats = [
  { value: 500, suffix: '+', label: 'Happy Customers' },
  { value: 2000, suffix: '+', label: 'Items Crafted' },
  { value: 50, suffix: '+', label: 'Unique Designs' },
  { value: 100, suffix: '%', label: 'Handmade' },
]

export function StatsSection() {
  return (
    <section className="border-y border-gold/10 bg-chocolate py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 gap-8 md:grid-cols-4"
        >
          {stats.map((stat) => (
            <AnimatedCounter
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
