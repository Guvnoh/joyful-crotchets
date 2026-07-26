import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Please add a category name'], unique: true, trim: true },
  slug: { type: String, unique: true },
  description: String,
  image: { url: String, publicId: String },
  parentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
  seoTitle: String,
  seoDescription: String,
}, { timestamps: true });

CategorySchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  next();
});

CategorySchema.virtual('productCount', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'category',
  count: true,
});

CategorySchema.set('toJSON', { virtuals: true });
CategorySchema.set('toObject', { virtuals: true });

export default mongoose.model('Category', CategorySchema);
