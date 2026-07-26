import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search, Mail, Download, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { AdminTablePage } from '@/components/admin/AdminTablePage'
import api from '@/services/api'
import { formatDateShort, downloadCSV } from '@/lib/utils'
import type { Subscriber, PaginatedResponse } from '@/types'

export default function AdminSubscribers() {
  const [search, setSearch] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-subscribers', search],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      const { data } = await api.get(`/subscribers?${params.toString()}`)
      return data as PaginatedResponse<Subscriber>
    },
  })

  const subscribers = data?.data || []
  const total = data?.pagination?.total || subscribers.length

  const handleExport = () => {
    downloadCSV(
      subscribers.map((s) => ({
        Email: s.email,
        Name: s.name || '',
        Status: s.isActive ? 'Active' : 'Unsubscribed',
        Subscribed: formatDateShort(s.subscribedAt),
      })),
      `subscribers-${new Date().toISOString().slice(0, 10)}`
    )
  }

  return (
    <AdminTablePage
      title="Subscribers"
      subtitle={`${total} newsletter subscribers`}
      data={subscribers}
      columns={[
        {
          key: 'email',
          label: 'Email',
          sortable: true,
          render: (item) => (
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-chocolate-400" />
              <span className="text-sm font-medium text-chocolate-800">{item.email}</span>
            </div>
          ),
        },
        {
          key: 'name',
          label: 'Name',
          render: (item) => (
            <span className="text-sm text-chocolate-600">{item.name || '—'}</span>
          ),
        },
        {
          key: 'isActive',
          label: 'Status',
          render: (item) => (
            <Badge className={item.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-chocolate-100 text-chocolate-600'}>
              {item.isActive ? 'Active' : 'Unsubscribed'}
            </Badge>
          ),
        },
        {
          key: 'subscribedAt',
          label: 'Subscribed',
          sortable: true,
          render: (item) => (
            <span className="text-sm text-chocolate-600">{formatDateShort(item.subscribedAt)}</span>
          ),
        },
      ]}
      isLoading={isLoading}
      rowKey={(item) => item._id}
      emptyIcon={<Users className="w-8 h-8 text-chocolate-400" />}
      emptyTitle="No subscribers found"
      emptyDescription="No subscribers match your search."
      headerActions={
        <Button variant="outline" onClick={handleExport} disabled={subscribers.length === 0}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      }
      filters={
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-chocolate-400" />
          <Input
            placeholder="Search by email or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      }
    />
  )
}
