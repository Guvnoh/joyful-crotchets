import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, Package, Truck, Home, ShoppingBag, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const steps = [
  { icon: CheckCircle, label: 'Order Confirmed', description: 'We\'ve received your order', status: 'complete' },
  { icon: Package, label: 'Processing', description: 'We\'re preparing your items', status: 'current' },
  { icon: Truck, label: 'Shipping', description: 'Your order is on its way', status: 'upcoming' },
  { icon: Home, label: 'Delivered', description: 'Enjoy your items!', status: 'upcoming' },
]

export default function OrderConfirmation() {
  const [searchParams] = useSearchParams()
  const orderNumber = searchParams.get('order') || 'JC-UNKNOWN'

  return (
    <div className="min-h-screen bg-ivory">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="mb-8"
          >
            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
              >
                <CheckCircle className="h-12 w-12 text-green-500" />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h1 className="font-display text-4xl font-bold text-chocolate mb-4">
              Order Confirmed!
            </h1>
            <p className="text-mocha mb-2">
              Thank you for your purchase. Your order has been received.
            </p>
            <p className="text-sm text-mocha mb-8">
              Order Number: <span className="font-mono font-semibold text-gold">{orderNumber}</span>
            </p>
          </motion.div>

          {/* Order Status Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="border-sand/30 mb-8">
              <CardContent className="p-6 sm:p-8">
                <h2 className="font-display text-lg font-semibold text-chocolate mb-6">What's Next</h2>
                <div className="space-y-6">
                  {steps.map((step, index) => (
                    <div key={step.label} className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          step.status === 'complete'
                            ? 'bg-green-100 text-green-500'
                            : step.status === 'current'
                            ? 'bg-gold/10 text-gold'
                            : 'bg-beige/50 text-mocha/50'
                        }`}
                      >
                        <step.icon className="h-5 w-5" />
                      </div>
                      <div className="text-left flex-1">
                        <p className={`font-medium ${step.status === 'upcoming' ? 'text-mocha/50' : 'text-chocolate'}`}>
                          {step.label}
                        </p>
                        <p className={`text-sm ${step.status === 'upcoming' ? 'text-mocha/40' : 'text-mocha'}`}>
                          {step.description}
                        </p>
                      </div>
                      {step.status === 'complete' && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/shop">
              <Button size="lg" className="bg-gold text-white hover:bg-gold/90 px-8">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Continue Shopping
              </Button>
            </Link>
            <Link to="/profile?tab=orders">
              <Button size="lg" variant="outline" className="border-gold/30 text-chocolate hover:bg-gold hover:text-white px-8">
                View My Orders
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>

          {/* Confirmation Email Notice */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-sm text-mocha mt-8"
          >
            A confirmation email has been sent to your email address.
          </motion.p>
        </div>
      </div>
    </div>
  )
}
