import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Edit,
  Trash2,
  Star,
  MessageSquare,
  ArrowUp,
  ArrowDown,
  GripVertical,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import api from '@/services/api'
import { truncate, formatDateShort } from '@/lib/utils'
import type { Testimonial } from '@/types'
import toast from 'react-hot-toast'

interface TestimonialFormData {
  customerName: string
  customerTitle: string
  content: string
  rating: number
  isFeatured: boolean
  isPublished: boolean
  sortOrder: number
}

const defaultFormData: TestimonialFormData = {
  customerName: '',
  customerTitle: '',
  content: '',
  rating: 5,
  isFeatured: false,
  isPublished: true,
  sortOrder: 0,
}

export default function AdminTestimonials() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Testimonial | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [formData, setFormData] = useState<TestimonialFormData>(defaultFormData)

  const { data: testimonials, isLoading } = useQuery({
    queryKey: ['admin-testimonials'],
    queryFn: async () => {
      const { data } = await api.get('/testimonials')
      return data.data as Testimonial[]
    },
  })

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const { data: res } = await api.post('/testimonials', data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] })
      toast.success('Testimonial created')
      closeModal()
    },
    onError: () => toast.error('Failed to create testimonial'),
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { data: res } = await api.put(`/testimonials/${id}`, data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] })
      toast.success('Testimonial updated')
      closeModal()
    },
    onError: () => toast.error('Failed to update testimonial'),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/testimonials/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] })
      toast.success('Testimonial deleted')
      setDeleteId(null)
    },
    onError: () => toast.error('Failed to delete testimonial'),
  })

  const toggleFeatured = useMutation({
    mutationFn: async ({ id, isFeatured }: { id: string; isFeatured: boolean }) => {
      await api.put(`/testimonials/${id}`, { isFeatured })
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] }),
  })

  const togglePublished = useMutation({
    mutationFn: async ({ id, isPublished }: { id: string; isPublished: boolean }) => {
      await api.put(`/testimonials/${id}`, { isPublished })
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] }),
  })

  const openModal = (item?: Testimonial) => {
    if (item) {
      setEditingItem(item)
      setFormData({
        customerName: item.customerName,
        customerTitle: item.customerTitle || '',
        content: item.content,
        rating: item.rating || 5,
        isFeatured: item.isFeatured,
        isPublished: item.isPublished,
        sortOrder: item.sortOrder,
      })
    } else {
      setEditingItem(null)
      setFormData(defaultFormData)
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingItem(null)
    setFormData(defaultFormData)
  }

  const handleSubmit = async () => {
    if (!formData.customerName.trim() || !formData.content.trim()) {
      toast.error('Name and content are required')
      return
    }

    if (editingItem) {
      await updateMutation.mutateAsync({ id: editingItem._id, data: formData })
    } else {
      await createMutation.mutateAsync(formData)
    }
  }

  const handleMoveUp = async (item: Testimonial) => {
    if (item.sortOrder <= 0) return
    await updateMutation.mutateAsync({
      id: item._id,
      data: { sortOrder: item.sortOrder - 1 },
    })
  }

  const handleMoveDown = async (item: Testimonial) => {
    await updateMutation.mutateAsync({
      id: item._id,
      data: { sortOrder: item.sortOrder + 1 },
    })
  }

  const sortedTestimonials = [...(testimonials || [])].sort((a, b) => a.sortOrder - b.sortOrder)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-chocolate-800 font-display">Testimonials</h1>
          <p className="text-chocolate-500 text-sm mt-1">
            {testimonials?.length || 0} testimonials
          </p>
        </div>
        <Button className="bg-gold hover:bg-gold-muted text-white" onClick={() => openModal()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Testimonial
        </Button>
      </motion.div>

      {/* List */}
      {sortedTestimonials.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <MessageSquare className="w-12 h-12 text-chocolate-300 mb-3" />
          <h3 className="text-lg font-semibold text-chocolate-800">No testimonials yet</h3>
          <p className="text-sm text-chocolate-500 mt-1">Add your first testimonial to showcase customer feedback.</p>
          <Button className="mt-4 bg-gold hover:bg-gold-muted text-white" onClick={() => openModal()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Testimonial
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {sortedTestimonials.map((item, index) => (
              <motion.div
                key={item._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="border-chocolate-100 hover:shadow-md transition-shadow">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleMoveUp(item)}
                          disabled={item.sortOrder <= 0}
                        >
                          <ArrowUp className="w-4 h-4" />
                        </Button>
                        <span className="text-xs text-chocolate-400">{item.sortOrder}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleMoveDown(item)}
                        >
                          <ArrowDown className="w-4 h-4" />
                        </Button>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-chocolate-800">{item.customerName}</h3>
                          {item.customerTitle && (
                            <span className="text-sm text-chocolate-500">— {item.customerTitle}</span>
                          )}
                          {item.isFeatured && <Badge className="bg-gold text-white">Featured</Badge>}
                          <Badge className={item.isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-chocolate-100 text-chocolate-600'}>
                            {item.isPublished ? 'Published' : 'Draft'}
                          </Badge>
                        </div>
                        {item.rating && (
                          <div className="flex items-center gap-0.5 mb-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < item.rating! ? 'fill-gold text-gold' : 'text-chocolate-200'}`}
                              />
                            ))}
                          </div>
                        )}
                        <p className="text-sm text-chocolate-600">{truncate(item.content, 200)}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <div className="flex items-center gap-2">
                          <Label className="text-xs text-chocolate-500">Featured</Label>
                          <Switch
                            checked={item.isFeatured}
                            onCheckedChange={(v) => toggleFeatured.mutate({ id: item._id, isFeatured: v })}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Label className="text-xs text-chocolate-500">Published</Label>
                          <Switch
                            checked={item.isPublished}
                            onCheckedChange={(v) => togglePublished.mutate({ id: item._id, isPublished: v })}
                          />
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openModal(item)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500"
                          onClick={() => setDeleteId(item._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editingItem ? 'Edit Testimonial' : 'Add Testimonial'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Customer Name *</Label>
              <Input
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="Customer name"
              />
            </div>
            <div>
              <Label>Title / Position</Label>
              <Input
                value={formData.customerTitle}
                onChange={(e) => setFormData({ ...formData, customerTitle: e.target.value })}
                placeholder="e.g., Happy Customer"
              />
            </div>
            <div>
              <Label>Content *</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Testimonial content..."
                rows={4}
              />
            </div>
            <div>
              <Label>Rating</Label>
              <div className="flex items-center gap-1 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: i + 1 })}
                  >
                    <Star
                      className={`w-6 h-6 cursor-pointer transition-colors ${
                        i < formData.rating ? 'fill-gold text-gold' : 'text-chocolate-200 hover:text-chocolate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label>Featured</Label>
              <Switch
                checked={formData.isFeatured}
                onCheckedChange={(v) => setFormData({ ...formData, isFeatured: v })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label>Published</Label>
              <Switch
                checked={formData.isPublished}
                onCheckedChange={(v) => setFormData({ ...formData, isPublished: v })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>Cancel</Button>
            <Button
              className="bg-gold hover:bg-gold-muted text-white"
              onClick={handleSubmit}
              loading={createMutation.isPending || updateMutation.isPending}
            >
              {editingItem ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Testimonial</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this testimonial?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={() => deleteId && deleteMutation.mutate(deleteId)}
              loading={deleteMutation.isPending}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
