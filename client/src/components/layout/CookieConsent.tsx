import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Cookie, X } from 'lucide-react'

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false)
  const [hasChosen, setHasChosen] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000)
      return () => clearTimeout(timer)
    } else {
      setHasChosen(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setIsVisible(false)
    setHasChosen(true)
  }

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined')
    setIsVisible(false)
    setHasChosen(true)
  }

  const handleCustomize = () => {
    localStorage.setItem('cookie-consent', 'customized')
    setIsVisible(false)
    setHasChosen(true)
  }

  if (hasChosen) return null

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
        >
          <div className="max-w-6xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-amber-100 p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center">
                  <Cookie className="w-6 h-6 text-amber-700" />
                </div>
                <div>
                  <h3 className="font-cormorant text-lg font-semibold text-chocolate-900">
                    We Value Your Privacy
                  </h3>
                  <p className="text-sm text-chocolate-600 mt-1 max-w-xl">
                    We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
                    By clicking "Accept", you consent to our use of cookies.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 md:ml-auto w-full md:w-auto">
                <button
                  onClick={handleCustomize}
                  className="px-5 py-2.5 text-sm font-medium text-chocolate-700 bg-chocolate-50 hover:bg-chocolate-100 rounded-lg transition-colors"
                >
                  Customize
                </button>
                <button
                  onClick={handleDecline}
                  className="px-5 py-2.5 text-sm font-medium text-chocolate-600 hover:text-chocolate-800 transition-colors"
                >
                  Decline
                </button>
                <button
                  onClick={handleAccept}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-amber-600 to-yellow-500 hover:from-amber-700 hover:to-yellow-600 rounded-lg shadow-md transition-all"
                >
                  Accept All
                </button>
              </div>

              <button
                onClick={handleDecline}
                className="absolute top-4 right-4 p-2 text-chocolate-400 hover:text-chocolate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
