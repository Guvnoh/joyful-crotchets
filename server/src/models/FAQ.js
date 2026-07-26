import mongoose from 'mongoose';

const FAQSchema = new mongoose.Schema({
  question: { type: String, required: [true, 'Please add a question'] },
  answer: { type: String, required: [true, 'Please add an answer'] },
  category: { type: String, default: 'General' },
  sortOrder: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('FAQ', FAQSchema);
