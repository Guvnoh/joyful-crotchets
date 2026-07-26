import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sessionId: String,
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, min: 1, default: 1 },
    color: String,
    size: String,
    addedAt: { type: Date, default: Date.now }
  }],
  couponCode: String,
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

CartSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Cart', CartSchema);
