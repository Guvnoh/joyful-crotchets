import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: Number,
    color: String,
    size: String,
    image: String,
    customization: {
      notes: String,
      additionalPrice: Number
    }
  }],
  shippingAddress: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  billingAddress: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  paymentMethod: { type: String, enum: ['credit_card', 'paypal', 'stripe', 'cod'], required: true },
  paymentResult: { id: String, status: String, updateTime: String, emailAddress: String },
  subtotal: { type: Number, required: true },
  shippingCost: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  couponCode: String,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'completed'],
    default: 'pending'
  },
  trackingNumber: String,
  shippedAt: Date,
  deliveredAt: Date,
  notes: String,
  timeline: [{ status: String, date: Date, note: String }],
}, { timestamps: true });

OrderSchema.pre('save', function (next) {
  if (!this.orderNumber) {
    this.orderNumber = `JC${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
  }
  if (this.isNew) {
    this.timeline.push({ status: 'pending', date: new Date(), note: 'Order placed' });
  }
  next();
});

OrderSchema.index({ user: 1, status: 1 });
OrderSchema.index({ orderNumber: 1 });

export default mongoose.model('Order', OrderSchema);
