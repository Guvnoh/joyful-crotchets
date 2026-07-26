import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, Users, Eye, Mail, Phone, ShoppingCart } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AdminTablePage } from '@/components/admin/AdminTablePage'
import { Skeleton } from '@/components/ui/skeleton'
import api from '@/services/api'
import { formatPrice, formatDateShort, statuses } from '@/lib/utils'
import type { User, Order, PaginatedResponse } from '@/types'

export default function AdminCustomers() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-customers', page, search],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), limit: '10' })
      if (search) params.append('search', search)
      const { data } = await api.get(`/auth/users?${params.toString()}`)
      return data as PaginatedResponse<User>
    },
  })

  const { data: customerOrders, isLoading: isLoadingOrders } = useQuery({
    queryKey: ['customer-orders', selectedCustomer?._id],
    queryFn: async () => {
      const { data } = await api.get(`/orders?user=${selectedCustomer?._id}&limit=5`)
      return data.data as Order[]
    },
    enabled: !!selectedCustomer,
  })

  const customers = data?.data || []
  const pagination = data?.pagination

  return (
    <>
      <AdminTablePage
        title="Customers"
        subtitle={`${pagination?.total || 0} registered customers`}
        data={customers}
        columns={[
          {
            key: 'name',
            label: 'Customer',
            sortable: true,
            render: (item) => (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-yellow-300 flex items-center justify-center text-white font-medium shrink-0">
                  {item.avatar?.url ? (
                    <img src={item.avatar.url} alt={item.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    item.name?.charAt(0)?.toUpperCase() || 'U'
                  )}
                </div>
                <div>
                  <p className="font-medium text-chocolate-800">{item.name}</p>
                  <p className="text-xs text-chocolate-500">{item.email}</p>
                </div>
              </div>
            ),
          },
          {
            key: 'phone',
            label: 'Phone',
            render: (item) => (
              <span className="text-sm text-chocolate-600">{item.phone || '—'}</span>
            ),
          },
          {
            key: 'createdAt',
            label: 'Joined',
            sortable: true,
            render: (item) => (
              <span className="text-sm text-chocolate-600">{formatDateShort(item.createdAt)}</span>
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
                  setSelectedCustomer(item)
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
        onPageChange={setPage}
        onRowClick={(item) => setSelectedCustomer(item)}
        rowKey={(item) => item._id}
        emptyIcon={<Users className="w-8 h-8 text-chocolate-400" />}
        emptyTitle="No customers found"
        emptyDescription="No customers match your search."
        filters={
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-chocolate-400" />
            <Input
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="pl-10"
            />
          </div>
        }
      />

      <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">Customer Details</DialogTitle>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-yellow-300 flex items-center justify-center text-white text-xl font-bold">
                  {selectedCustomer.avatar?.url ? (
                    <img src={selectedCustomer.avatar.url} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    selectedCustomer.name?.charAt(0)?.toUpperCase()
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-chocolate-800">{selectedCustomer.name}</h3>
                  <p className="text-sm text-chocolate-500">{selectedCustomer.email}</p>
                  {selectedCustomer.phone && (
                    <p className="text-sm text-chocolate-500">{selectedCustomer.phone}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-chocolate-50 rounded-lg">
                  <p className="text-xs text-chocolate-500">Role</p>
                  <Badge className="mt-1 capitalize">{selectedCustomer.role}</Badge>
                </div>
                <div className="p-3 bg-chocolate-50 rounded-lg">
                  <p className="text-xs text-chocolate-500">Email Verified</p>
                  <Badge className={selectedCustomer.isEmailVerified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}>
                    {selectedCustomer.isEmailVerified ? 'Verified' : 'Unverified'}
                  </Badge>
                </div>
                <div className="p-3 bg-chocolate-50 rounded-lg">
                  <p className="text-xs text-chocolate-500">Joined</p>
                  <p className="text-sm font-medium text-chocolate-800">{formatDateShort(selectedCustomer.createdAt)}</p>
                </div>
                <div className="p-3 bg-chocolate-50 rounded-lg">
                  <p className="text-xs text-chocolate-500">Last Login</p>
                  <p className="text-sm font-medium text-chocolate-800">
                    {selectedCustomer.lastLogin ? formatDateShort(selectedCustomer.lastLogin) : 'Never'}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-chocolate-800 mb-3">Recent Orders</h4>
                {isLoadingOrders ? (
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : customerOrders && customerOrders.length > 0 ? (
                  <div className="space-y-2">
                    {customerOrders.map((order) => (
                      <div key={order._id} className="flex items-center justify-between p-2 bg-chocolate-50 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-chocolate-800">#{order.orderNumber}</p>
                          <p className="text-xs text-chocolate-500">{formatDateShort(order.createdAt)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-chocolate-800">{formatPrice(order.total)}</p>
                          <Badge className={statuses[order.status]?.color || 'bg-gray-100'}>
                            {statuses[order.status]?.label || order.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-chocolate-500 text-center py-4">No orders yet</p>
                )}
              </div>

              {selectedCustomer.addresses && selectedCustomer.addresses.length > 0 && (
                <div>
                  <h4 className="font-semibold text-chocolate-800 mb-3">Addresses</h4>
                  <div className="space-y-2">
                    {selectedCustomer.addresses.map((addr, i) => (
                      <div key={i} className="p-3 bg-chocolate-50 rounded-lg text-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-chocolate-800">{addr.label}</span>
                          {addr.isDefault && <Badge className="text-[10px]">Default</Badge>}
                        </div>
                        <p className="text-chocolate-600">
                          {addr.street}, {addr.city}, {addr.state} {addr.zipCode}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
