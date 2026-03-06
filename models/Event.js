import mongoose from 'mongoose';

const TicketTypeSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  price:      { type: Number, required: true, min: 0 },
  quantity:   { type: Number, required: true, min: 0 },
  sold:       { type: Number, default: 0, min: 0 },
  maxPerUser: { type: Number, default: 10 },
});

const EventSchema = new mongoose.Schema(
  {
    title:        { type: String, required: true, trim: true },
    description:  { type: String, required: true },
    category:     { type: String, required: true },
    bannerImage:  { type: String },
    startDate:    { type: Date, required: true },
    endDate:      { type: Date, required: true },
    venue: {
      address: String,
      city:    String,
      coordinates: { lat: Number, lng: Number },
    },
    ticketTypes:   [TicketTypeSchema],
    organizer:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status:        { type: String, enum: ['draft', 'published', 'cancelled'], default: 'published' },
    isPublic:      { type: Boolean, default: true },
    refundPolicy:  { type: String, default: 'no_refund' },
    promoCode:     { type: String },
    promoDiscount: { type: Number, default: 0 },
    featured:      { type: Boolean, default: false },
  },
  { timestamps: true }
);

EventSchema.index({ 'venue.city': 1, startDate: 1 });
EventSchema.index({ category: 1 });
EventSchema.index({ organizer: 1 });
EventSchema.index({ title: 'text', description: 'text' });

export default mongoose.models.Event || mongoose.model('Event', EventSchema);
