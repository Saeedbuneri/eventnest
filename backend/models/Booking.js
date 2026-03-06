import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema(
  {
    event:           { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    user:            { type: mongoose.Schema.Types.ObjectId, ref: 'User',  required: true },
    ticketTypeId:    { type: mongoose.Schema.Types.ObjectId, required: true },
    ticketTypeName:  { type: String },
    ticketTypePrice: { type: Number },
    quantity:        { type: Number, default: 1, min: 1 },
    totalAmount:     { type: Number, required: true, min: 0 },
    status:          { type: String, enum: ['confirmed', 'used', 'cancelled', 'pending'], default: 'confirmed' },
    qrToken:         { type: String, unique: true },
    attendeeName:    { type: String },
    attendeeEmail:   { type: String },
    promoCode:       { type: String },
    discount:        { type: Number, default: 0 },
  },
  { timestamps: true }
);

BookingSchema.pre('save', function (next) {
  if (!this.qrToken) {
    this.qrToken = `TK-${this._id}-${Date.now().toString(36).toUpperCase()}`;
  }
  next();
});

BookingSchema.index({ user: 1 });
BookingSchema.index({ event: 1 });
BookingSchema.index({ qrToken: 1 }, { unique: true });

export default mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
