import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Edit,
  Trash2,
  GripVertical,
  FolderTree,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  useCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@/hooks/useCategories'
import type { Category } from '@/types'
import toast from 'react-hot-toast'

interface CategoryFormData {
  name: string
  description: string
  imageUrl: string
  parentCategory: string
  isActive: boolean
  sortOrder: number
}

const defaultFormData: CategoryFormData = {
  name: '',
  description: '',
  imageUrl: '',
  parentCategory: '',
  isActive: true,
  sortOrder: 0,
}

export default function AdminCategories() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [formData, setFormData] = useState<CategoryFormData>(defaultFormData)

  const { data: categories, isLoading } = useCategories()
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const deleteCategory = useDeleteCategory()

  const openModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category)
      setFormData({
        name: category.name,
        description: category.description || '',
        imageUrl: category.image?.url || '',
        parentCategory: category.parentCategory || '',
        isActive: category.isActive,
        sortOrder: category.sortOrder,
      })
    } else {
      setEditingCategory(null)
      setFormData(defaultFormData)
    }
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingCategory(null)
    setFormData(defaultFormData)
  }

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error('Category name is required')
      return
    }

    try {
      const payload: any = {
        ...formData,
        parentCategory: formData.parentCategory || undefined,
      }

      if (formData.imageUrl) {
        payload.image = { url: formData.imageUrl, publicId: '' }
      } else {
        payload.image = null
      }

      delete payload.imageUrl

      if (editingCategory) {
        await updateCategory.mutateAsync({ id: editingCategory._id, data: payload })
        toast.success('Category updated successfully')
      } else {
        await createCategory.mutateAsync(payload)
        toast.success('Category created successfully')
      }
      closeModal()
    } catch {
      toast.error(editingCategory ? 'Failed to update category' : 'Failed to create category')
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteCategory.mutateAsync(deleteId)
      toast.success('Category deleted successfully')
      setDeleteId(null)
    } catch {
      toast.error('Failed to delete category')
    }
  }

  const handleMoveUp = async (category: Category) => {
    if (category.sortOrder <= 0) return
    try {
      await updateCategory.mutateAsync({
        id: category._id,
        data: { sortOrder: category.sortOrder - 1 },
      })
    } catch {
      toast.error('Failed to reorder')
    }
  }

  const handleMoveDown = async (category: Category) => {
    try {
      await updateCategory.mutateAsync({
        id: category._id,
        data: { sortOrder: category.sortOrder + 1 },
      })
    } catch {
      toast.error('Failed to reorder')
    }
  }

  const sortedCategories = [...(categories || [])].sort((a, b) => a.sortOrder - b.sortOrder)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-chocolate-800 font-display">Categories</h1>
          <p className="text-chocolate-500 text-sm mt-1">
            {categories?.length || 0} total categories
          </p>
        </div>
        <Button className="bg-gold hover:bg-gold-muted text-white" onClick={() => openModal()}>
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </motion.div>

      {/* Categories Grid */}
      {sortedCategories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <FolderTree className="w-12 h-12 text-chocolate-300 mb-3" />
          <h3 className="text-lg font-semibold text-chocolate-800">No categories found</h3>
          <p className="text-sm text-chocolate-500 mt-1">Create your first category to get started.</p>
          <Button
            className="mt-4 bg-gold hover:bg-gold-muted text-white"
            onClick={() => openModal()}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {sortedCategories.map((category, index) => (
              <motion.div
                key={category._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="border-chocolate-100 hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-14 rounded-lg overflow-hidden bg-chocolate-100 shrink-0">
                        {category.image?.url ? (
                          <img
                            src={category.image.url}
                            alt={category.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <FolderTree className="w-6 h-6 text-chocolate-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-chocolate-800 truncate">{category.name}</h3>
                          <Badge className={category.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-chocolate-100 text-chocolate-600'}>
                            {category.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <p className="text-sm text-chocolate-500 truncate mt-1">
                          {category.description || 'No description'}
                        </p>
                        <p className="text-xs text-chocolate-400 mt-1">
                          {category.productCount || 0} products • /{category.slug}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-chocolate-100">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleMoveUp(category)}
                          disabled={category.sortOrder <= 0}
                        >
                          <ArrowUp className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleMoveDown(category)}
                        >
                          <ArrowDown className="w-4 h-4" />
                        </Button>
                        <span className="text-xs text-chocolate-400 ml-2">Order: {category.sortOrder}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openModal(category)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-600"
                          onClick={() => setDeleteId(category._id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">
              {editingCategory ? 'Edit Category' : 'Add Category'}
            </DialogTitle>
            <DialogDescription>
              {editingCategory ? 'Update category details' : 'Create a new product category'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div>
              <Label htmlFor="cat-name">Name *</Label>
              <Input
                id="cat-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Category name"
              />
            </div>
            <div>
              <Label htmlFor="cat-desc">Description</Label>
              <Textarea
                id="cat-desc"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Category description"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="cat-image">Image URL</Label>
              <Input
                id="cat-image"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
              {formData.imageUrl && (
                <div className="mt-2 w-20 h-20 rounded-lg overflow-hidden bg-chocolate-100">
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                </div>
              )}
            </div>
            <div>
              <Label>Parent Category</Label>
              <Select
                value={formData.parentCategory}
                onValueChange={(v) => setFormData({ ...formData, parentCategory: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="None (top-level)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None (top-level)</SelectItem>
                  {categories
                    ?.filter((c) => c._id !== editingCategory?._id)
                    .map((cat) => (
                      <SelectItem key={cat._id} value={cat._id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="cat-sort">Sort Order</Label>
              <Input
                id="cat-sort"
                type="number"
                value={formData.sortOrder}
                onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="cat-active">Active</Label>
              <Switch
                id="cat-active"
                checked={formData.isActive}
                onCheckedChange={(v) => setFormData({ ...formData, isActive: v })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeModal}>Cancel</Button>
            <Button
              className="bg-gold hover:bg-gold-muted text-white"
              onClick={handleSubmit}
              loading={createCategory.isPending || updateCategory.isPending}
            >
              {editingCategory ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category? Products in this category will need to be reassigned.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              loading={deleteCategory.isPending}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
