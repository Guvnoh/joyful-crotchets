import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Upload,
  X,
  Plus,
  Image as ImageIcon,
  Trash2,
  RefreshCw,
  Check,
  Info,
  Package,
  DollarSign,
  Palette,
  Settings,
  Eye,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
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
      if (!colors || !Array.isArray(colors)) return colors
      return colors.filter((c: any) => c && c.name && String(c.name).trim() !== '')
    },
    z.array(z.object({
      name: z.string().min(1),
      hex: z.string().min(1),
      inStock: z.boolean(),
    })).optional()
  ),
  sizes: z.preprocess(
    (sizes) => {
      if (!sizes || !Array.isArray(sizes)) return sizes
      return sizes.filter((s: any) => s && s.name && String(s.name).trim() !== '')
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

const STEPS = [
  { id: 'basic', label: 'Basic Info', icon: Package, description: 'Product name, description, and category' },
  { id: 'pricing', label: 'Pricing & Stock', icon: DollarSign, description: 'Set your price, costs, and inventory' },
  { id: 'media', label: 'Images', icon: ImageIcon, description: 'Upload product photos' },
  { id: 'variants', label: 'Variants', icon: Palette, description: 'Colors, sizes, and materials' },
  { id: 'details', label: 'Details', icon: Settings, description: 'Dimensions, delivery, and care' },
  { id: 'visibility', label: 'Visibility & SEO', icon: Eye, description: 'Publish settings and search optimization' },
]

function Hint({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-start gap-1.5 text-xs text-mocha mt-1">
      <Info className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
      <span>{children}</span>
    </span>
  )
}

function Optional() {
  return <span className="text-xs font-normal text-sand ml-1">(Optional)</span>
}

function StepIndicator({ currentStep, steps }: { currentStep: number; steps: typeof STEPS }) {
  return (
    <div className="flex items-center justify-center gap-1 sm:gap-2">
      {steps.map((step, i) => {
        const isComplete = i < currentStep
        const isCurrent = i === currentStep
        return (
          <div key={step.id} className="flex items-center gap-1 sm:gap-2">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  isComplete
                    ? 'bg-gold text-white'
                    : isCurrent
                    ? 'bg-chocolate text-white ring-2 ring-gold/30'
                    : 'bg-beige text-mocha'
                }`}
              >
                {isComplete ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-[10px] sm:text-xs mt-1 hidden sm:block ${isCurrent ? 'text-chocolate font-medium' : 'text-mocha'}`}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-6 sm:w-10 h-0.5 ${isComplete ? 'bg-gold' : 'bg-beige'} mt-0 sm:mt-0 mb-4 sm:mb-0`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function AdminProductForm() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const isEditing = !!id

  const { data: existingProduct, isLoading: isLoadingProduct } = useProduct(id || '')
  const { data: categories } = useCategories()
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()

  const [currentStep, setCurrentStep] = useState(0)
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
    trigger,
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

  const STEP_FIELDS: (keyof ProductFormData)[][] = [
    ['name', 'description', 'category'],
    ['price', 'stock'],
    [],
    [],
    [],
    [],
  ]

  const validateStep = async () => {
    const fields = STEP_FIELDS[currentStep]
    if (fields.length === 0) return true
    return await trigger(fields)
  }

  const handleNext = async () => {
    const valid = await validateStep()
    if (valid && currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

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
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 rounded-lg" />
      </div>
    )
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <motion.div
            key="basic"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5"
          >
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="e.g., Handmade Crochet Baby Blanket"
              />
              <Hint>Choose a clear, descriptive name that customers will search for.</Hint>
              {errors.name?.message && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                {...register('description')}
                placeholder="Describe your product in detail — materials used, craftsmanship, what makes it special..."
                rows={6}
              />
              <Hint>The more detail you provide, the more confident customers will feel purchasing.</Hint>
              {errors.description?.message && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
            </div>
            <div>
              <Label htmlFor="shortDescription">Short Description <Optional /></Label>
              <Textarea
                id="shortDescription"
                {...register('shortDescription')}
                placeholder="One or two sentences for product cards and previews..."
                rows={2}
              />
              <Hint>Shown on product cards and in search results. Keep it concise.</Hint>
            </div>
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
                value={watch('category')}
                onValueChange={(v) => setValue('category', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((cat) => (
                    <SelectItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Hint>Categories help customers browse and find your products.</Hint>
              {errors.category?.message && <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>}
            </div>
          </motion.div>
        )

      case 1:
        return (
          <motion.div
            key="pricing"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5"
          >
            <div>
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register('price', { valueAsNumber: true })}
                placeholder="0.00"
              />
              <Hint>The selling price customers will see. Set in NGN (₦).</Hint>
              {errors.price?.message && <p className="mt-1 text-sm text-red-500">{errors.price.message}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="compareAtPrice">Compare At Price <Optional /></Label>
                <Input
                  id="compareAtPrice"
                  type="number"
                  step="0.01"
                  {...register('compareAtPrice', { valueAsNumber: true })}
                  placeholder="Leave blank if not applicable"
                />
                <Hint>Original price before discount. Shows a strikethrough to highlight savings.</Hint>
              </div>
              <div>
                <Label htmlFor="costPrice">Cost Price <Optional /></Label>
                <Input
                  id="costPrice"
                  type="number"
                  step="0.01"
                  {...register('costPrice', { valueAsNumber: true })}
                  placeholder="Your cost to produce"
                />
                <Hint>For your records only — never shown to customers. Helps track profit margins.</Hint>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="sku">SKU <Optional /></Label>
                <div className="flex gap-2">
                  <Input
                    id="sku"
                    {...register('sku')}
                    placeholder="e.g., JC-BAB-001"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setValue('sku', `JC-${Date.now().toString(36).toUpperCase().slice(-6)}`)}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
                <Hint>Stock Keeping Unit — your internal identifier. Click the refresh icon to auto-generate one.</Hint>
              </div>
              <div>
                <Label htmlFor="stock">Stock Quantity *</Label>
                <Input
                  id="stock"
                  type="number"
                  {...register('stock', { valueAsNumber: true })}
                  placeholder="0"
                />
                <Hint>How many units are available. Set to 0 to mark as out of stock.</Hint>
                {errors.stock?.message && <p className="mt-1 text-sm text-red-500">{errors.stock.message}</p>}
              </div>
            </div>
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            key="media"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5"
          >
            <div>
              <Label>Product Images <Optional /></Label>
              <Hint>High-quality photos sell products. Add as many as you like — the first image becomes the primary one.</Hint>
            </div>
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
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer ${
                  dragIndex !== null ? 'border-gold bg-amber-50' : 'border-sand/50 hover:border-gold'
                }`}
              >
                <Upload className="w-12 h-12 mx-auto text-mocha/40 mb-4" />
                <p className="text-sm font-medium text-chocolate">Drag & drop images here</p>
                <p className="text-xs text-mocha mt-1">or click to browse</p>
                <p className="text-xs text-mocha/60 mt-3">You can also paste screenshots with Ctrl+V</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {images.map((img, index) => (
                    <div
                      key={img.publicId || index}
                      className="relative group aspect-square rounded-xl overflow-hidden bg-beige border border-sand/30"
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
                          onClick={() => { if (index > 0) moveImage(index, index - 1) }}
                          disabled={index === 0}
                        >
                          ←
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 bg-white/90 hover:bg-white"
                          onClick={() => { if (index < images.length - 1) moveImage(index, index + 1) }}
                          disabled={index === images.length - 1}
                        >
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
                        <span className="absolute top-1.5 left-1.5 bg-gold text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          PRIMARY
                        </span>
                      )}
                      {!img.isPrimary && (
                        <button
                          type="button"
                          onClick={() => setPrimary(img.publicId)}
                          className="absolute top-1.5 right-1.5 bg-white/80 hover:bg-white text-[10px] px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Set Primary
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-xl border-2 border-dashed border-sand/50 hover:border-gold transition-colors flex flex-col items-center justify-center gap-1 text-mocha hover:text-gold"
                  >
                    <Plus className="w-6 h-6" />
                    <span className="text-xs">Add More</span>
                  </button>
                </div>
                <p className="text-xs text-mocha">{images.length} image(s) uploaded</p>
              </div>
            )}
          </motion.div>
        )

      case 3:
        return (
          <motion.div
            key="variants"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Colors */}
            <div className="space-y-3">
              <div>
                <Label>Colors <Optional /></Label>
                <Hint>Add available color options. Customers can select a color when ordering.</Hint>
              </div>
              {colorFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <Input
                    {...register(`colors.${index}.name`)}
                    placeholder="e.g., Dusty Rose"
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
            </div>

            {/* Sizes */}
            <div className="space-y-3">
              <div>
                <Label>Sizes <Optional /></Label>
                <Hint>Add size variants if your product comes in different sizes. Each size can have its own price.</Hint>
              </div>
              {sizeFields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <Input
                    {...register(`sizes.${index}.name`)}
                    placeholder="e.g., Small, Medium, Large"
                    className="flex-1"
                  />
                  <Input
                    {...register(`sizes.${index}.price`, { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    placeholder="Price override"
                    className="w-36"
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
            </div>

            {/* Materials */}
            <div className="space-y-3">
              <div>
                <Label>Materials <Optional /></Label>
                <Hint>List the materials used — e.g., "100% Acrylic Yarn", "Cotton Blend". Helps customers know what they're buying.</Hint>
              </div>
              <div className="flex flex-wrap gap-2">
                {watch('materials')?.map((mat, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-beige rounded-full text-sm text-chocolate"
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
                  placeholder="Type a material and press Enter"
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
            </div>
          </motion.div>
        )

      case 4:
        return (
          <motion.div
            key="details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5"
          >
            <div>
              <Label>Dimensions <Optional /></Label>
              <Hint>Useful for shipping estimates. All fields are optional — fill in what applies.</Hint>
              <div className="grid grid-cols-4 gap-3 mt-2">
                <div>
                  <Input
                    type="number"
                    step="0.1"
                    {...register('dimensions.length', { valueAsNumber: true })}
                    placeholder="Length"
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    step="0.1"
                    {...register('dimensions.width', { valueAsNumber: true })}
                    placeholder="Width"
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    step="0.1"
                    {...register('dimensions.height', { valueAsNumber: true })}
                    placeholder="Height"
                  />
                </div>
                <div>
                  <Select
                    value={watch('dimensions.unit') || 'cm'}
                    onValueChange={(v) => setValue('dimensions.unit', v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cm">cm</SelectItem>
                      <SelectItem value="in">inches</SelectItem>
                      <SelectItem value="mm">mm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="weight">Weight (grams) <Optional /></Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                {...register('weight', { valueAsNumber: true })}
                placeholder="e.g., 250"
              />
              <Hint>Helps calculate shipping costs. Enter weight in grams.</Hint>
            </div>
            <div>
              <Label htmlFor="estimatedDelivery">Estimated Delivery <Optional /></Label>
              <Input
                id="estimatedDelivery"
                {...register('estimatedDelivery')}
                placeholder="e.g., 3-5 business days"
              />
              <Hint>Shown to customers at checkout. Helps set expectations for handmade items.</Hint>
            </div>
            <div>
              <Label htmlFor="careInstructions">Care Instructions <Optional /></Label>
              <Textarea
                id="careInstructions"
                {...register('careInstructions')}
                placeholder="e.g., Hand wash cold, lay flat to dry. Do not bleach or iron directly."
                rows={3}
              />
              <Hint>Helps customers keep their purchase in great condition.</Hint>
            </div>
          </motion.div>
        )

      case 5:
        return (
          <motion.div
            key="visibility"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* Publishing Status */}
            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold">Publishing</Label>
                <Hint>Control when and how this product appears on your store.</Hint>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-beige/50">
                <div>
                  <Label htmlFor="isPublished" className="font-medium">Published</Label>
                  <p className="text-xs text-mocha">Make this product visible in your store</p>
                </div>
                <Switch
                  id="isPublished"
                  checked={watch('isPublished')}
                  onCheckedChange={(v) => setValue('isPublished', v)}
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-beige/50">
                <div>
                  <Label htmlFor="isFeatured" className="font-medium">Featured <Optional /></Label>
                  <p className="text-xs text-mocha">Show on the homepage featured section</p>
                </div>
                <Switch
                  id="isFeatured"
                  checked={watch('isFeatured')}
                  onCheckedChange={(v) => setValue('isFeatured', v)}
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-beige/50">
                <div>
                  <Label htmlFor="isBestSeller" className="font-medium">Best Seller <Optional /></Label>
                  <p className="text-xs text-mocha">Highlight as a best-selling item</p>
                </div>
                <Switch
                  id="isBestSeller"
                  checked={watch('isBestSeller')}
                  onCheckedChange={(v) => setValue('isBestSeller', v)}
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-beige/50">
                <div>
                  <Label htmlFor="isNewArrival" className="font-medium">New Arrival <Optional /></Label>
                  <p className="text-xs text-mocha">Mark as newly added to your collection</p>
                </div>
                <Switch
                  id="isNewArrival"
                  checked={watch('isNewArrival')}
                  onCheckedChange={(v) => setValue('isNewArrival', v)}
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <Label htmlFor="tags">Tags <Optional /></Label>
              <Textarea
                {...register('tags')}
                placeholder="e.g., handmade, gift, baby, nursery"
                rows={2}
              />
              <Hint>Comma-separated keywords that help customers find this product via search.</Hint>
            </div>

            {/* SEO */}
            <div className="space-y-3">
              <div>
                <Label className="text-base font-semibold">Search Engine Optimization <Optional /></Label>
                <Hint>Control how this product appears in Google search results. If left blank, the product name and description will be used.</Hint>
              </div>
              <div>
                <Label htmlFor="seoTitle">Meta Title</Label>
                <Input
                  id="seoTitle"
                  {...register('seoTitle')}
                  placeholder="e.g., Handmade Crochet Baby Blanket | Joyful Crochets"
                />
                <Hint>Recommended: 50-60 characters. This is the clickable title in search results.</Hint>
              </div>
              <div>
                <Label htmlFor="seoDescription">Meta Description</Label>
                <Textarea
                  id="seoDescription"
                  {...register('seoDescription')}
                  placeholder="A short summary for search engines..."
                  rows={2}
                />
                <Hint>Recommended: 150-160 characters. Appears below the title in search results.</Hint>
              </div>
            </div>

            {/* Customization */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-beige/50">
                <div>
                  <Label htmlFor="allowsCustomization" className="font-medium">Allow Customization <Optional /></Label>
                  <p className="text-xs text-mocha">Let customers request custom changes to this product</p>
                </div>
                <Switch
                  id="allowsCustomization"
                  checked={watch('allowsCustomization')}
                  onCheckedChange={(v) => setValue('allowsCustomization', v)}
                />
              </div>
              {watch('allowsCustomization') && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="space-y-3 pl-3 border-l-2 border-gold/30"
                >
                  <div>
                    <Label>Customization Note</Label>
                    <Textarea
                      {...register('customizationNote')}
                      placeholder="e.g., You can choose your preferred color and add a name embroidery..."
                      rows={2}
                    />
                    <Hint>Tell customers what can be customized and any limitations.</Hint>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Additional Price (₦)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        {...register('additionalPrice', { valueAsNumber: true })}
                        placeholder="0"
                      />
                      <Hint>Extra charge for customization work.</Hint>
                    </div>
                    <div>
                      <Label>Extra Production Days</Label>
                      <Input
                        type="number"
                        {...register('estimatedDays', { valueAsNumber: true })}
                        placeholder="0"
                      />
                      <Hint>How many additional days custom orders take.</Hint>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
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
          <h1 className="text-2xl font-bold text-chocolate font-display">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-mocha text-sm mt-0.5">
            {isEditing ? 'Update your product details' : STEPS[currentStep].description}
          </p>
        </div>
      </motion.div>

      {/* Step Indicator */}
      <StepIndicator currentStep={currentStep} steps={STEPS} />

      {/* Step Content */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card className="border-sand/30">
          <CardContent className="p-6">
            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={(e) => { e.preventDefault(); currentStep === 0 ? navigate('/admin/products') : handleBack() }}
            className="border-sand/50"
          >
            {currentStep === 0 ? 'Cancel' : 'Back'}
          </Button>

          {currentStep < STEPS.length - 1 ? (
            <Button
              type="button"
              onClick={(e) => { e.preventDefault(); handleNext() }}
              className="bg-chocolate hover:bg-chocolate/90 text-white"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="submit"
              className="bg-gold hover:bg-gold/90 text-white"
              loading={isSubmitting}
            >
              <Save className="w-4 h-4 mr-2" />
              {isEditing ? 'Update Product' : 'Create Product'}
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
