import { useState, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { PenTool, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AdminTablePage } from '@/components/admin/AdminTablePage'
import api from '@/services/api'
import { formatPrice, formatDate, formatDateShort } from '@/lib/utils'
import type { CustomOrder, PaginatedResponse } from '@/types'
import toast from 'react-hot-toast'

const customStatuses = ['pending', 'reviewing', 'quoted', 'accepted', 'in_progress', 'completed', 'cancelled']

const customStatusLabels: Record<string, string> = {
  pending: 'Pending',
  reviewing: 'Reviewing',
  quoted: 'Quoted',
  accepted: 'Accepted',
  in_progress: 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  reviewing: 'bg-blue-100 text-blue-700',
  quoted: 'bg-purple-100 text-purple-700',
  accepted: 'bg-indigo-100 text-indigo-700',
  in_progress: 'bg-cyan-100 text-cyan-700',
  completed: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
}

export default function AdminCustomOrders() {
  const queryClient = useQueryClient()
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedOrder, setSelectedOrder] = useState<CustomOrder | null>(null)
  const [quotedPrice, setQuotedPrice] = useState('')
  const [adminNotes, setAdminNotes] = useState('')
  const [newStatus, setNewStatus] = useState('')

  const page = parseInt(searchParams.get('page') || '1', 10)
  const statusFilter = searchParams.get('status') || 'all'

  const setParam = useCallback((key: string, value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (value && value !== 'all') next.set(key, value)
      else next.delete(key)
      if (key !== 'page') next.delete('page')
      return next
    })
  }, [setSearchParams])

  const { data, isLoading } = useQuery({
    queryKey: ['admin-custom-orders', page, statusFilter],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), limit: '10' })
      if (statusFilter !== 'all') params.append('status', statusFilter)
      const { data } = await api.get(`/custom-orders?${params.toString()}`)
      return data as PaginatedResponse<CustomOrder>
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const { data: res } = await api.put(`/custom-orders/${id}`, data)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-custom-orders'] })
      toast.success('Custom order updated')
      setSelectedOrder(null)
    },
    onError: () => toast.error('Failed to update'),
  })

  const orders = data?.data || []
  const pagination = data?.pagination

  const handleUpdate = () => {
    if (!selectedOrder) return
    const payload: any = {}
    if (quotedPrice) payload.quotedPrice = parseFloat(quotedPrice)
    if (adminNotes) payload.adminNotes = adminNotes
    if (newStatus) payload.status = newStatus
    updateMutation.mutate({ id: selectedOrder._id, data: payload })
  }

  const openDetail = (order: CustomOrder) => {
    setSelectedOrder(order)
    setQuotedPrice(order.quotedPrice?.toString() || '')
    setAdminNotes(order.adminNotes || '')
    setNewStatus(order.status)
  }

  return (
    <>
      <AdminTablePage
        title="Custom Orders"
        subtitle={`${pagination?.total || 0} custom order requests`}
        data={orders}
        columns={[
          {
            key: 'customerInfo',
            label: 'Customer',
            render: (item) => (
              <div>
                <p className="font-medium text-chocolate-800">{item.customerInfo?.name}</p>
                <p className="text-xs text-chocolate-500">{item.customerInfo?.email}</p>
              </div>
            ),
          },
          {
            key: 'projectType',
            label: 'Project Type',
            sortable: true,
            render: (item) => (
              <span className="text-sm text-chocolate-700">{item.projectType}</span>
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
            key: 'budget',
            label: 'Budget',
            render: (item) => (
              <span className="text-sm text-chocolate-600">
                {item.budget ? `${formatPrice(item.budget.min)} - ${formatPrice(item.budget.max)}` : '—'}
              </span>
            ),
          },
          {
            key: 'status',
            label: 'Status',
            render: (item) => (
              <Badge className={statusColors[item.status] || 'bg-chocolate-100 text-chocolate-600'}>
                {customStatusLabels[item.status] || item.status}
              </Badge>
            ),
          },
          {
            key: 'actions',
            label: 'Actions',
            className: 'w-20',
            render: (item) => (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation()
                  openDetail(item)
                }}
              >
                <Eye className="w-4 h-4" />
              </Button>
            ),
          },
        ]}
        isLoading={isLoading}
        total={pagination?.total || 0}
        page={page}
        limit={10}
        onPageChange={(p) => setParam('page', String(p))}
        onRowClick={openDetail}
        rowKey={(item) => item._id}
        emptyIcon={<PenTool className="w-8 h-8 text-chocolate-400" />}
        emptyTitle="No custom orders found"
        emptyDescription="No custom orders match your filter."
        filters={
          <Tabs value={statusFilter} onValueChange={(v) => { setParam('status', v) }}>
            <TabsList className="bg-chocolate-100 p-1 flex-wrap h-auto">
              <TabsTrigger value="all" className="data-[state=active]:bg-white">All</TabsTrigger>
              {customStatuses.map((s) => (
                <TabsTrigger key={s} value={s} className="data-[state=active]:bg-white capitalize">
                  {customStatusLabels[s]}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        }
      />

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display">Custom Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="p-4 bg-chocolate-50 rounded-lg">
                <h4 className="font-semibold text-chocolate-800 mb-2">Customer Information</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-chocolate-500">Name:</span> <span className="text-chocolate-800">{selectedOrder.customerInfo?.name}</span></div>
                  <div><span className="text-chocolate-500">Email:</span> <span className="text-chocolate-800">{selectedOrder.customerInfo?.email}</span></div>
                  <div><span className="text-chocolate-500">Phone:</span> <span className="text-chocolate-800">{selectedOrder.customerInfo?.phone}</span></div>
                  <div><span className="text-chocolate-500">Project:</span> <span className="text-chocolate-800">{selectedOrder.projectType}</span></div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-chocolate-800 mb-2">Description</h4>
                <p className="text-sm text-chocolate-600">{selectedOrder.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {selectedOrder.budget && (
                  <div>
                    <h4 className="font-semibold text-chocolate-800 mb-1">Budget</h4>
                    <p className="text-sm text-chocolate-600">
                      {formatPrice(selectedOrder.budget.min)} - {formatPrice(selectedOrder.budget.max)}
                    </p>
                  </div>
                )}
                {selectedOrder.preferredCompletionDate && (
                  <div>
                    <h4 className="font-semibold text-chocolate-800 mb-1">Preferred Date</h4>
                    <p className="text-sm text-chocolate-600">{formatDate(selectedOrder.preferredCompletionDate)}</p>
                  </div>
                )}
                {selectedOrder.dimensions && (
                  <div>
                    <h4 className="font-semibold text-chocolate-800 mb-1">Dimensions</h4>
                    <p className="text-sm text-chocolate-600">{selectedOrder.dimensions}</p>
                  </div>
                )}
                {selectedOrder.materials && (
                  <div>
                    <h4 className="font-semibold text-chocolate-800 mb-1">Materials</h4>
                    <p className="text-sm text-chocolate-600">{selectedOrder.materials}</p>
                  </div>
                )}
              </div>

              {selectedOrder.referenceImages && selectedOrder.referenceImages.length > 0 && (
                <div>
                  <h4 className="font-semibold text-chocolate-800 mb-2">Reference Images</h4>
                  <div className="flex gap-2 flex-wrap">
                    {selectedOrder.referenceImages.map((img, i) => (
                      <div key={i} className="w-20 h-20 rounded-lg overflow-hidden bg-chocolate-100">
                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedOrder.timeline && selectedOrder.timeline.length > 0 && (
                <div>
                  <h4 className="font-semibold text-chocolate-800 mb-2">Timeline</h4>
                  <div className="relative pl-6 space-y-3">
                    <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-chocolate-200" />
                    {selectedOrder.timeline.map((event, i) => (
                      <div key={i} className="relative">
                        <div className="absolute -left-4 top-1 w-3 h-3 rounded-full bg-gold border-2 border-white" />
                        <div>
                          <p className="text-sm font-medium text-chocolate-800 capitalize">{event.status}</p>
                          <p className="text-xs text-chocolate-500">{formatDate(event.date)}</p>
                          {event.note && <p className="text-sm text-chocolate-600 mt-1">{event.note}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 space-y-4">
                <h4 className="font-semibold text-chocolate-800">Update Order</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Status</Label>
                    <Select value={newStatus} onValueChange={setNewStatus}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {customStatuses.map((s) => (
                          <SelectItem key={s} value={s}>{customStatusLabels[s]}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Quoted Price ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={quotedPrice}
                      onChange={(e) => setQuotedPrice(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div>
                  <Label>Admin Notes</Label>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add notes..."
                    rows={3}
                  />
                </div>
                <Button
                  className="bg-gold hover:bg-gold-muted text-white"
                  onClick={handleUpdate}
                  loading={updateMutation.isPending}
                >
                  Update Order
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
