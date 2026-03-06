/**
 * Seed script — creates demo users for all roles.
 * Run once: node scripts/seed.js
 */

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');
const fs       = require('fs');
const path     = require('path');

// Manually parse .env (avoids needing a separate dotenv call)
const envPath = path.join(__dirname, '..', '.env');
const envLocalPath = path.join(__dirname, '..', '.env.local');
const resolvedEnv = fs.existsSync(envLocalPath) ? envLocalPath : envPath;
if (fs.existsSync(resolvedEnv)) {
  for (const line of fs.readFileSync(resolvedEnv, 'utf8').split(/\r?\n/)) {
    const eq = line.indexOf('=');
    if (eq > 0 && !line.startsWith('#')) {
      const key = line.slice(0, eq).trim();
      const val = line.slice(eq + 1).trim();
      if (key) process.env[key] = val;
    }
  }
}

const MONGO_URI = process.env.MONGODB_URI;
if (!MONGO_URI) { console.error('MONGODB_URI missing in .env.local'); process.exit(1); }

const UserSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  email:     { type: String, required: true, unique: true, lowercase: true },
  password:  { type: String, required: true },
  role:      { type: String, enum: ['attendee','organizer','staff','admin'], default: 'attendee' },
  status:    { type: String, enum: ['active','pending','suspended'], default: 'active' },
  avatar:    String,
}, { timestamps: true });

const User = mongoose.models?.User || mongoose.model('User', UserSchema);

const DEMO_USERS = [
  { name: 'Demo Admin',     email: 'admin@demo.com',     role: 'admin'     },
  { name: 'Demo Organizer', email: 'organizer@demo.com', role: 'organizer' },
  { name: 'Demo Staff',     email: 'staff@demo.com',     role: 'staff'     },
  { name: 'Demo Attendee',  email: 'attendee@demo.com',  role: 'attendee'  },
];

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  const password = await bcrypt.hash('demo1234', 12);

  for (const u of DEMO_USERS) {
    const existing = await User.findOne({ email: u.email });
    if (existing) {
      console.log(`  SKIP  ${u.email} (already exists, role: ${existing.role})`);
    } else {
      await User.create({ ...u, password });
      console.log(`  CREATE ${u.email} (${u.role})`);
    }
  }

  await mongoose.disconnect();
  console.log('\nDone. You can now log in at /auth/login with:');
  console.log('  admin@demo.com     / demo1234  → /admin/dashboard');
  console.log('  organizer@demo.com / demo1234  → /organizer/dashboard');
  console.log('  staff@demo.com     / demo1234  → /staff/scan');
  console.log('  attendee@demo.com  / demo1234  → /my-tickets');
}

seed().catch((err) => { console.error(err); process.exit(1); });
