import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Edit,
  Trash2,
  Tag,
  Copy,
  Check,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { DataTable, Column } from '@/components/admin/DataTable'
import { Skeleton } from '@/components/ui/skeleton'
import api from '@/services/api'
import { formatPrice, formatDateShort } from '@/lib/utils'
import type { Coupon } from '@/types'
import toast from 'react-hot-toast'

interface CouponFormData {
  code: string
  description: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  minPurchase: number
  maxDiscount: number
  usageLimit: number
  expiresAt: string
  isActive: boolean
}

const defaultFormData: CouponFormData = {
  code: '',
  description: '',
  discountType: 'percentage',
  discountValue: 10,
  minPurchase: 0,
  maxDiscount: 0,
  usageLimit: 0,
  expiresAt: '',
  isActive: true,
}

export default function AdminCoupons() {
  const queryClient = useQueryClient()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Coupon | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [formData, setFormData] = useState<CouponFormData>(defaultFormData)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-coupons'],
    queryFn: async () => {
      const { data } = await api.get('/coupons')
      return data.data as Coupon[]
    },
  })

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const { data: res } = await api.post('/coupons', data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-coupons'] })
      toast.success('Coupon created')
      closeModal()
    },
    onError: () => toast.error('Failed to create coupon'),
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { data: res } = await api.put(`/coupons/${id}`, data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-coupons'] })
      toast.success('Coupon updated')
      closeModal()
    },
    onError: () => toast.error('Failed to update coupon'),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/coupons/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-coupons'] })
      toast.success('Coupon deleted')
      setDeleteId(null)
    },
    onError: () => toast.error('Failed to delete coupon'),
  })

  const openModal = (item?: Coupon) => {
    if (item) {
      setEditingItem(item)
      setFormData({
        code: item.code,
        description: item.description || '',
        discountType: item.discountType,
        discountValue: item.discountValue,
        minPurchase: item.minPurchase,
        maxDiscount: item.maxDiscount || 0,
        usageLimit: item.usageLimit || 0,
        expiresAt: item.expiresAt ? new Date(item.expiresAt).toISOString().slice(0, 10) : '',
        isActive: item.isActive,
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
    if (!formData.code.trim()) {
      toast.error('Coupon code is required')
      return
    }

    const payload = {
      ...formData,
      code: formData.code.toUpperCase(),
      expiresAt: formData.expiresAt || undefined,
      maxDiscount: formData.maxDiscount || undefined,
      usageLimit: formData.usageLimit || undefined,
    }

    if (editingItem) {
      await updateMutation.mutateAsync({ id: editingItem._id, data: payload })
    } else {
      await createMutation.mutateAsync(payload)
    }
  }

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(code)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const coupons = data || []

  const columns: Column<Coupon>[] = [
    {
      key: 'code',
      label: 'Code',
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2">
          <span className="font-mono font-semibold text-chocolate-800">{item.code}</span>
          <button
            onClick={(e) => {
              e.stopPropagation()
              copyToClipboard(item.code)
            }}
            className="text-chocolate-400 hover:text-gold transition-colors"
          >
            {copiedCode === item.code ? (
              <Check className="w-4 h-4 text-emerald-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      ),
    },
    {
      key: 'discountType',
      label: 'Type',
      render: (item) => (
        <Badge className="bg-chocolate-100 text-chocolate-700 capitalize">
          {item.discountType}
        </Badge>
      ),
    },
    {
      key: 'discountValue',
      label: 'Value',
      sortable: true,
      render: (item) => (
        <span className="font-semibold text-chocolate-800">
          {item.discountType === 'percentage' ? `${item.discountValue}%` : formatPrice(item.discountValue)}
        </span>
      ),
    },
    {
      key: 'minPurchase',
      label: 'Min Purchase',
      render: (item) => (
        <span className="text-sm text-chocolate-600">
          {item.minPurchase > 0 ? formatPrice(item.minPurchase) : '—'}
        </span>
      ),
    },
    {
      key: 'usage',
      label: 'Usage',
      render: (item) => (
        <span className="text-sm text-chocolate-600">
          {item.usedCount} / {item.usageLimit || '∞'}
        </span>
      ),
    },
    {
      key: 'expiresAt',
      label: 'Expiry',
      sortable: true,
      render: (item) => {
        const isExpired = item.expiresAt && new Date(item.expiresAt) < new Date()
        return (
          <span className={`text-sm ${isExpired ? 'text-red-500' : 'text-chocolate-600'}`}>
            {item.expiresAt ? formatDateShort(item.expiresAt) : 'Never'}
          </span>
        )
      },
    },
    {
      key: 'isActive',
      label: 'Status',
      render: (item) => (
        <Badge className={item.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-chocolate-100 text-chocolate-600'}>
          {item.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      className: 'w-24',
      render: (item) => (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
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
      ),
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-chocolate-800 font-display">Coupons</h1>
          <p className="text-chocolate-500 text-sm mt-1">
            {coupons.length} total coupons
          </p>
        </div>
        <Button className="bg-gold hover:bg-gold-muted text-white" onClick={() => openModal()}>
          <Plus className="w-4 h-4 mr-2" />
          Create Coupon
        </Button>
      </motion.div>

      {/* Table */}
      <Card className="border-chocolate-100">
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={coupons}
            isLoading={isLoading}
            onRowClick={(item) => openModal(item)}
            rowKey={(item) => item._id}
            emptyIcon={<Tag className="w-8 h-8 text-chocolate-400" />}
            emptyTitle="No coupons found"
            emptyDescription="Create your first coupon to offer discounts."
          />
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editingItem ? 'Edit Coupon' : 'Create Coupon'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Code *</Label>
              <Input
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="e.g., SAVE20"
                className="font-mono"
              />
            </div>
            <div>
              <Label>Description</Label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Coupon description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Discount Type</Label>
                <Select
                  value={formData.discountType}
                  onValueChange={(v) => setFormData({ ...formData, discountType: v as 'percentage' | 'fixed' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Value *</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.discountValue}
                  onChange={(e) => setFormData({ ...formData, discountValue: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Min Purchase</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.minPurchase}
                  onChange={(e) => setFormData({ ...formData, minPurchase: parseFloat(e.target.value) || 0 })}
                />
              </div>
              <div>
                <Label>Max Discount</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.maxDiscount}
                  onChange={(e) => setFormData({ ...formData, maxDiscount: parseFloat(e.target.value) || 0 })}
                  placeholder="No limit"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Usage Limit</Label>
                <Input
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) => setFormData({ ...formData, usageLimit: parseInt(e.target.value) || 0 })}
                  placeholder="Unlimited"
                />
              </div>
              <div>
                <Label>Expiry Date</Label>
                <Input
                  type="date"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label>Active</Label>
              <Switch
                checked={formData.isActive}
                onCheckedChange={(v) => setFormData({ ...formData, isActive: v })}
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
            <DialogTitle>Delete Coupon</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this coupon?
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
