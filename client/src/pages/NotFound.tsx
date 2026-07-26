import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Home, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center px-4">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h1 className="font-display text-[10rem] md:text-[14rem] font-bold leading-none text-gradient select-none">
            404
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-chocolate mt-4 mb-4">
            Page Not Found
          </h2>
          <p className="text-mocha max-w-md mx-auto mb-8">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back on track.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/">
              <Button size="lg" className="bg-gold text-white hover:bg-gold/90 px-8">
                <Home className="mr-2 h-5 w-5" />
                Back to Home
              </Button>
            </Link>
            <Link to="/shop">
              <Button size="lg" variant="outline" className="border-gold/30 text-chocolate hover:bg-gold hover:text-white px-8">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Browse Shop
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Decorative elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute inset-0 pointer-events-none overflow-hidden"
        >
          <div className="absolute top-20 left-10 w-32 h-32 bg-gold rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-caramel rounded-full blur-3xl" />
        </motion.div>
      </div>
    </div>
  )
}
