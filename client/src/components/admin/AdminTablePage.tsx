import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { Pagination } from './Pagination'
import { DataTable, Column, BulkAction } from './DataTable'

interface AdminTablePageProps<T extends Record<string, any>> {
  title: string
  subtitle: string
  data: T[]
  columns: Column<T>[]
  isLoading?: boolean
  total?: number
  page?: number
  limit?: number
  onPageChange?: (page: number) => void
  onRowClick?: (item: T) => void
  rowKey?: (item: T) => string
  addLabel?: string
  onAdd?: () => void
  headerActions?: ReactNode
  emptyIcon?: ReactNode
  emptyTitle?: string
  emptyDescription?: string
  selectedIds?: string[]
  onSelectId?: (id: string) => void
  bulkActions?: BulkAction[]
  filters?: ReactNode
  paginationLabel?: string
}

export function AdminTablePage<T extends Record<string, any>>({
  title,
  subtitle,
  data,
  columns,
  isLoading = false,
  total = 0,
  page = 1,
  limit = 10,
  onPageChange,
  onRowClick,
  rowKey,
  addLabel,
  onAdd,
  headerActions,
  emptyIcon,
  emptyTitle,
  emptyDescription,
  selectedIds,
  onSelectId,
  bulkActions,
  filters,
  paginationLabel,
}: AdminTablePageProps<T>) {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-chocolate-800 font-display">{title}</h1>
          <p className="text-chocolate-500 text-sm mt-1">{subtitle}</p>
        </div>
        {headerActions}
        {addLabel && onAdd && !headerActions && (
          <Button className="bg-gold hover:bg-gold-muted text-white" onClick={onAdd}>
            <Plus className="w-4 h-4 mr-2" />
            {addLabel}
          </Button>
        )}
      </motion.div>

      {filters && (
        <Card className="border-chocolate-100">
          <CardContent className="p-4">
            {filters}
          </CardContent>
        </Card>
      )}

      <Card className="border-chocolate-100">
        <CardContent className="p-0">
          <DataTable
            columns={columns}
            data={data}
            isLoading={isLoading}
            onRowClick={onRowClick}
            rowKey={rowKey}
            emptyIcon={emptyIcon}
            emptyTitle={emptyTitle}
            emptyDescription={emptyDescription}
            selectedIds={selectedIds}
            onSelectId={onSelectId}
            bulkActions={bulkActions}
          />
        </CardContent>
      </Card>

      {onPageChange && (
        <Pagination
          page={page}
          total={total}
          limit={limit}
          onPageChange={onPageChange}
          label={paginationLabel || title.toLowerCase()}
        />
      )}
    </div>
  )
}
