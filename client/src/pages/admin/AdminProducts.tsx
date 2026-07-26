import { useState, useMemo, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search, Package, Edit, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { AdminTablePage } from '@/components/admin/AdminTablePage'
import type { Column } from '@/components/admin/DataTable'
import { useProducts, useDeleteProduct } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'
import { formatPrice } from '@/lib/utils'
import type { Product } from '@/types'
import toast from 'react-hot-toast'

export default function AdminProducts() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const page = parseInt(searchParams.get('page') || '1', 10)
  const search = searchParams.get('search') || ''
  const categoryFilter = searchParams.get('category') || 'all'
  const statusFilter = searchParams.get('status') || 'all'
  const stockFilter = searchParams.get('stock') || 'all'

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
    category: categoryFilter !== 'all' ? categoryFilter : undefined,
    isPublished: statusFilter === 'published' ? true : statusFilter === 'draft' ? false : undefined,
    inStock: stockFilter === 'inStock' ? true : stockFilter === 'outOfStock' ? false : undefined,
  }), [page, search, categoryFilter, statusFilter, stockFilter])

  const { data, isLoading } = useProducts(filters)
  const { data: categories } = useCategories()
  const deleteProduct = useDeleteProduct()

  const products = data?.data || []
  const pagination = data?.pagination

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteProduct.mutateAsync(deleteId)
      toast.success('Product deleted')
      setDeleteId(null)
    } catch {
      toast.error('Failed to delete product')
    }
  }

  const handleBulkDelete = async (ids: string[]) => {
    try {
      await Promise.all(ids.map((id) => deleteProduct.mutateAsync(id)))
      toast.success(`${ids.length} products deleted`)
      setSelectedIds([])
    } catch {
      toast.error('Failed to delete some products')
    }
  }

  const columns: Column<Product>[] = [
    {
      key: 'image',
      label: '',
      className: 'w-16',
      render: (item) => (
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-chocolate-100 shrink-0">
          {item.images?.[0]?.url ? (
            <img src={item.images[0].url} alt={item.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Package className="w-5 h-5 text-chocolate-400" />
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (item) => (
        <div>
          <p className="font-medium text-chocolate-800">{item.name}</p>
          {item.sku && <p className="text-xs text-chocolate-500">SKU: {item.sku}</p>}
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      sortable: true,
      render: (item) => (
        <span className="text-sm text-chocolate-600">
          {item.category?.name || '—'}
        </span>
      ),
    },
    {
      key: 'price',
      label: 'Price',
      sortable: true,
      render: (item) => (
        <span className="font-semibold text-chocolate-800">{formatPrice(item.price)}</span>
      ),
    },
    {
      key: 'stock',
      label: 'Stock',
      sortable: true,
      render: (item) => (
        <Badge
          className={
            item.stock > 10
              ? 'bg-emerald-100 text-emerald-700'
              : item.stock > 0
              ? 'bg-amber-100 text-amber-700'
              : 'bg-red-100 text-red-700'
          }
        >
          {item.stock} in stock
        </Badge>
      ),
    },
    {
      key: 'isPublished',
      label: 'Status',
      render: (item) => (
        <Badge className={item.isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-chocolate-100 text-chocolate-600'}>
          {item.isPublished ? 'Published' : 'Draft'}
        </Badge>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      className: 'w-24',
      render: (item) => (
        <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => navigate(`/admin/products/${item._id}/edit`)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-500 hover:text-red-600"
            onClick={() => setDeleteId(item._id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <>
      <AdminTablePage
        title="Products"
        subtitle={`${pagination?.total || 0} total products`}
        data={products}
        columns={columns}
        isLoading={isLoading}
        total={pagination?.total || 0}
        page={page}
        limit={10}
        onPageChange={(p) => setParam('page', String(p))}
        onRowClick={(item) => navigate(`/admin/products/${item._id}/edit`)}
        rowKey={(item) => item._id}
        addLabel="Add Product"
        onAdd={() => navigate('/admin/products/new')}
        emptyIcon={<Package className="w-8 h-8 text-chocolate-400" />}
        emptyTitle="No products found"
        emptyDescription="Try adjusting your filters or add a new product."
        selectedIds={selectedIds}
        onSelectId={(id) =>
          setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
          )
        }
        bulkActions={[
          {
            label: 'Delete Selected',
            icon: <Trash2 className="w-4 h-4 mr-1" />,
            variant: 'destructive',
            onClick: handleBulkDelete,
            loading: deleteProduct.isPending,
          },
        ]}
        filters={
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-chocolate-400" />
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => { setParam('search', e.target.value) }}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={(v) => setParam('category', v)}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories?.map((cat) => (
                  <SelectItem key={cat._id} value={cat._id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={(v) => setParam('status', v)}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
            <Select value={stockFilter} onValueChange={(v) => setParam('stock', v)}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="All Stock" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stock</SelectItem>
                <SelectItem value="inStock">In Stock</SelectItem>
                <SelectItem value="outOfStock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        }
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={handleDelete}
        loading={deleteProduct.isPending}
      />
    </>
  )
}
