import mongoose from 'mongoose';

const PromoCodeSchema = new mongoose.Schema(
  {
    event:           { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    code:            { type: String, required: true, uppercase: true, trim: true },
    discountPercent: { type: Number, required: true, min: 1, max: 100 },
    usageLimit:      { type: Number, default: null },
    usedCount:       { type: Number, default: 0 },
    expiresAt:       { type: Date, default: null },
    isActive:        { type: Boolean, default: true },
    createdBy:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

PromoCodeSchema.index({ event: 1, code: 1 }, { unique: true });

export default mongoose.models.PromoCode || mongoose.model('PromoCode', PromoCodeSchema);
