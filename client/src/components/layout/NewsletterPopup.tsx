import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Sparkles } from 'lucide-react'

export function NewsletterPopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasSubscribed, setHasSubscribed] = useState(false)

  useEffect(() => {
    const hasSeenPopup = localStorage.getItem('newsletter-popup-seen')
    if (!hasSeenPopup) {
      const timer = setTimeout(() => setIsVisible(true), 30000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setIsVisible(false)
    localStorage.setItem('newsletter-popup-seen', 'true')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setHasSubscribed(true)
      localStorage.setItem('newsletter-popup-seen', 'true')
      setTimeout(() => handleClose(), 3000)
    } catch (error) {
      console.error('Subscription failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600" />

            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 text-chocolate-400 hover:text-chocolate-600 transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8 md:p-10">
              {hasSubscribed ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-50 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="font-cormorant text-2xl font-semibold text-chocolate-900 mb-2">
                    Welcome to the Family!
                  </h3>
                  <p className="text-chocolate-600">
                    Check your inbox for a special welcome gift.
                  </p>
                </motion.div>
              ) : (
                <>
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-50 flex items-center justify-center">
                      <Mail className="w-8 h-8 text-amber-700" />
                    </div>
                    <h2 className="font-cormorant text-3xl font-semibold text-chocolate-900 mb-3">
                      Join Our Community
                    </h2>
                    <p className="text-chocolate-600 leading-relaxed">
                      Subscribe for exclusive offers, early access to new collections, 
                      and handmade inspiration delivered to your inbox.
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        required
                        className="w-full px-5 py-4 rounded-xl border border-chocolate-200 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition-all text-chocolate-800 placeholder-chocolate-400"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 px-6 bg-gradient-to-r from-amber-600 to-yellow-500 text-white font-medium rounded-xl hover:from-amber-700 hover:to-yellow-600 transition-all shadow-lg shadow-amber-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'Subscribing...' : 'Subscribe & Save 10%'}
                    </button>
                  </form>

                  <button
                    onClick={handleClose}
                    className="w-full mt-4 text-sm text-chocolate-500 hover:text-chocolate-700 transition-colors"
                  >
                    No thanks, I'll pass
                  </button>

                  <p className="text-xs text-chocolate-400 text-center mt-4">
                    By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
