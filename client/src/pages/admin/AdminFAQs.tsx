import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Edit,
  Trash2,
  HelpCircle,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import api from '@/services/api'
import { truncate } from '@/lib/utils'
import type { FAQ } from '@/types'
import toast from 'react-hot-toast'

interface FAQFormData {
  question: string
  answer: string
  category: string
  isPublished: boolean
  sortOrder: number
}

const defaultFormData: FAQFormData = {
  question: '',
  answer: '',
  category: 'General',
  isPublished: true,
  sortOrder: 0,
}

const faqCategories = ['General', 'Shipping', 'Returns', 'Products', 'Payment', 'Custom Orders']

export default function AdminFAQs() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<FAQ | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [formData, setFormData] = useState<FAQFormData>(defaultFormData)

  const { data: faqs, isLoading } = useQuery({
    queryKey: ['admin-faqs'],
    queryFn: async () => {
      const { data } = await api.get('/faqs')
      return data.data as FAQ[]
    },
  })

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const { data: res } = await api.post('/faqs', data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-faqs'] })
      toast.success('FAQ created')
      closeModal()
    },
    onError: () => toast.error('Failed to create FAQ'),
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { data: res } = await api.put(`/faqs/${id}`, data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-faqs'] })
      toast.success('FAQ updated')
      closeModal()
    },
    onError: () => toast.error('Failed to update FAQ'),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/faqs/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-faqs'] })
      toast.success('FAQ deleted')
      setDeleteId(null)
    },
    onError: () => toast.error('Failed to delete FAQ'),
  })

  const openModal = (item?: FAQ) => {
    if (item) {
      setEditingItem(item)
      setFormData({
        question: item.question,
        answer: item.answer,
        category: item.category || 'General',
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
    if (!formData.question.trim() || !formData.answer.trim()) {
      toast.error('Question and answer are required')
      return
    }

    if (editingItem) {
      await updateMutation.mutateAsync({ id: editingItem._id, data: formData })
    } else {
      await createMutation.mutateAsync(formData)
    }
  }

  const sortedFaqs = [...(faqs || [])].sort((a, b) => a.sortOrder - b.sortOrder)
  const groupedFaqs = sortedFaqs.reduce((acc, faq) => {
    const cat = faq.category || 'General'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(faq)
    return acc
  }, {} as Record<string, FAQ[]>)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
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
          <h1 className="text-2xl font-bold text-chocolate-800 font-display">FAQs</h1>
          <p className="text-chocolate-500 text-sm mt-1">
            {faqs?.length || 0} frequently asked questions
          </p>
        </div>
        <Button className="bg-gold hover:bg-gold-muted text-white" onClick={() => openModal()}>
          <Plus className="w-4 h-4 mr-2" />
          Add FAQ
        </Button>
      </motion.div>

      {/* Grouped FAQs */}
      {Object.keys(groupedFaqs).length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <HelpCircle className="w-12 h-12 text-chocolate-300 mb-3" />
          <h3 className="text-lg font-semibold text-chocolate-800">No FAQs yet</h3>
          <p className="text-sm text-chocolate-500 mt-1">Add frequently asked questions for your customers.</p>
          <Button className="mt-4 bg-gold hover:bg-gold-muted text-white" onClick={() => openModal()}>
            <Plus className="w-4 h-4 mr-2" />
            Add FAQ
          </Button>
        </div>
      ) : (
        Object.entries(groupedFaqs).map(([category, items]) => (
          <Card key={category} className="border-chocolate-100">
            <CardHeader>
              <CardTitle className="text-lg font-display text-chocolate-800 flex items-center gap-2">
                {category}
                <Badge className="bg-chocolate-100 text-chocolate-600">{items.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <AnimatePresence>
                {items.map((faq) => (
                  <motion.div
                    key={faq._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-4 bg-chocolate-50 rounded-lg"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-chocolate-800">{faq.question}</h4>
                          <Badge className={faq.isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-chocolate-100 text-chocolate-600'}>
                            {faq.isPublished ? 'Published' : 'Draft'}
                          </Badge>
                        </div>
                        <p className="text-sm text-chocolate-600">{truncate(faq.answer, 150)}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openModal(faq)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500"
                          onClick={() => setDeleteId(faq._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </CardContent>
          </Card>
        ))
      )}

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editingItem ? 'Edit FAQ' : 'Add FAQ'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Question *</Label>
              <Input
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                placeholder="What is your question?"
              />
            </div>
            <div>
              <Label>Answer *</Label>
              <Textarea
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                placeholder="Provide a detailed answer..."
                rows={5}
              />
            </div>
            <div>
              <Label>Category</Label>
              <Select
                value={formData.category}
                onValueChange={(v) => setFormData({ ...formData, category: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {faqCategories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
            <DialogTitle>Delete FAQ</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this FAQ?
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
