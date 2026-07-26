import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Star, CheckCircle, Trash2, MessageSquare } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { AdminTablePage } from '@/components/admin/AdminTablePage'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import api from '@/services/api'
import { formatDateShort } from '@/lib/utils'
import type { Review, PaginatedResponse } from '@/types'
import toast from 'react-hot-toast'

export default function AdminReviews() {
  const queryClient = useQueryClient()
  const [statusFilter, setStatusFilter] = useState('all')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-reviews', statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.append('status', statusFilter)
      const { data } = await api.get(`/reviews/admin/all?${params.toString()}`)
      return data as PaginatedResponse<Review>
    },
  })

  const approveMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.put(`/reviews/${id}/approve`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] })
      toast.success('Review approved')
    },
    onError: () => toast.error('Failed to approve review'),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/reviews/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-reviews'] })
      toast.success('Review deleted')
      setDeleteId(null)
    },
    onError: () => toast.error('Failed to delete review'),
  })

  const reviews = data?.data || []

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`w-4 h-4 ${i < rating ? 'fill-gold text-gold' : 'text-chocolate-200'}`} />
      ))}
    </div>
  )

  return (
    <>
      <AdminTablePage
        title="Reviews"
        subtitle="Manage customer reviews"
        data={reviews}
        isLoading={isLoading}
        rowKey={(item) => item._id}
        emptyIcon={<MessageSquare className="w-8 h-8 text-chocolate-400" />}
        emptyTitle="No reviews found"
        emptyDescription="No reviews match your current filter."
        columns={[
          {
            key: 'user',
            label: 'User',
            render: (item) => (
              <div>
                <p className="font-medium text-chocolate-800">{item.user?.name || 'Anonymous'}</p>
                <p className="text-xs text-chocolate-500">{item.user?.email}</p>
              </div>
            ),
          },
          {
            key: 'rating',
            label: 'Rating',
            render: (item) => renderStars(item.rating),
          },
          {
            key: 'title',
            label: 'Title',
            render: (item) => (
              <span className="text-sm text-chocolate-700 truncate max-w-[200px] block">
                {item.title || '—'}
              </span>
            ),
          },
          {
            key: 'createdAt',
            label: 'Date',
            sortable: true,
            render: (item) => (
              <span className="text-sm text-chocolate-600">{formatDateShort(item.createdAt)}</span>
            ),
          },
          {
            key: 'isApproved',
            label: 'Status',
            render: (item) => (
              <Badge className={item.isApproved ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}>
                {item.isApproved ? 'Approved' : 'Pending'}
              </Badge>
            ),
          },
          {
            key: 'actions',
            label: 'Actions',
            className: 'w-28',
            render: (item) => (
              <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                {!item.isApproved && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-emerald-500 hover:text-emerald-600"
                    onClick={() => approveMutation.mutate(item._id)}
                    loading={approveMutation.isPending}
                  >
                    <CheckCircle className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-500 hover:text-red-600"
                  onClick={() => setDeleteId(item._id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ),
          },
        ]}
        filters={
          <Tabs value={statusFilter} onValueChange={setStatusFilter}>
            <TabsList className="bg-chocolate-100 p-1">
              <TabsTrigger value="all" className="data-[state=active]:bg-white">All</TabsTrigger>
              <TabsTrigger value="approved" className="data-[state=active]:bg-white">Approved</TabsTrigger>
              <TabsTrigger value="pending" className="data-[state=active]:bg-white">Pending</TabsTrigger>
            </TabsList>
          </Tabs>
        }
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete Review"
        description="Are you sure you want to delete this review? This action cannot be undone."
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        loading={deleteMutation.isPending}
      />
    </>
  )
}
