import mongoose from 'mongoose';

const TestimonialSchema = new mongoose.Schema({
  customerName: { type: String, required: [true, 'Please add a customer name'] },
  customerTitle: String,
  customerAvatar: { url: String, publicId: String },
  content: { type: String, required: [true, 'Please add testimonial content'] },
  rating: { type: Number, min: 1, max: 5 },
  isFeatured: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model('Testimonial', TestimonialSchema);
