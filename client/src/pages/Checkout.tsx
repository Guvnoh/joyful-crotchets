import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CreditCard, Truck, CheckCircle, ChevronRight, Shield } from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'
import { useAuthStore } from '@/stores/authStore'
import { useCreateOrder } from '@/hooks/useOrders'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { formatPrice, getImageUrl } from '@/lib/utils'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

const shippingSchema = z.object({
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  street: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(5, 'ZIP code is required'),
  country: z.string().min(2, 'Country is required'),
})

const paymentSchema = z.object({
  paymentMethod: z.enum(['credit_card', 'paypal', 'cod']),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvv: z.string().optional(),
})

type ShippingFormData = z.infer<typeof shippingSchema>
type PaymentFormData = z.infer<typeof paymentSchema>

const steps = [
  { number: 1, label: 'Shipping', icon: Truck },
  { number: 2, label: 'Payment', icon: CreditCard },
  { number: 3, label: 'Review', icon: CheckCircle },
]

export default function Checkout() {
  const navigate = useNavigate()
  const { items, getSubtotal, getShipping, getTax, getTotal, couponCode, discount, clearCart } = useCartStore()
  const { user } = useAuthStore()
  const createOrder = useCreateOrder()

  const [currentStep, setCurrentStep] = useState(1)
  const [shippingData, setShippingData] = useState<ShippingFormData | null>(null)
  const [paymentData, setPaymentData] = useState<PaymentFormData | null>(null)
  const [isPlacing, setIsPlacing] = useState(false)

  const shippingForm = useForm<ShippingFormData>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      email: user?.email || '',
      phone: user?.phone || '',
      firstName: user?.name?.split(' ')[0] || '',
      lastName: user?.name?.split(' ').slice(1).join(' ') || '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US',
    },
  })

  const paymentForm = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentMethod: 'credit_card',
    },
  })

  const onShippingSubmit = (data: ShippingFormData) => {
    setShippingData(data)
    setCurrentStep(2)
  }

  const onPaymentSubmit = (data: PaymentFormData) => {
    setPaymentData(data)
    setCurrentStep(3)
  }

  const handlePlaceOrder = async () => {
    if (!shippingData || !paymentData) return
    setIsPlacing(true)

    try {
      const orderData = {
        items: items.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          color: item.color,
          size: item.size,
        })),
        shippingAddress: {
          firstName: shippingData.firstName,
          lastName: shippingData.lastName,
          email: shippingData.email,
          phone: shippingData.phone,
          street: shippingData.street,
          city: shippingData.city,
          state: shippingData.state,
          zipCode: shippingData.zipCode,
          country: shippingData.country,
        },
        paymentMethod: paymentData.paymentMethod,
        couponCode,
        notes: '',
      }

      const result = await createOrder.mutateAsync(orderData)
      clearCart()
      navigate(`/order-confirmation?order=${result.orderNumber}`)
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to place order')
    } finally {
      setIsPlacing(false)
    }
  }

  const subtotal = getSubtotal()
  const shippingCost = getShipping()
  const tax = getTax()
  const total = getTotal()

  return (
    <div className="min-h-screen bg-ivory">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Step Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-center gap-0">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300',
                      currentStep >= step.number
                        ? 'bg-gold border-gold text-white'
                        : 'bg-white border-sand/50 text-mocha'
                    )}
                  >
                    {currentStep > step.number ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <step.icon className="h-5 w-5" />
                    )}
                  </div>
                  <span
                    className={cn(
                      'text-xs mt-2 font-medium',
                      currentStep >= step.number ? 'text-gold' : 'text-mocha'
                    )}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      'w-20 sm:w-32 h-0.5 mx-2 mb-6',
                      currentStep > step.number ? 'bg-gold' : 'bg-sand/30'
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          {/* Main Content */}
          <div>
            {/* Step 1 - Shipping */}
            {currentStep === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl p-6 sm:p-8 premium-shadow"
              >
                <h2 className="font-display text-2xl font-semibold text-chocolate mb-6">Shipping Information</h2>
                <form onSubmit={shippingForm.handleSubmit(onShippingSubmit)} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="Email"
                      type="email"
                      {...shippingForm.register('email')}
                      error={shippingForm.formState.errors.email?.message}
                    />
                    <Input
                      label="Phone"
                      type="tel"
                      {...shippingForm.register('phone')}
                      error={shippingForm.formState.errors.phone?.message}
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="First Name"
                      {...shippingForm.register('firstName')}
                      error={shippingForm.formState.errors.firstName?.message}
                    />
                    <Input
                      label="Last Name"
                      {...shippingForm.register('lastName')}
                      error={shippingForm.formState.errors.lastName?.message}
                    />
                  </div>
                  <Input
                    label="Street Address"
                    {...shippingForm.register('street')}
                    error={shippingForm.formState.errors.street?.message}
                  />
                  <div className="grid sm:grid-cols-3 gap-4">
                    <Input
                      label="City"
                      {...shippingForm.register('city')}
                      error={shippingForm.formState.errors.city?.message}
                    />
                    <Input
                      label="State"
                      {...shippingForm.register('state')}
                      error={shippingForm.formState.errors.state?.message}
                    />
                    <Input
                      label="ZIP Code"
                      {...shippingForm.register('zipCode')}
                      error={shippingForm.formState.errors.zipCode?.message}
                    />
                  </div>
                  <Input
                    label="Country"
                    {...shippingForm.register('country')}
                    error={shippingForm.formState.errors.country?.message}
                  />
                  <Button type="submit" className="w-full sm:w-auto bg-gold text-white hover:bg-gold/90 px-8">
                    Continue to Payment
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </motion.div>
            )}

            {/* Step 2 - Payment */}
            {currentStep === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl p-6 sm:p-8 premium-shadow"
              >
                <h2 className="font-display text-2xl font-semibold text-chocolate mb-6">Payment Method</h2>
                <form onSubmit={paymentForm.handleSubmit(onPaymentSubmit)} className="space-y-6">
                  <RadioGroup
                    value={paymentForm.watch('paymentMethod')}
                    onValueChange={(value) => paymentForm.setValue('paymentMethod', value as any)}
                    className="space-y-3"
                  >
                    {[
                      { value: 'credit_card', label: 'Credit Card', icon: CreditCard },
                      { value: 'paypal', label: 'PayPal', icon: CreditCard },
                      { value: 'cod', label: 'Cash on Delivery', icon: Truck },
                    ].map((method) => (
                      <label
                        key={method.value}
                        className={cn(
                          'flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all',
                          paymentForm.watch('paymentMethod') === method.value
                            ? 'border-gold bg-gold/5'
                            : 'border-sand/30 hover:border-sand'
                        )}
                      >
                        <RadioGroupItem value={method.value} />
                        <method.icon className="h-5 w-5 text-mocha" />
                        <span className="font-medium text-chocolate">{method.label}</span>
                      </label>
                    ))}
                  </RadioGroup>

                  {paymentForm.watch('paymentMethod') === 'credit_card' && (
                    <div className="space-y-4 p-4 bg-cream/30 rounded-xl">
                      <Input
                        label="Card Number"
                        placeholder="1234 5678 9012 3456"
                        {...paymentForm.register('cardNumber')}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          label="Expiry Date"
                          placeholder="MM/YY"
                          {...paymentForm.register('cardExpiry')}
                        />
                        <Input
                          label="CVV"
                          placeholder="123"
                          {...paymentForm.register('cardCvv')}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(1)}
                      className="border-sand/50"
                    >
                      Back
                    </Button>
                    <Button type="submit" className="bg-gold text-white hover:bg-gold/90 px-8">
                      Review Order
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Step 3 - Review */}
            {currentStep === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl p-6 sm:p-8 premium-shadow"
              >
                <h2 className="font-display text-2xl font-semibold text-chocolate mb-6">Review Your Order</h2>

                {/* Order Items */}
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={`${item.product._id}-${item.color}-${item.size}`} className="flex gap-4 p-3 bg-cream/30 rounded-xl">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-beige flex-shrink-0">
                        {item.product.images?.[0] && (
                          <img
                            src={getImageUrl(item.product.images[0].url)}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-chocolate text-sm line-clamp-1">{item.product.name}</h4>
                        <p className="text-xs text-mocha">
                          {item.color && `Color: ${item.color}`}
                          {item.color && item.size && ' · '}
                          {item.size && `Size: ${item.size}`}
                        </p>
                        <p className="text-xs text-mocha">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-medium text-chocolate text-sm">{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>

                {/* Shipping Address */}
                {shippingData && (
                  <div className="p-4 bg-cream/30 rounded-xl mb-4">
                    <h4 className="font-medium text-chocolate text-sm mb-2">Shipping Address</h4>
                    <p className="text-sm text-mocha">
                      {shippingData.firstName} {shippingData.lastName}<br />
                      {shippingData.street}<br />
                      {shippingData.city}, {shippingData.state} {shippingData.zipCode}
                    </p>
                  </div>
                )}

                {/* Payment Method */}
                {paymentData && (
                  <div className="p-4 bg-cream/30 rounded-xl mb-6">
                    <h4 className="font-medium text-chocolate text-sm mb-2">Payment Method</h4>
                    <p className="text-sm text-mocha capitalize">
                      {paymentData.paymentMethod.replace('_', ' ')}
                    </p>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(2)}
                    className="border-sand/50"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handlePlaceOrder}
                    disabled={isPlacing}
                    className="flex-1 bg-gold text-white hover:bg-gold/90 h-12 text-lg font-semibold"
                  >
                    {isPlacing ? 'Placing Order...' : 'Place Order'}
                  </Button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white rounded-2xl p-6 premium-shadow">
              <h3 className="font-display text-lg font-semibold text-chocolate mb-4">Order Summary</h3>

              {/* Items Preview */}
              <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                {items.map((item) => (
                  <div key={`${item.product._id}-${item.color}-${item.size}`} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-beige flex-shrink-0">
                      {item.product.images?.[0] && (
                        <img
                          src={getImageUrl(item.product.images[0].url)}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-chocolate line-clamp-1">{item.product.name}</p>
                      <p className="text-xs text-mocha">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm text-chocolate">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <Separator className="bg-sand/30 my-4" />

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-mocha">Subtotal</span>
                  <span className="text-chocolate">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-mocha">Shipping</span>
                  <span className={cn('text-chocolate', shippingCost === 0 && 'text-green-600')}>
                    {shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-mocha">Tax</span>
                  <span className="text-chocolate">{formatPrice(tax)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Discount</span>
                    <span className="text-green-600">-{formatPrice(discount)}</span>
                  </div>
                )}
                <Separator className="bg-sand/30" />
                <div className="flex justify-between">
                  <span className="font-display font-semibold text-chocolate">Total</span>
                  <span className="font-display font-bold text-chocolate text-lg">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 p-3 bg-cream/30 rounded-lg">
                <Shield className="h-4 w-4 text-gold flex-shrink-0" />
                <p className="text-xs text-mocha">Secure checkout powered by Stripe</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
