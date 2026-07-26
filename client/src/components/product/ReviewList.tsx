import { useState } from 'react'
import { Star, ThumbsUp, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { useReviews } from '@/hooks/useReviews'
import { useAuthStore } from '@/stores/authStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { ReviewForm } from './ReviewForm'
import { formatDate, getInitials } from '@/lib/utils'

interface ReviewListProps {
  productId: string
}

export function ReviewList({ productId }: ReviewListProps) {
  const [showReviewForm, setShowReviewForm] = useState(false)
  const { isAuthenticated } = useAuthStore()
  const { data, isLoading } = useReviews(productId)

  const reviews = data?.data || []
  const averageRating = data?.averageRating || 0
  const totalReviews = data?.total || reviews.length

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => {
    const count = reviews.filter((r: any) => Math.round(r.rating) === rating).length
    return {
      rating,
      count,
      percentage: totalReviews > 0 ? (count / totalReviews) * 100 : 0,
    }
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">
          <div className="space-y-3">
            <div className="h-16 w-24 bg-beige animate-pulse rounded" />
            <div className="h-4 w-16 bg-beige animate-pulse rounded" />
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-beige animate-pulse rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">
        <div className="text-center md:text-left">
          <div className="text-5xl font-display font-bold text-chocolate">{averageRating.toFixed(1)}</div>
          <div className="flex items-center justify-center md:justify-start mt-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-5 w-5 ${
                  i < Math.round(averageRating) ? 'fill-gold text-gold' : 'fill-beige text-beige'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-mocha mt-1">{totalReviews} reviews</p>
        </div>

        <div className="space-y-2">
          {ratingDistribution.map(({ rating, count, percentage }) => (
            <div key={rating} className="flex items-center gap-3">
              <span className="text-sm font-medium text-mocha w-8">{rating}★</span>
              <Progress value={percentage} className="flex-1 h-2" />
              <span className="text-sm text-mocha w-8 text-right">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Write Review Button */}
      {isAuthenticated && !showReviewForm && (
        <Button
          variant="outline"
          className="border-gold/30 text-chocolate hover:bg-gold hover:text-white"
          onClick={() => setShowReviewForm(true)}
        >
          Write a Review
        </Button>
      )}

      {/* Review Form */}
      {showReviewForm && (
        <ReviewForm
          productId={productId}
          onSuccess={() => setShowReviewForm(false)}
          onCancel={() => setShowReviewForm(false)}
        />
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-12">
            <Star className="h-12 w-12 text-beige mx-auto mb-4" />
            <p className="text-mocha font-display text-lg">No reviews yet</p>
            <p className="text-sm text-mocha/70 mt-1">Be the first to review this product</p>
          </div>
        ) : (
          reviews.map((review: any, index: number) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-sand/30">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gold/10 text-gold text-sm">
                        {getInitials(review.user?.name || 'A')}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-chocolate">{review.user?.name || 'Anonymous'}</h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-3.5 w-3.5 ${
                                    i < review.rating ? 'fill-gold text-gold' : 'fill-beige text-beige'
                                  }`}
                                />
                              ))}
                            </div>
                            {review.isVerifiedPurchase && (
                              <span className="text-xs text-green-600 font-medium">Verified Purchase</span>
                            )}
                          </div>
                        </div>
                        <span className="text-xs text-mocha">{formatDate(review.createdAt)}</span>
                      </div>

                      {review.title && (
                        <h5 className="font-semibold text-chocolate mt-3">{review.title}</h5>
                      )}
                      <p className="text-mocha mt-2 leading-relaxed">{review.comment}</p>

                      <div className="flex items-center gap-4 mt-4">
                        <button className="flex items-center gap-1.5 text-xs text-mocha hover:text-gold transition-colors">
                          <ThumbsUp className="h-3.5 w-3.5" />
                          Helpful ({review.helpfulCount || 0})
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {!isAuthenticated && reviews.length > 0 && (
        <div className="text-center py-6 border-t border-sand/30">
          <p className="text-sm text-mocha">
            <a href="/login" className="text-gold hover:underline font-medium">Sign in</a> to write a review
          </p>
        </div>
      )}
    </div>
  )
}
