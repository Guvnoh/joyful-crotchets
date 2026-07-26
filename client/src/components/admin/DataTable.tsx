import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { ArrowUpDown, ArrowUp, ArrowDown, Inbox, Trash2 } from 'lucide-react'

export interface Column<T> {
  key: string
  label: string
  sortable?: boolean
  className?: string
  render?: (item: T, index: number) => React.ReactNode
}

export interface BulkAction {
  label: string
  icon?: React.ReactNode
  variant?: 'default' | 'destructive' | 'outline'
  onClick: (ids: string[]) => void
  loading?: boolean
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  onRowClick?: (item: T) => void
  isLoading?: boolean
  skeletonRows?: number
  emptyIcon?: React.ReactNode
  emptyTitle?: string
  emptyDescription?: string
  selectedIds?: string[]
  onSelectId?: (id: string) => void
  rowKey?: (item: T) => string
  bulkActions?: BulkAction[]
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  onRowClick,
  isLoading = false,
  skeletonRows = 5,
  emptyIcon,
  emptyTitle = 'No data found',
  emptyDescription = 'There are no items to display.',
  selectedIds,
  onSelectId,
  rowKey,
  bulkActions,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc')

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const sortedData = [...data].sort((a, b) => {
    if (!sortKey) return 0
    const aVal = a[sortKey]
    const bVal = b[sortKey]
    if (aVal < bVal) return sortDir === 'asc' ? -1 : 1
    if (aVal > bVal) return sortDir === 'asc' ? 1 : -1
    return 0
  })

  const handleSelectAll = () => {
    if (!onSelectId || !rowKey) return
    const allIds = data.map(rowKey)
    if (selectedIds?.length === data.length) {
      allIds.forEach((id) => onSelectId(id))
    } else {
      allIds.forEach((id) => {
        if (!selectedIds?.includes(id)) onSelectId(id)
      })
    }
  }

  if (isLoading) {
    return (
      <div className="relative w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((col) => (
                <TableHead key={col.key} className={col.className}>
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: skeletonRows }).map((_, i) => (
              <TableRow key={i}>
                {columns.map((col) => (
                  <TableCell key={col.key} className={col.className}>
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-chocolate-100 flex items-center justify-center mb-4">
          {emptyIcon || <Inbox className="w-8 h-8 text-chocolate-400" />}
        </div>
        <h3 className="text-lg font-semibold text-chocolate-800 mb-1">{emptyTitle}</h3>
        <p className="text-sm text-chocolate-500 max-w-sm">{emptyDescription}</p>
      </div>
    )
  }

  return (
    <div>
      <AnimatePresence>
        {selectedIds && selectedIds.length > 0 && bulkActions && bulkActions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center gap-3 p-3 bg-amber-50 border-b border-amber-200">
              <span className="text-sm font-medium text-amber-800">
                {selectedIds.length} item(s) selected
              </span>
              {bulkActions.map((action) => (
                <Button
                  key={action.label}
                  size="sm"
                  variant={action.variant || 'outline'}
                  onClick={() => action.onClick(selectedIds)}
                  loading={action.loading}
                >
                  {action.icon}
                  {action.label}
                </Button>
              ))}
              <Button size="sm" variant="ghost" onClick={() => selectedIds.forEach((id) => onSelectId?.(id))}>
                Clear Selection
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {selectedIds !== undefined && (
                <TableHead className="w-12">
                  <input
                    type="checkbox"
                    checked={data.length > 0 && selectedIds.length === data.length}
                    onChange={handleSelectAll}
                    className="h-4 w-4 rounded border-chocolate-300 text-gold focus:ring-gold"
                  />
                </TableHead>
              )}
              {columns.map((col) => (
                <TableHead key={col.key} className={col.className}>
                  {col.sortable ? (
                    <button
                      onClick={() => handleSort(col.key)}
                      className="flex items-center gap-1 hover:text-chocolate-800 transition-colors"
                    >
                      {col.label}
                      {sortKey === col.key ? (
                        sortDir === 'asc' ? (
                          <ArrowUp className="w-3.5 h-3.5" />
                        ) : (
                          <ArrowDown className="w-3.5 h-3.5" />
                        )
                      ) : (
                        <ArrowUpDown className="w-3.5 h-3.5 opacity-40" />
                      )}
                    </button>
                  ) : (
                    col.label
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {sortedData.map((item, index) => {
                const id = rowKey ? rowKey(item) : item._id
                const isSelected = selectedIds?.includes(id)
                return (
                  <TableRow
                    key={id}
                    className={onRowClick ? 'cursor-pointer' : ''}
                    onClick={() => onRowClick?.(item)}
                    data-state={isSelected ? 'selected' : undefined}
                  >
                    {selectedIds !== undefined && (
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onSelectId?.(id)}
                          className="h-4 w-4 rounded border-chocolate-300 text-gold focus:ring-gold"
                        />
                      </TableCell>
                    )}
                    {columns.map((col) => (
                      <TableCell key={col.key} className={col.className}>
                        {col.render
                          ? col.render(item, index)
                          : item[col.key]}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
