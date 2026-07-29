import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  Plus,
  Loader2,
  Image as ImageIcon,
  Trash2,
  GripVertical,
  RefreshCw,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useProduct, useCreateProduct, useUpdateProduct } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'
import { slugify, generateOrderNumber } from '@/lib/utils'
import api from '@/services/api'
import toast from 'react-hot-toast'

const safeNumber = z.preprocess(
  (val) => (val === '' || val === undefined || val === null || (typeof val === 'number' && isNaN(val)) ? undefined : val),
  z.number().optional()
)

const productSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  shortDescription: z.string().optional(),
  category: z.string().min(1, 'Category is required'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  compareAtPrice: safeNumber,
  costPrice: safeNumber,
  sku: z.string().optional(),
  stock: z.number().min(0, 'Stock cannot be negative'),
  isPublished: z.boolean(),
  isFeatured: z.boolean(),
  isBestSeller: z.boolean(),
  isNewArrival: z.boolean(),
  tags: z.string().optional(),
  estimatedDelivery: z.string().optional(),
  careInstructions: z.string().optional(),
  colors: z.preprocess(
    (colors) => {
      if (!colors || !Array.isArray(colors)) return colors;
      return colors.filter((c: any) => c && c.name && String(c.name).trim() !== '');
    },
    z.array(z.object({
      name: z.string().min(1),
      hex: z.string().min(1),
      inStock: z.boolean(),
    })).optional()
  ),
  sizes: z.preprocess(
    (sizes) => {
      if (!sizes || !Array.isArray(sizes)) return sizes;
      return sizes.filter((s: any) => s && s.name && String(s.name).trim() !== '');
    },
    z.array(z.object({
      name: z.string().min(1, 'Size name is required'),
      price: z.number().min(0),
      inStock: z.boolean(),
    })).optional()
  ),
  materials: z.array(z.string()).optional(),
  dimensions: z.object({
    length: z.number().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    unit: z.string().optional(),
  }).optional(),
  weight: z.number().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  allowsCustomization: z.boolean(),
  customizationNote: z.string().optional(),
  additionalPrice: z.number().optional(),
  estimatedDays: z.number().optional(),
})

type ProductFormData = z.infer<typeof productSchema>

export default function AdminProductForm() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEditing = !!id

  const { data: existingProduct, isLoading: isLoadingProduct } = useProduct(id || '')
  const { data: categories } = useCategories()
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()

  const [materialInput, setMaterialInput] = useState('')
  const [tagInput, setTagInput] = useState('')
  const [images, setImages] = useState<{ url: string; publicId: string; alt: string; isPrimary: boolean; file?: File }[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      shortDescription: '',
      category: '',
      price: 0,
      compareAtPrice: undefined,
      costPrice: undefined,
      sku: '',
      stock: 0,
      isPublished: false,
      isFeatured: false,
      isBestSeller: false,
      isNewArrival: false,
      tags: '',
      estimatedDelivery: '',
      careInstructions: '',
      colors: [],
      sizes: [],
      materials: [],
      dimensions: { length: 0, width: 0, height: 0, unit: 'cm' },
      weight: 0,
      seoTitle: '',
      seoDescription: '',
      allowsCustomization: false,
      customizationNote: '',
      additionalPrice: 0,
      estimatedDays: 0,
    },
  })

  const {
    fields: colorFields,
    append: appendColor,
    remove: removeColor,
  } = useFieldArray({ control, name: 'colors' })

  const {
    fields: sizeFields,
    append: appendSize,
    remove: removeSize,
  } = useFieldArray({ control, name: 'sizes' })

  useEffect(() => {
    if (existingProduct && isEditing) {
      setImages(existingProduct.images?.map((img) => ({ ...img, file: undefined })) || [])
      reset({
        name: existingProduct.name,
        description: existingProduct.description,
        shortDescription: existingProduct.shortDescription || '',
        category: existingProduct.category?._id || '',
        price: existingProduct.price,
        compareAtPrice: existingProduct.compareAtPrice,
        costPrice: existingProduct.costPrice,
        sku: existingProduct.sku || '',
        stock: existingProduct.stock,
        isPublished: existingProduct.isPublished,
        isFeatured: existingProduct.isFeatured,
        isBestSeller: existingProduct.isBestSeller,
        isNewArrival: existingProduct.isNewArrival,
        tags: existingProduct.tags?.join(', ') || '',
        estimatedDelivery: existingProduct.estimatedDelivery || '',
        careInstructions: existingProduct.careInstructions || '',
        colors: existingProduct.colors || [],
        sizes: existingProduct.sizes || [],
        materials: existingProduct.materials || [],
        dimensions: existingProduct.dimensions || { length: 0, width: 0, height: 0, unit: 'cm' },
        weight: existingProduct.weight || 0,
        seoTitle: '',
        seoDescription: '',
        allowsCustomization: existingProduct.customizationOptions?.allowsCustomization || false,
        customizationNote: existingProduct.customizationOptions?.customizationNote || '',
        additionalPrice: existingProduct.customizationOptions?.additionalPrice || 0,
        estimatedDays: existingProduct.customizationOptions?.estimatedDays || 0,
      })
    }
  }, [existingProduct, isEditing, reset])

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setIsUploading(true)
    try {
      const formData = new FormData()
      for (const file of Array.from(files)) {
        formData.append('images', file)
      }
      const { data: res } = await api.post('/upload/images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      const uploaded = res.data.map((img: any) => ({
        url: img.url,
        publicId: img.publicId,
        alt: '',
        isPrimary: images.length === 0,
      }))
      setImages((prev) => [...prev, ...uploaded])
      toast.success(`${uploaded.length} image(s) uploaded`)
    } catch {
      toast.error('Failed to upload images')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDeleteImage = async (publicId: string) => {
    try {
      await api.delete('/upload/image', { data: { publicId } })
      setImages((prev) => prev.filter((img) => img.publicId !== publicId))
    } catch {
      toast.error('Failed to delete image')
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragIndex(null)
    handleImageUpload(e.dataTransfer.files)
  }, [images.length])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragIndex(0)
  }

  const handleDragLeave = () => setDragIndex(null)

  const setPrimary = (publicId: string) => {
    setImages((prev) => prev.map((img) => ({ ...img, isPrimary: img.publicId === publicId })))
  }

  const moveImage = (from: number, to: number) => {
    const updated = [...images]
    const [moved] = updated.splice(from, 1)
    updated.splice(to, 0, moved)
    setImages(updated)
  }

  const handlePaste = useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.files
    if (items && items.length > 0) {
      handleImageUpload(items)
    }
  }, [images.length])

  useEffect(() => {
    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [handlePaste])

  const onSubmit = async (data: ProductFormData) => {
    try {
      const payload = {
        ...data,
        images: images.map(({ url, publicId, alt, isPrimary }) => ({ url, publicId, alt, isPrimary })),
        tags: data.tags ? data.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        materials: data.materials || [],
        customizationOptions: {
          allowsCustomization: data.allowsCustomization,
          customizationNote: data.customizationNote,
          additionalPrice: data.additionalPrice,
          estimatedDays: data.estimatedDays,
        },
      }

      if (isEditing && id) {
        await updateProduct.mutateAsync({ id, data: payload })
        toast.success('Product updated successfully')
      } else {
        await createProduct.mutateAsync(payload)
        toast.success('Product created successfully')
      }
      navigate('/admin/products')
    } catch {
      toast.error(isEditing ? 'Failed to update product' : 'Failed to create product')
    }
  }

  const isSubmitting = createProduct.isPending || updateProduct.isPending

  if (isEditing && isLoadingProduct) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 rounded-lg" />
            <Skeleton className="h-48 rounded-lg" />
          </div>
          <Skeleton className="h-96 rounded-lg" />
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
        className="flex items-center gap-4"
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/admin/products')}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-chocolate-800 font-display">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-chocolate-500 text-sm mt-1">
            {isEditing ? 'Update product details' : 'Create a new product listing'}
          </p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Basic Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-chocolate-100">
              <CardHeader>
                <CardTitle className="text-lg font-display text-chocolate-800">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    {...register('name')}
                    placeholder="e.g., Handmade Crochet Baby Blanket"
                  />
                  {errors.name?.message && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                </div>
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    {...register('description')}
                    error={errors.description?.message}
                    placeholder="Detailed product description..."
                    rows={6}
                  />
                </div>
                <div>
                  <Label htmlFor="shortDescription">Short Description</Label>
                  <Textarea
                    id="shortDescription"
                    {...register('shortDescription')}
                    placeholder="Brief description for product cards..."
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={watch('category')}
                    onValueChange={(v) => setValue('category', v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map((cat) => (
                        <SelectItem key={cat._id} value={cat._id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="border-chocolate-100">
              <CardHeader>
                <CardTitle className="text-lg font-display text-chocolate-800">Pricing & Inventory</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      {...register('price', { valueAsNumber: true })}
                    />
                    {errors.price?.message && <p className="mt-1 text-sm text-red-500">{errors.price.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="compareAtPrice">Compare At Price</Label>
                    <Input
                      id="compareAtPrice"
                      type="number"
                      step="0.01"
                      {...register('compareAtPrice', { valueAsNumber: true })}
                      placeholder="Optional"
                    />
                  </div>
                  <div>
                    <Label htmlFor="costPrice">Cost Price</Label>
                    <Input
                      id="costPrice"
                      type="number"
                      step="0.01"
                      {...register('costPrice', { valueAsNumber: true })}
                      placeholder="Optional"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sku">SKU</Label>
                    <div className="flex gap-2">
                      <Input
                        id="sku"
                        {...register('sku')}
                        placeholder="Auto-generate or enter"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setValue('sku', `JC-${Date.now().toString(36).toUpperCase().slice(-6)}`)}
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="stock">Stock Quantity *</Label>
                    <Input
                      id="stock"
                      type="number"
                      {...register('stock', { valueAsNumber: true })}
                    />
                    {errors.stock?.message && <p className="mt-1 text-sm text-red-500">{errors.stock.message}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Description sections */}
            <Card className="border-chocolate-100">
              <CardHeader>
                <CardTitle className="text-lg font-display text-chocolate-800">Additional Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="estimatedDelivery">Estimated Delivery</Label>
                    <Input
                      id="estimatedDelivery"
                      {...register('estimatedDelivery')}
                      placeholder="e.g., 3-5 business days"
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight">Weight (g)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      {...register('weight', { valueAsNumber: true })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Length</Label>
                    <Input
                      type="number"
                      step="0.1"
                      {...register('dimensions.length', { valueAsNumber: true })}
                    />
                  </div>
                  <div>
                    <Label>Width</Label>
                    <Input
                      type="number"
                      step="0.1"
                      {...register('dimensions.width', { valueAsNumber: true })}
                    />
                  </div>
                  <div>
                    <Label>Height</Label>
                    <Input
                      type="number"
                      step="0.1"
                      {...register('dimensions.height', { valueAsNumber: true })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="careInstructions">Care Instructions</Label>
                  <Textarea
                    id="careInstructions"
                    {...register('careInstructions')}
                    placeholder="e.g., Hand wash cold, lay flat to dry..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* SEO */}
            <Card className="border-chocolate-100">
              <CardHeader>
                <CardTitle className="text-lg font-display text-chocolate-800">SEO</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="seoTitle">Meta Title</Label>
                  <Input
                    id="seoTitle"
                    {...register('seoTitle')}
                    placeholder="SEO title"
                  />
                </div>
                <div>
                  <Label htmlFor="seoDescription">Meta Description</Label>
                  <Textarea
                    id="seoDescription"
                    {...register('seoDescription')}
                    placeholder="SEO description"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Media & Options */}
          <div className="space-y-6">
            <Card className="border-chocolate-100">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-display text-chocolate-800">Media</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} loading={isUploading}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </CardHeader>
              <CardContent>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleImageUpload(e.target.files)}
                />
                {images.length === 0 ? (
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                      dragIndex !== null ? 'border-gold bg-amber-50' : 'border-chocolate-200 hover:border-gold'
                    }`}
                  >
                    <Upload className="w-10 h-10 mx-auto text-chocolate-400 mb-3" />
                    <p className="text-sm text-chocolate-600">Drag & drop images or click Upload</p>
                    <p className="text-xs text-chocolate-400 mt-1">You can also paste screenshots (Ctrl+V)</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {images.map((img, index) => (
                        <div
                          key={img.publicId || index}
                          className="relative group aspect-square rounded-lg overflow-hidden bg-chocolate-100 border border-chocolate-200"
                        >
                          <img
                            src={img.url}
                            alt={img.alt || 'Product image'}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 bg-white/90 hover:bg-white"
                              onClick={() => {
                                if (index > 0) moveImage(index, index - 1)
                              }}
                              disabled={index === 0}
                            >
                              <span className="sr-only">Move left</span>
                              ←
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 bg-white/90 hover:bg-white"
                              onClick={() => {
                                if (index < images.length - 1) moveImage(index, index + 1)
                              }}
                              disabled={index === images.length - 1}
                            >
                              <span className="sr-only">Move right</span>
                              →
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 bg-red-500/90 hover:bg-red-500 text-white"
                              onClick={() => handleDeleteImage(img.publicId)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          {img.isPrimary && (
                            <span className="absolute top-1 left-1 bg-gold text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                              PRIMARY
                            </span>
                          )}
                          {!img.isPrimary && (
                            <button
                              type="button"
                              onClick={() => setPrimary(img.publicId)}
                              className="absolute top-1 right-1 bg-white/80 hover:bg-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              Set as Primary
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square rounded-lg border-2 border-dashed border-chocolate-200 hover:border-gold transition-colors flex flex-col items-center justify-center gap-1 text-chocolate-400 hover:text-gold"
                      >
                        <Plus className="w-6 h-6" />
                        <span className="text-xs">Add More</span>
                      </button>
                    </div>
                    <p className="text-xs text-chocolate-400">{images.length} image(s) · Click PRIMARY to set a different primary image</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-chocolate-100">
              <CardHeader>
                <CardTitle className="text-lg font-display text-chocolate-800">Colors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {colorFields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <Input
                      {...register(`colors.${index}.name`)}
                      placeholder="Color name"
                      className="flex-1"
                    />
                    <Input
                      {...register(`colors.${index}.hex`)}
                      type="color"
                      className="w-12 h-10 p-1 cursor-pointer"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 text-red-500"
                      onClick={() => removeColor(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendColor({ name: '', hex: '#000000', inStock: true })}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Color
                </Button>
              </CardContent>
            </Card>

            <Card className="border-chocolate-100">
              <CardHeader>
                <CardTitle className="text-lg font-display text-chocolate-800">Sizes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {sizeFields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <Input
                      {...register(`sizes.${index}.name`)}
                      placeholder="Size name"
                      className="flex-1"
                    />
                    <Input
                      {...register(`sizes.${index}.price`, { valueAsNumber: true })}
                      type="number"
                      step="0.01"
                      placeholder="Price"
                      className="w-28"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 text-red-500"
                      onClick={() => removeSize(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => appendSize({ name: '', price: 0, inStock: true })}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Size
                </Button>
              </CardContent>
            </Card>

            <Card className="border-chocolate-100">
              <CardHeader>
                <CardTitle className="text-lg font-display text-chocolate-800">Materials</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-2">
                  {watch('materials')?.map((mat, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-chocolate-100 rounded-full text-sm"
                    >
                      {mat}
                      <button
                        type="button"
                        onClick={() => {
                          const current = watch('materials') || []
                          setValue('materials', current.filter((_, idx) => idx !== i))
                        }}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={materialInput}
                    onChange={(e) => setMaterialInput(e.target.value)}
                    placeholder="Add material"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        if (materialInput.trim()) {
                          const current = watch('materials') || []
                          setValue('materials', [...current, materialInput.trim()])
                          setMaterialInput('')
                        }
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (materialInput.trim()) {
                        const current = watch('materials') || []
                        setValue('materials', [...current, materialInput.trim()])
                        setMaterialInput('')
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Status & Visibility */}
            <Card className="border-chocolate-100">
              <CardHeader>
                <CardTitle className="text-lg font-display text-chocolate-800">Visibility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="isPublished">Published</Label>
                  <Switch
                    id="isPublished"
                    checked={watch('isPublished')}
                    onCheckedChange={(v) => setValue('isPublished', v)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="isFeatured">Featured</Label>
                  <Switch
                    id="isFeatured"
                    checked={watch('isFeatured')}
                    onCheckedChange={(v) => setValue('isFeatured', v)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="isBestSeller">Best Seller</Label>
                  <Switch
                    id="isBestSeller"
                    checked={watch('isBestSeller')}
                    onCheckedChange={(v) => setValue('isBestSeller', v)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="isNewArrival">New Arrival</Label>
                  <Switch
                    id="isNewArrival"
                    checked={watch('isNewArrival')}
                    onCheckedChange={(v) => setValue('isNewArrival', v)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card className="border-chocolate-100">
              <CardHeader>
                <CardTitle className="text-lg font-display text-chocolate-800">Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  {...register('tags')}
                  placeholder="Comma-separated tags..."
                  rows={2}
                />
              </CardContent>
            </Card>

            {/* Customization */}
            <Card className="border-chocolate-100">
              <CardHeader>
                <CardTitle className="text-lg font-display text-chocolate-800">Customization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="allowsCustomization">Allow Customization</Label>
                  <Switch
                    id="allowsCustomization"
                    checked={watch('allowsCustomization')}
                    onCheckedChange={(v) => setValue('allowsCustomization', v)}
                  />
                </div>
                {watch('allowsCustomization') && (
                  <>
                    <div>
                      <Label>Customization Note</Label>
                      <Textarea
                        {...register('customizationNote')}
                        placeholder="Instructions for customization..."
                        rows={2}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Additional Price ($)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          {...register('additionalPrice', { valueAsNumber: true })}
                        />
                      </div>
                      <div>
                        <Label>Est. Days</Label>
                        <Input
                          type="number"
                          {...register('estimatedDays', { valueAsNumber: true })}
                        />
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full bg-gold hover:bg-gold-muted text-white h-12"
              loading={isSubmitting}
            >
              <Save className="w-5 h-5 mr-2" />
              {isEditing ? 'Update Product' : 'Create Product'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
