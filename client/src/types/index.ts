export interface User {
  _id: string
  name: string
  email: string
  role: 'customer' | 'admin'
  phone?: string
  avatar?: { url: string; publicId: string }
  addresses?: Address[]
  wishlist?: string[]
  isEmailVerified: boolean
  lastLogin?: string
  createdAt: string
  updatedAt: string
}

export interface Address {
  label: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault: boolean
}

export interface Product {
  _id: string
  name: string
  slug: string
  description: string
  shortDescription?: string
  price: number
  compareAtPrice?: number
  costPrice?: number
  sku?: string
  category: Category
  images: ProductImage[]
  colors: ProductColor[]
  sizes: ProductSize[]
  materials: string[]
  dimensions?: {
    length: number
    width: number
    height: number
    unit: string
  }
  weight?: number
  stock: number
  sold: number
  isPublished: boolean
  isFeatured: boolean
  isBestSeller: boolean
  isNewArrival: boolean
  tags: string[]
  estimatedDelivery?: string
  careInstructions?: string
  customizationOptions?: CustomizationOptions
  averageRating: number
  numReviews: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ProductImage {
  url: string
  publicId: string
  alt: string
  isPrimary: boolean
}

export interface ProductColor {
  name: string
  hex: string
  inStock: boolean
}

export interface ProductSize {
  name: string
  price: number
  inStock: boolean
}

export interface CustomizationOptions {
  allowsCustomization: boolean
  customizationNote?: string
  additionalPrice?: number
  estimatedDays?: number
}

export interface Category {
  _id: string
  name: string
  slug: string
  description?: string
  image?: { url: string; publicId: string }
  parentCategory?: string
  isActive: boolean
  sortOrder: number
  productCount?: number
  seoTitle?: string
  seoDescription?: string
  createdAt: string
  updatedAt: string
}

export interface Order {
  _id: string
  orderNumber: string
  user: User
  items: OrderItem[]
  shippingAddress: Address & { firstName: string; lastName: string; email: string; phone: string }
  billingAddress?: any
  paymentMethod: string
  paymentResult?: { id: string; status: string; updateTime: string; emailAddress: string }
  subtotal: number
  shippingCost: number
  tax: number
  discount: number
  total: number
  couponCode?: string
  status: OrderStatus
  trackingNumber?: string
  shippedAt?: string
  deliveredAt?: string
  notes?: string
  timeline: OrderTimeline[]
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  product: Product
  name: string
  price: number
  quantity: number
  color?: string
  size?: string
  image?: string
  customization?: { notes: string; additionalPrice: number }
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded' | 'completed'

export interface OrderTimeline {
  status: string
  date: string
  note?: string
}

export interface Review {
  _id: string
  product: string
  user: User
  rating: number
  title: string
  comment: string
  images?: { url: string; publicId: string }[]
  isVerifiedPurchase: boolean
  isApproved: boolean
  helpfulCount: number
  createdAt: string
  updatedAt: string
}

export interface CartItem {
  product: Product
  quantity: number
  color?: string
  size?: string
}

export interface Cart {
  _id: string
  user?: string
  sessionId?: string
  items: CartItem[]
  couponCode?: string
  updatedAt: string
}

export interface Testimonial {
  _id: string
  customerName: string
  customerTitle?: string
  customerAvatar?: { url: string; publicId: string }
  content: string
  rating?: number
  isFeatured: boolean
  isPublished: boolean
  sortOrder: number
  createdAt: string
}

export interface FAQ {
  _id: string
  question: string
  answer: string
  category?: string
  sortOrder: number
  isPublished: boolean
  createdAt: string
}

export interface CustomOrder {
  _id: string
  user?: string
  customerInfo: { name: string; email: string; phone: string }
  projectType: string
  description: string
  referenceImages?: { url: string; publicId: string }[]
  budget?: { min: number; max: number }
  preferredCompletionDate?: string
  colors?: string[]
  dimensions?: string
  materials?: string
  additionalNotes?: string
  status: string
  quotedPrice?: number
  adminNotes?: string
  timeline?: { status: string; date: string; note?: string }[]
  createdAt: string
}

export interface Coupon {
  _id: string
  code: string
  description?: string
  discountType: 'percentage' | 'fixed'
  discountValue: number
  minPurchase: number
  maxDiscount?: number
  usageLimit?: number
  usedCount: number
  isActive: boolean
  expiresAt?: string
  createdAt: string
}

export interface Subscriber {
  _id: string
  email: string
  name?: string
  isActive: boolean
  subscribedAt: string
}

export interface SiteSettings {
  [key: string]: any
}

export interface ActivityLog {
  _id: string
  user?: { _id: string; name: string; email: string }
  action: string
  resource: string
  resourceId?: string
  description?: string
  metadata?: Record<string, any>
  ip?: string
  userAgent?: string
  createdAt: string
}

export interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalCustomers: number
  totalProducts: number
  recentOrders: Order[]
  revenueByMonth: { month: string; revenue: number }[]
  topProducts: { product: Product; totalSold: number; revenue: number }[]
  orderStatusBreakdown: { status: string; count: number }[]
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}
