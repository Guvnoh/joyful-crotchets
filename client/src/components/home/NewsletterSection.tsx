import { useState } from 'react'
import { motion } from 'framer-motion'
import { Send, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setIsSubscribed(true)
    toast.success('Thanks for subscribing!')
    setEmail('')
    setTimeout(() => setIsSubscribed(false), 3000)
  }

  return (
    <section className="bg-gradient-to-br from-cream via-linen to-beige py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            Stay Connected
          </p>
          <h2 className="font-display text-3xl font-bold text-chocolate md:text-4xl">
            Join Our Community
          </h2>
          <p className="mx-auto mt-4 max-w-md text-mocha">
            Subscribe for exclusive offers, new arrivals, and a behind-the-scenes look at our
            handcrafted creations.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-12 flex-1 rounded-full border border-gold/20 bg-white px-5 text-sm text-chocolate placeholder:text-mocha/50 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/20 sm:max-w-sm"
            />
            <button
              type="submit"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gold px-7 text-sm font-semibold text-white shadow-lg shadow-gold/20 transition-all duration-300 hover:bg-gold/90 hover:shadow-xl active:scale-[0.98]"
            >
              {isSubscribed ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Subscribed
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Subscribe
                </>
              )}
            </button>
          </form>

          <p className="mt-4 text-xs text-mocha/60">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
