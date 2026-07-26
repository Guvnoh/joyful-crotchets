import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PaginationProps {
  page: number
  total: number
  limit: number
  onPageChange: (page: number) => void
  label?: string
}

export function Pagination({ page, total, limit, onPageChange, label = 'items' }: PaginationProps) {
  const pages = Math.ceil(total / limit)
  if (pages <= 1) return null

  const start = (page - 1) * limit + 1
  const end = Math.min(page * limit, total)

  const getPageNumbers = () => {
    const maxVisible = 5
    const result: number[] = []
    let startPage = Math.max(1, Math.min(page - 2, pages - maxVisible + 1))
    let endPage = Math.min(pages, startPage + maxVisible - 1)
    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1)
    }
    for (let i = startPage; i <= endPage; i++) {
      result.push(i)
    }
    return result
  }

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-chocolate-500">
        Showing {start} to {end} of {total} {label}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        {getPageNumbers().map((pageNum) => (
          <Button
            key={pageNum}
            variant={page === pageNum ? 'default' : 'outline'}
            size="sm"
            onClick={() => onPageChange(pageNum)}
            className={page === pageNum ? 'bg-gold hover:bg-gold-muted text-white' : ''}
          >
            {pageNum}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(page + 1)}
          disabled={page === pages}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
