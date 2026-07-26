import { useState, useCallback, useEffect } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { motion } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { SectionHeader } from '@/components/common/SectionHeader'

const testimonials = [
  {
    name: 'Sarah Mitchell',
    title: 'Verified Buyer',
    content:
      'The craftsmanship is absolutely stunning. My crochet bag has become my everyday essential. The attention to detail is remarkable.',
    rating: 5,
  },
  {
    name: 'Emily Chen',
    title: 'Interior Designer',
    content:
      "I ordered custom pieces for my client's nursery. The quality and artistry exceeded all expectations. Truly premium handmade work.",
    rating: 5,
  },
  {
    name: 'Maria Rodriguez',
    title: 'Repeat Customer',
    content:
      "I've purchased gifts for my entire family from Joyful Crotchets. Every piece arrives beautifully packaged and even more gorgeous in person.",
    rating: 5,
  },
  {
    name: 'Amanda Foster',
    title: 'Fashion Blogger',
    content:
      'As someone who values sustainable fashion, finding Joyful Crotchets was a dream. Each piece is a wearable work of art.',
    rating: 5,
  },
]

export function TestimonialsSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('select', onSelect)
    onSelect()
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  return (
    <section className="bg-gradient-to-b from-cream/30 to-white py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="What Our Customers Say"
          subtitle="Testimonials"
        />

        <div className="relative mt-10">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex -ml-6">
              {testimonials.map((testimonial, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="min-w-[85%] pl-6 sm:min-w-[50%] lg:min-w-[33.333%]"
                >
                  <div className="relative h-full rounded-2xl border border-gold/10 bg-white p-8 shadow-lg shadow-gold/5 transition-all duration-300 hover:shadow-xl hover:shadow-gold/10">
                    <Quote className="absolute right-6 top-6 h-8 w-8 text-gold/20" />
                    <div className="mb-4 flex items-center">
                      {[...Array(5)].map((_, j) => (
                        <Star
                          key={j}
                          className={`h-4 w-4 ${
                            j < testimonial.rating
                              ? 'fill-gold text-gold'
                              : 'fill-beige text-beige'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="font-display text-base italic leading-relaxed text-chocolate/80">
                      &ldquo;{testimonial.content}&rdquo;
                    </p>
                    <div className="mt-6 border-t border-beige/50 pt-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gold/20 to-caramel/20">
                          <span className="text-sm font-semibold text-gold">
                            {testimonial.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-chocolate">
                            {testimonial.name}
                          </p>
                          <p className="text-xs text-mocha">{testimonial.title}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/20 text-chocolate transition-all hover:border-gold hover:bg-gold hover:text-white disabled:opacity-30"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => emblaApi?.scrollTo(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === selectedIndex ? 'w-6 bg-gold' : 'w-2 bg-gold/30'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={scrollNext}
              disabled={!canScrollNext}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/20 text-chocolate transition-all hover:border-gold hover:bg-gold hover:text-white disabled:opacity-30"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
