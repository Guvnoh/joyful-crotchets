import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

const forgotSchema = z.object({
  email: z.string().email('Valid email is required'),
})

type ForgotFormData = z.infer<typeof forgotSchema>

export default function ForgotPassword() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
  })

  const onSubmit = async (data: ForgotFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="border-sand/30">
          <CardContent className="p-8">
            {isSubmitted ? (
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <h2 className="font-display text-2xl font-bold text-chocolate mb-3">Check Your Email</h2>
                <p className="text-mocha mb-6">
                  We've sent a password reset link to your email address. Please check your inbox and follow the instructions.
                </p>
                <p className="text-sm text-mocha mb-6">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
                <Link to="/login">
                  <Button variant="outline" className="border-gold/30 text-chocolate hover:bg-gold hover:text-white">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Login
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
                    <Mail className="h-8 w-8 text-gold" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-chocolate mb-3">Forgot Password?</h2>
                  <p className="text-mocha">
                    No worries! Enter your email address and we'll send you a link to reset your password.
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    icon={<Mail className="h-4 w-4" />}
                    {...register('email')}
                    error={errors.email?.message}
                  />

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-gold text-white hover:bg-gold/90"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                  </Button>
                </form>

                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 mt-6 text-sm text-mocha hover:text-gold transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Login
                </Link>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
