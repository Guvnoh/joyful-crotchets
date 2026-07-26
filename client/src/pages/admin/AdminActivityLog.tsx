import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Activity, User, Globe, Clock } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { AdminTablePage } from '@/components/admin/AdminTablePage'
import { useActivityLogs } from '@/hooks/useActivityLogs'
import { formatDateShort, formatDate } from '@/lib/utils'
import type { ActivityLog } from '@/types'

const actionColors: Record<string, string> = {
  created: 'bg-emerald-100 text-emerald-700',
  updated: 'bg-blue-100 text-blue-700',
  deleted: 'bg-red-100 text-red-700',
  login: 'bg-purple-100 text-purple-700',
  logout: 'bg-chocolate-100 text-chocolate-700',
}

export default function AdminActivityLog() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = parseInt(searchParams.get('page') || '1', 10)
  const actionFilter = searchParams.get('action') || 'all'
  const resourceFilter = searchParams.get('resource') || 'all'

  const filters = useMemo(() => ({
    page,
    limit: 20,
    action: actionFilter !== 'all' ? actionFilter : undefined,
    resource: resourceFilter !== 'all' ? resourceFilter : undefined,
  }), [page, actionFilter, resourceFilter])

  const { data, isLoading } = useActivityLogs(filters)
  const logs = data?.data || []
  const pagination = data?.pagination

  const setParam = (key: string, value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      if (value && value !== 'all') next.set(key, value)
      else next.delete(key)
      if (key !== 'page') next.delete('page')
      return next
    })
  }

  return (
    <AdminTablePage
      title="Activity Log"
      subtitle={`${pagination?.total || 0} recorded events`}
      data={logs}
      isLoading={isLoading}
      total={pagination?.total || 0}
      page={page}
      limit={20}
      onPageChange={(p) => setParam('page', String(p))}
      rowKey={(item) => item._id}
      emptyIcon={<Activity className="w-8 h-8 text-chocolate-400" />}
      emptyTitle="No activity recorded"
      emptyDescription="Activity will appear here as admin actions are performed."
      columns={[
        {
          key: 'user',
          label: 'Admin',
          render: (item) => (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-yellow-300 flex items-center justify-center text-white text-xs font-medium shrink-0">
                {item.user?.name?.charAt(0) || 'S'}
              </div>
              <div>
                <p className="text-sm font-medium text-chocolate-800">{item.user?.name || 'System'}</p>
                <p className="text-xs text-chocolate-500">{item.user?.email}</p>
              </div>
            </div>
          ),
        },
        {
          key: 'action',
          label: 'Action',
          render: (item) => (
            <Badge className={actionColors[item.action] || 'bg-chocolate-100 text-chocolate-700 capitalize'}>
              {item.action}
            </Badge>
          ),
        },
        {
          key: 'resource',
          label: 'Resource',
          render: (item) => (
            <span className="text-sm font-medium text-chocolate-700 capitalize">{item.resource}</span>
          ),
        },
        {
          key: 'description',
          label: 'Description',
          render: (item) => (
            <span className="text-sm text-chocolate-600 truncate max-w-[300px] block">
              {item.description || '—'}
            </span>
          ),
        },
        {
          key: 'createdAt',
          label: 'Date',
          sortable: true,
          render: (item) => (
            <div className="flex items-center gap-1 text-sm text-chocolate-600">
              <Clock className="w-3.5 h-3.5" />
              {formatDateShort(item.createdAt)}
            </div>
          ),
        },
      ]}
      filters={
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={actionFilter} onValueChange={(v) => setParam('action', v)}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="All Actions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="created">Created</SelectItem>
              <SelectItem value="updated">Updated</SelectItem>
              <SelectItem value="deleted">Deleted</SelectItem>
              <SelectItem value="login">Login</SelectItem>
              <SelectItem value="logout">Logout</SelectItem>
            </SelectContent>
          </Select>
          <Select value={resourceFilter} onValueChange={(v) => setParam('resource', v)}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All Resources" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Resources</SelectItem>
              <SelectItem value="product">Product</SelectItem>
              <SelectItem value="order">Order</SelectItem>
              <SelectItem value="category">Category</SelectItem>
              <SelectItem value="coupon">Coupon</SelectItem>
              <SelectItem value="testimonial">Testimonial</SelectItem>
              <SelectItem value="faq">FAQ</SelectItem>
              <SelectItem value="custom-order">Custom Order</SelectItem>
            </SelectContent>
          </Select>
        </div>
      }
    />
  )
}
