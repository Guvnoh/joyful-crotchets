import mongoose from 'mongoose';

const SiteSettingsSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: mongoose.Schema.Types.Mixed,
  category: { type: String, default: 'general' },
}, { timestamps: true });

export default mongoose.model('SiteSettings', SiteSettingsSchema);
