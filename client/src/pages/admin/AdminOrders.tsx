import { useState, useMemo, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, ShoppingBag, Eye } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DataTable, Column } from '@/components/admin/DataTable'
import { Pagination } from '@/components/admin/Pagination'
import { useOrders } from '@/hooks/useOrders'
import { formatPrice, formatDateShort, statuses } from '@/lib/utils'
import type { Order } from '@/types'

const statusTabs = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
]

export default function AdminOrders() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const page = parseInt(searchParams.get('page') || '1', 10)
  const search = searchParams.get('search') || ''
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

  const filters = useMemo(() => ({
    page,
    limit: 10,
    search: search || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
  }), [page, search, statusFilter])

  const { data, isLoading } = useOrders(filters)
  const orders = data?.data || []
  const pagination = data?.pagination

  const columns: Column<Order>[] = [
    {
      key: 'orderNumber',
      label: 'Order #',
      sortable: true,
      render: (item) => (
        <span className="font-mono font-medium text-chocolate-800">
          #{item.orderNumber}
        </span>
      ),
    },
    {
      key: 'user',
      label: 'Customer',
      render: (item) => (
        <div>
          <p className="font-medium text-chocolate-800">{item.user?.name || 'Guest'}</p>
          <p className="text-xs text-chocolate-500">{item.user?.email || item.shippingAddress?.email}</p>
        </div>
      ),
    },
    {
      key: 'createdAt',
      label: 'Date',
      sortable: true,
      render: (item) => (
        <span className="text-sm text-chocolate-600">
          {formatDateShort(item.createdAt)}
        </span>
      ),
    },
    {
      key: 'items',
      label: 'Items',
      render: (item) => (
        <span className="text-sm text-chocolate-600">
          {item.items?.length || 0} item(s)
        </span>
      ),
    },
    {
      key: 'total',
      label: 'Total',
      sortable: true,
      render: (item) => (
        <span className="font-semibold text-chocolate-800">
          {formatPrice(item.total)}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (item) => {
        const statusInfo = statuses[item.status] || { label: item.status, color: 'bg-gray-100 text-gray-800' }
        return <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
      },
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
            navigate(`/admin/orders/${item._id}`)
          }}
        >
          <Eye className="w-4 h-4" />
        </Button>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-chocolate-800 font-display">Orders</h1>
        <p className="text-chocolate-500 text-sm mt-1">
          {pagination?.total || 0} total orders
        </p>
      </motion.div>

      <Tabs value={statusFilter} onValueChange={(v) => setParam('status', v)}>
        <TabsList className="bg-chocolate-100 p-1 h-auto flex-wrap">
          {statusTabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="data-[state=active]:bg-white data-[state=active]:text-chocolate-800"
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Card className="border-chocolate-100">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-chocolate-400" />
            <Input
              placeholder="Search by order number or customer name..."
              value={search}
              onChange={(e) => { setParam('search', e.target.value) }}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-chocolate-100">
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={orders}
            isLoading={isLoading}
            onRowClick={(item) => navigate(`/admin/orders/${item._id}`)}
            rowKey={(item) => item._id}
            emptyIcon={<ShoppingBag className="w-8 h-8 text-chocolate-400" />}
            emptyTitle="No orders found"
            emptyDescription="No orders match your current filters."
          />
        </CardContent>
      </Card>

      {pagination && pagination.pages > 1 && (
        <Pagination
          page={page}
          total={pagination.total}
          limit={10}
          onPageChange={(p) => setParam('page', String(p))}
          label="orders"
        />
      )}
    </div>
  )
}
