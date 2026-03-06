import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role:     { type: String, enum: ['attendee', 'organizer', 'staff', 'admin'], default: 'attendee' },
    status:   { type: String, enum: ['active', 'pending', 'suspended'], default: 'active' },
    avatar:   { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);
