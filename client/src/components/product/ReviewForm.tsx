import { useState } from 'react'
import { Star } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCreateReview } from '@/hooks/useReviews'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import toast from 'react-hot-toast'

const reviewSchema = z.object({
  rating: z.number().min(1, 'Please select a rating').max(5),
  title: z.string().min(1, 'Title is required').max(100),
  comment: z.string().min(10, 'Review must be at least 10 characters').max(2000),
})

type ReviewFormData = z.infer<typeof reviewSchema>

interface ReviewFormProps {
  productId: string
  onSuccess?: () => void
  onCancel?: () => void
}

export function ReviewForm({ productId, onSuccess, onCancel }: ReviewFormProps) {
  const [hoveredRating, setHoveredRating] = useState(0)
  const createReview = useCreateReview()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      title: '',
      comment: '',
    },
  })

  const selectedRating = watch('rating')

  const onSubmit = async (data: ReviewFormData) => {
    try {
      await createReview.mutateAsync({
        productId,
        ...data,
      })
      toast.success('Review submitted successfully!')
      onSuccess?.()
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to submit review')
    }
  }

  return (
    <Card className="border-gold/20">
      <CardHeader>
        <CardTitle className="font-display text-lg text-chocolate">Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Rating Selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-chocolate">Your Rating *</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() => setValue('rating', rating, { shouldValidate: true })}
                  onMouseEnter={() => setHoveredRating(rating)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-0.5 transition-transform hover:scale-110"
                >
                  <Star
                    className={cn(
                      'h-8 w-8 transition-colors',
                      (hoveredRating || selectedRating) >= rating
                        ? 'fill-gold text-gold'
                        : 'fill-beige text-beige'
                    )}
                  />
                </button>
              ))}
              {selectedRating > 0 && (
                <span className="ml-2 text-sm text-mocha">
                  {selectedRating === 1 && 'Poor'}
                  {selectedRating === 2 && 'Fair'}
                  {selectedRating === 3 && 'Good'}
                  {selectedRating === 4 && 'Very Good'}
                  {selectedRating === 5 && 'Excellent'}
                </span>
              )}
            </div>
            {errors.rating && (
              <p className="text-sm text-destructive">{errors.rating.message}</p>
            )}
          </div>

          {/* Title */}
          <Input
            label="Review Title *"
            placeholder="Summarize your experience"
            {...register('title')}
            error={errors.title?.message}
          />

          {/* Comment */}
          <Textarea
            label="Your Review *"
            placeholder="Tell others about your experience with this product..."
            rows={5}
            {...register('comment')}
            error={errors.comment?.message}
          />

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gold text-white hover:bg-gold/90"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="border-sand/50"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
