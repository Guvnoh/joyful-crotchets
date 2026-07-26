import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Please add a product name'], trim: true },
  slug: { type: String, unique: true },
  description: { type: String, required: [true, 'Please add a description'] },
  shortDescription: String,
  price: { type: Number, required: [true, 'Please add a price'], min: 0 },
  compareAtPrice: { type: Number, min: 0 },
  costPrice: { type: Number, min: 0 },
  sku: { type: String, unique: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  images: [{ url: String, publicId: String, alt: String, isPrimary: { type: Boolean, default: false } }],
  colors: [{ name: String, hex: String, inStock: { type: Boolean, default: true } }],
  sizes: [{ name: String, price: Number, inStock: { type: Boolean, default: true } }],
  materials: [String],
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: { type: String, default: 'cm' }
  },
  weight: Number,
  stock: { type: Number, required: true, min: 0, default: 0 },
  sold: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  tags: [String],
  estimatedDelivery: { type: String, default: '3-5 business days' },
  careInstructions: String,
  customizationOptions: {
    allowsCustomization: { type: Boolean, default: false },
    customizationNote: String,
    additionalPrice: Number,
    estimatedDays: Number
  },
  seoTitle: String,
  seoDescription: String,
  averageRating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

ProductSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  if (!this.sku) {
    this.sku = `JC-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
  }
  next();
});

ProductSchema.virtual('discountPercentage').get(function () {
  if (this.compareAtPrice && this.compareAtPrice > this.price) {
    return Math.round(((this.compareAtPrice - this.price) / this.compareAtPrice) * 100);
  }
  return 0;
});

ProductSchema.virtual('reviews', {
  ref: 'Review',
  localField: '_id',
  foreignField: 'product',
});

ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });
ProductSchema.set('toJSON', { virtuals: true });
ProductSchema.set('toObject', { virtuals: true });

export default mongoose.model('Product', ProductSchema);
