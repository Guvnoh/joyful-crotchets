import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Star, Quote, PenLine } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getInitials } from '@/lib/utils'

const testimonials = [
  {
    id: 1,
    name: 'Emily Watson',
    rating: 5,
    text: 'The quality of the crochet bag I received is absolutely stunning. You can feel the craftsmanship in every stitch. It\'s become my everyday carry!',
    featured: true,
  },
  {
    id: 2,
    name: 'Sarah Chen',
    rating: 5,
    text: 'I ordered a custom baby blanket for my niece\'s shower and it exceeded all expectations. The colors were perfect and the personal touch meant so much.',
    featured: true,
  },
  {
    id: 3,
    name: 'Michael Torres',
    rating: 5,
    text: 'Bought the beanie collection for my wife\'s birthday. She hasn\'t taken them off since! The softness and warmth are incredible.',
    featured: true,
  },
  {
    id: 4,
    name: 'Jessica Adams',
    rating: 5,
    text: 'Finally found a brand that combines luxury with handmade charm. The attention to detail in each piece is remarkable.',
  },
  {
    id: 5,
    name: 'David Kim',
    rating: 4,
    text: 'Amazing quality products. The shipping was fast and the packaging was beautiful. Will definitely be ordering again.',
  },
  {
    id: 6,
    name: 'Rachel Green',
    rating: 5,
    text: 'The custom order process was seamless. They understood exactly what I wanted and delivered a masterpiece. Highly recommend!',
  },
  {
    id: 7,
    name: 'Amanda Foster',
    rating: 5,
    text: 'These are not just products, they\'re works of art. Each piece tells a story and brings so much joy to my home.',
  },
  {
    id: 8,
    name: 'Lisa Thompson',
    rating: 5,
    text: 'I\'ve been searching for premium handmade crochet items for years. Joyful Crotchets exceeded my expectations in every way.',
  },
  {
    id: 9,
    name: 'Jennifer Martinez',
    rating: 4,
    text: 'Beautiful craftsmanship and excellent customer service. The throw pillow I ordered transformed my living room.',
  },
]

const featuredTestimonials = testimonials.filter((t) => t.featured)

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
}

export default function Testimonials() {
  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-r from-chocolate via-mocha to-chocolate">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-gold uppercase tracking-[0.3em] text-sm font-medium">Testimonials</span>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-cream mt-4">Customer Stories</h1>
            <p className="text-cream/70 mt-4 max-w-xl mx-auto">
              Hear from our community of happy customers who treasure their handcrafted pieces
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-chocolate">Featured Reviews</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredTestimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="h-full border-sand/30 bg-white hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-8">
                    <Quote className="h-8 w-8 text-gold/30 mb-4" />
                    <p className="text-chocolate leading-relaxed mb-6 italic">"{testimonial.text}"</p>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-gold/10 text-gold font-display font-semibold">
                          {getInitials(testimonial.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-semibold text-chocolate">{testimonial.name}</h4>
                        <div className="flex items-center mt-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${
                                i < testimonial.rating ? 'fill-gold text-gold' : 'fill-beige text-beige'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* All Testimonials */}
      <section className="py-16 bg-cream/50">
        <div className="container mx-auto px-4">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-chocolate">All Reviews</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-sand/30 bg-white">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < testimonial.rating ? 'fill-gold text-gold' : 'fill-beige text-beige'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-mocha leading-relaxed text-sm mb-4">"{testimonial.text}"</p>
                    <div className="flex items-center gap-3 pt-4 border-t border-sand/20">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gold/10 text-gold text-sm font-medium">
                          {getInitials(testimonial.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-chocolate text-sm">{testimonial.name}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            {...fadeInUp}
            className="text-center max-w-2xl mx-auto"
          >
            <PenLine className="h-10 w-10 text-gold mx-auto mb-4" />
            <h2 className="font-display text-3xl font-bold text-chocolate mb-4">
              Share Your Experience
            </h2>
            <p className="text-mocha mb-8">
              Love your Joyful Crotchets piece? We'd love to hear about it!
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/shop">
                <Button className="bg-gold text-white hover:bg-gold/90">
                  Shop Now
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="border-gold/30 text-chocolate hover:bg-gold hover:text-white">
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
