import mongoose from 'mongoose';

const CustomOrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  customerInfo: { name: String, email: String, phone: String },
  projectType: { type: String, required: [true, 'Please add a project type'] },
  description: { type: String, required: [true, 'Please add a description'] },
  referenceImages: [{ url: String, publicId: String }],
  budget: { min: Number, max: Number },
  preferredCompletionDate: Date,
  colors: [String],
  dimensions: String,
  materials: String,
  additionalNotes: String,
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'quoted', 'accepted', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  quotedPrice: Number,
  adminNotes: String,
  timeline: [{ status: String, date: Date, note: String }],
}, { timestamps: true });

CustomOrderSchema.pre('save', function (next) {
  if (this.isNew) {
    this.timeline.push({ status: 'pending', date: new Date(), note: 'Custom order request submitted' });
  }
  next();
});

export default mongoose.model('CustomOrder', CustomOrderSchema);
