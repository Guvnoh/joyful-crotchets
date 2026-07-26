import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Package,
  User,
  MapPin,
  CreditCard,
  Clock,
  Printer,
  Save,
  CheckCircle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useOrder, useUpdateOrderStatus } from '@/hooks/useOrders'
import { formatPrice, formatDate, formatDateShort, statuses } from '@/lib/utils'
import type { OrderStatus } from '@/types'
import toast from 'react-hot-toast'

const statusFlow: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered']

export default function AdminOrderDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: order, isLoading } = useOrder(id || '')
  const updateStatus = useUpdateOrderStatus()

  const [newStatus, setNewStatus] = useState<OrderStatus | ''>('')
  const [statusNote, setStatusNote] = useState('')

  const handleUpdateStatus = async () => {
    if (!newStatus || !id) return
    try {
      await updateStatus.mutateAsync({ id, status: newStatus, note: statusNote || undefined })
      toast.success('Order status updated')
      setNewStatus('')
      setStatusNote('')
    } catch {
      toast.error('Failed to update status')
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-48 rounded-lg" />
            <Skeleton className="h-64 rounded-lg" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-40 rounded-lg" />
            <Skeleton className="h-40 rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold text-chocolate-800">Order not found</h2>
        <Button variant="outline" className="mt-4" onClick={() => navigate('/admin/orders')}>
          Back to Orders
        </Button>
      </div>
    )
  }

  const statusInfo = statuses[order.status] || { label: order.status, color: 'bg-gray-100 text-gray-800' }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/admin/orders')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-chocolate-800 font-display">
              Order #{order.orderNumber}
            </h1>
            <p className="text-chocolate-500 text-sm mt-1">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Status Update */}
          <Card className="border-chocolate-100">
            <CardHeader>
              <CardTitle className="text-lg font-display text-chocolate-800">Update Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-3">
                <Select
                  value={newStatus}
                  onValueChange={(v) => setNewStatus(v as OrderStatus)}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select new status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusFlow.map((s) => (
                      <SelectItem key={s} value={s}>
                        {statuses[s]?.label || s}
                      </SelectItem>
                    ))}
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  className="bg-gold hover:bg-gold-muted text-white"
                  onClick={handleUpdateStatus}
                  disabled={!newStatus}
                  loading={updateStatus.isPending}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Update
                </Button>
              </div>
              <Textarea
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                placeholder="Optional note for status update..."
                className="mt-3"
                rows={2}
              />
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card className="border-chocolate-100">
            <CardHeader>
              <CardTitle className="text-lg font-display text-chocolate-800">Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 bg-chocolate-50 rounded-lg">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-chocolate-100 shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-6 h-6 text-chocolate-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-chocolate-800">{item.name}</p>
                      <div className="flex items-center gap-2 text-sm text-chocolate-500">
                        {item.color && <span>Color: {item.color}</span>}
                        {item.size && <span>Size: {item.size}</span>}
                      </div>
                      <p className="text-sm text-chocolate-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-semibold text-chocolate-800">{formatPrice(item.price * item.quantity)}</p>
                      <p className="text-xs text-chocolate-500">{formatPrice(item.price)} each</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="mt-6 pt-4 border-t border-chocolate-100 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-chocolate-500">Subtotal</span>
                  <span className="text-chocolate-700">{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-chocolate-500">Shipping</span>
                  <span className="text-chocolate-700">{formatPrice(order.shippingCost)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-chocolate-500">Tax</span>
                  <span className="text-chocolate-700">{formatPrice(order.tax)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-chocolate-500">Discount</span>
                    <span className="text-emerald-600">-{formatPrice(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-chocolate-100">
                  <span className="text-chocolate-800">Total</span>
                  <span className="text-gold">{formatPrice(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Timeline */}
          {order.timeline && order.timeline.length > 0 && (
            <Card className="border-chocolate-100">
              <CardHeader>
                <CardTitle className="text-lg font-display text-chocolate-800 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-gold" />
                  Order Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative pl-6">
                  <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-chocolate-200" />
                  {order.timeline.map((event, i) => (
                    <div key={i} className="relative mb-4 last:mb-0">
                      <div className="absolute -left-4 top-1 w-3 h-3 rounded-full bg-gold border-2 border-white" />
                      <div>
                        <p className="font-medium text-chocolate-800 capitalize">{event.status}</p>
                        <p className="text-xs text-chocolate-500">{formatDate(event.date)}</p>
                        {event.note && (
                          <p className="text-sm text-chocolate-600 mt-1">{event.note}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Customer Info */}
          <Card className="border-chocolate-100">
            <CardHeader>
              <CardTitle className="text-lg font-display text-chocolate-800 flex items-center gap-2">
                <User className="w-5 h-5 text-gold" />
                Customer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="font-medium text-chocolate-800">{order.user?.name || 'Guest'}</p>
              <p className="text-sm text-chocolate-500">{order.user?.email || order.shippingAddress?.email}</p>
              {order.user?.phone && (
                <p className="text-sm text-chocolate-500">{order.user.phone}</p>
              )}
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card className="border-chocolate-100">
            <CardHeader>
              <CardTitle className="text-lg font-display text-chocolate-800 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gold" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-chocolate-600 space-y-1">
                <p className="font-medium text-chocolate-800">
                  {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                </p>
                <p>{order.shippingAddress?.street}</p>
                <p>
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}
                </p>
                <p>{order.shippingAddress?.country}</p>
                {order.shippingAddress?.phone && (
                  <p className="mt-2">Phone: {order.shippingAddress.phone}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment Info */}
          <Card className="border-chocolate-100">
            <CardHeader>
              <CardTitle className="text-lg font-display text-chocolate-800 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-gold" />
                Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-chocolate-500">Method</span>
                <span className="text-chocolate-700 capitalize">{order.paymentMethod}</span>
              </div>
              {order.paymentResult && (
                <div className="flex justify-between text-sm">
                  <span className="text-chocolate-500">Status</span>
                  <Badge className="bg-emerald-100 text-emerald-700">{order.paymentResult.status}</Badge>
                </div>
              )}
              {order.couponCode && (
                <div className="flex justify-between text-sm">
                  <span className="text-chocolate-500">Coupon</span>
                  <span className="text-chocolate-700 font-mono">{order.couponCode}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Admin Notes */}
          <Card className="border-chocolate-100">
            <CardHeader>
              <CardTitle className="text-lg font-display text-chocolate-800">Admin Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                defaultValue={order.notes || ''}
                placeholder="Add notes about this order..."
                rows={3}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
