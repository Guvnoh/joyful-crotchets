import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, ArrowLeft, CheckCircle } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'

const resetSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type ResetFormData = z.infer<typeof resetSchema>

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  })

  const onSubmit = async (data: ResetFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSuccess(true)
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center p-4">
        <Card className="border-sand/30 max-w-md w-full">
          <CardContent className="p-8 text-center">
            <h2 className="font-display text-2xl font-bold text-chocolate mb-3">Invalid Link</h2>
            <p className="text-mocha mb-6">
              This password reset link is invalid or has expired.
            </p>
            <Link to="/forgot-password">
              <Button className="bg-gold text-white hover:bg-gold/90">
                Request New Link
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
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
            {isSuccess ? (
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
                <h2 className="font-display text-2xl font-bold text-chocolate mb-3">Password Reset!</h2>
                <p className="text-mocha mb-6">
                  Your password has been successfully reset. You can now sign in with your new password.
                </p>
                <Link to="/login">
                  <Button className="bg-gold text-white hover:bg-gold/90">
                    Sign In
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
                    <Lock className="h-8 w-8 text-gold" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-chocolate mb-3">Reset Password</h2>
                  <p className="text-mocha">
                    Enter your new password below.
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <Input
                    label="New Password"
                    type="password"
                    placeholder="Enter new password"
                    icon={<Lock className="h-4 w-4" />}
                    {...register('password')}
                    error={errors.password?.message}
                  />

                  <Input
                    label="Confirm Password"
                    type="password"
                    placeholder="Confirm new password"
                    icon={<Lock className="h-4 w-4" />}
                    {...register('confirmPassword')}
                    error={errors.confirmPassword?.message}
                  />

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-gold text-white hover:bg-gold/90"
                  >
                    {isSubmitting ? 'Resetting...' : 'Reset Password'}
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
