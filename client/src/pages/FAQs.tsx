import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { HelpCircle, MessageSquare } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const faqCategories = ['All', 'Shipping', 'Returns', 'Custom Orders', 'Care', 'General']

const faqs = [
  { category: 'Shipping', q: 'How long does shipping take?', a: 'Standard shipping typically takes 3-5 business days within the US. International orders may take 7-14 business days depending on location.' },
  { category: 'Shipping', q: 'Do you offer international shipping?', a: 'Yes! We ship worldwide. International shipping rates are calculated at checkout based on your location.' },
  { category: 'Shipping', q: 'How much does shipping cost?', a: 'We offer free shipping on orders over ₦100 within the US. Standard shipping is ₦8.99 for orders under ₦100.' },
  { category: 'Returns', q: 'What is your return policy?', a: 'We accept returns within 14 days of delivery for items in their original condition. Custom orders are final sale.' },
  { category: 'Returns', q: 'How do I initiate a return?', a: 'Contact our customer service team with your order number and reason for return. We\'ll provide a prepaid return label.' },
  { category: 'Custom Orders', q: 'Can I request a custom design?', a: 'Absolutely! Visit our Custom Orders page to submit your request. We\'ll review it and provide a quote within 48 hours.' },
  { category: 'Custom Orders', q: 'How long do custom orders take?', a: 'Custom orders typically take 2-4 weeks depending on complexity. We\'ll provide an estimated timeline with your quote.' },
  { category: 'Custom Orders', q: 'Can I request specific colors?', a: 'Yes! We offer a wide range of yarn colors. You can specify your preferences when placing a custom order.' },
  { category: 'Care', q: 'How do I care for my crochet items?', a: 'Most items are hand-wash only in cold water with mild detergent. Lay flat to dry. Avoid wringing or twisting. Detailed care instructions are included with each product.' },
  { category: 'Care', q: 'Can I machine wash my crochet items?', a: 'We recommend hand washing to preserve the quality and shape of your items. Machine washing may cause stretching or damage.' },
  { category: 'General', q: 'Are all products truly handmade?', a: 'Yes! Every single item is handcrafted by our skilled artisans. No machines are used in the creation process.' },
  { category: 'General', q: 'What materials do you use?', a: 'We use premium quality yarns including cotton, wool, acrylic blends, and specialty fibers. All materials are sourced from trusted suppliers.' },
  { category: 'General', q: 'Do you offer gift wrapping?', a: 'Yes! We offer beautiful gift wrapping for a small additional fee. You can add this option during checkout.' },
]

export default function FAQs() {
  const [activeCategory, setActiveCategory] = useState('All')

  const filteredFAQs = activeCategory === 'All'
    ? faqs
    : faqs.filter((faq) => faq.category === activeCategory)

  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero */}
      <section className="py-16 bg-gradient-to-r from-chocolate via-mocha to-chocolate">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <HelpCircle className="h-12 w-12 text-gold mx-auto mb-4" />
            <h1 className="font-display text-4xl md:text-5xl font-bold text-cream">Frequently Asked Questions</h1>
            <p className="text-cream/70 mt-4 max-w-xl mx-auto">
              Find answers to common questions about our products, shipping, and services.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Category Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap justify-center gap-2 mb-12"
          >
            {faqCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  'px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300',
                  activeCategory === category
                    ? 'bg-gold text-white shadow-md'
                    : 'bg-white text-chocolate border border-sand/30 hover:border-gold hover:text-gold'
                )}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* FAQ Accordion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Accordion type="single" collapsible className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="bg-white rounded-xl border border-sand/30 px-6 data-[state=open]:shadow-md transition-shadow"
                >
                  <AccordionTrigger className="text-left font-medium text-chocolate hover:text-gold py-5">
                    <span>{faq.q}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-mocha leading-relaxed pb-5">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-16 text-center bg-cream/50 rounded-3xl p-12"
          >
            <MessageSquare className="h-10 w-10 text-gold mx-auto mb-4" />
            <h2 className="font-display text-2xl font-semibold text-chocolate mb-3">
              Still Have Questions?
            </h2>
            <p className="text-mocha mb-6 max-w-md mx-auto">
              Can't find what you're looking for? Our team is here to help.
            </p>
            <Link to="/contact">
              <Button className="bg-gold text-white hover:bg-gold/90">
                Contact Us
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
