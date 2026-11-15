import mongoose, { Schema } from 'mongoose';

const schemaOptions = { versionKey: false } as const;

// User Schema
export const UserSchema = new Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
  favorites: [{ type: String }],
  createdAt: { type: String, default: () => new Date().toISOString() },
  updatedAt: { type: String, default: () => new Date().toISOString() }
}, schemaOptions);

// Temple Schema
export const TempleSchema = new Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true, index: true },
  slug: { type: String, required: true, unique: true, index: true },
  subtitle: { type: String },
  deity: { type: String, required: true, index: true },
  state: { type: String, required: true, index: true },
  district: { type: String },
  city: { type: String, required: true, index: true },
  address: { type: String },
  pinCode: { type: String },
  latitude: { type: Number, default: 13.6288 },
  longitude: { type: Number, default: 79.4192 },
  description: { type: String },
  history: { type: String },
  significance: { type: String },
  architecture: { type: String },
  traditions: { type: String },
  festivals: { type: String },
  morningTimings: { type: String },
  eveningTimings: { type: String },
  darshanTimings: { type: String },
  specialDayTimings: { type: String },
  phone: { type: String },
  email: { type: String },
  website: { type: String },
  officialWebsite: { type: String },
  sourceUrl: { type: String },
  verificationStatus: {
    type: String,
    enum: ['Verified from Official Portal', 'Information not yet verified'],
    default: 'Verified from Official Portal'
  },
  dressCodeMen: { type: String },
  dressCodeWomen: { type: String },
  rules: [{ type: String }],
  photographyRule: { type: String },
  footwearRule: { type: String },
  queueInstructions: { type: String },
  bannerImage: { type: String },
  sanctumImage: { type: String },
  popular: { type: Boolean, default: false },
  active: { type: Boolean, default: true },
  donationInfo: {
    counterLocation: String,
    officialUrl: String,
    instructions: String,
    trustName: String
  },
  prasadamSummary: { type: String },
  createdAt: { type: String, default: () => new Date().toISOString() },
  updatedAt: { type: String, default: () => new Date().toISOString() }
}, schemaOptions);

// Pooja / Seva Schema
export const PoojaSchema = new Schema({
  _id: { type: String, required: true },
  templeId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String },
  dateOrFrequency: { type: String },
  time: { type: String },
  duration: { type: String },
  price: { type: Number, default: 0 },
  availability: { type: String, default: 'Available' },
  instructions: { type: String },
  significance: { type: String },
  prasadamDetails: { type: String },
  verificationStatus: { type: String, default: 'Verified' },
  active: { type: Boolean, default: true }
}, schemaOptions);

// Schedule Schema
export const ScheduleSchema = new Schema({
  _id: { type: String, required: true },
  templeId: { type: String, required: true, index: true },
  time: { type: String, required: true },
  activity: { type: String, required: true },
  location: { type: String },
  category: { type: String },
  status: { type: String, default: 'Upcoming' },
  active: { type: Boolean, default: true }
}, schemaOptions);

// Facility Schema
export const FacilitySchema = new Schema({
  _id: { type: String, required: true },
  templeId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String },
  location: { type: String },
  timing: { type: String },
  status: { type: String, default: 'Operational' },
  contact: { type: String },
  icon: { type: String, default: 'Info' }
}, schemaOptions);

// Parking Schema
export const ParkingSchema = new Schema({
  _id: { type: String, required: true },
  templeId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  location: { type: String },
  capacity: { type: String },
  timing: { type: String },
  distance: { type: String },
  walkingTime: { type: String },
  vehicleTypes: { type: String },
  fee: { type: String },
  description: { type: String },
  availability: { type: String, default: 'Available' },
  active: { type: Boolean, default: true }
}, schemaOptions);

// Prasadam Schema
export const PrasadamSchema = new Schema({
  _id: { type: String, required: true },
  templeId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  description: { type: String },
  counterLocation: { type: String },
  distributionTiming: { type: String },
  price: { type: String, default: 'Free' },
  availability: { type: String, default: 'Available' },
  isSpecialOffering: { type: Boolean, default: false }
}, schemaOptions);

// Donation Schema
export const DonationSchema = new Schema({
  _id: { type: String, required: true },
  templeId: { type: String, required: true, index: true },
  trustName: { type: String, required: true },
  donationCounterLocation: { type: String },
  officialDonationUrl: { type: String },
  instructions: { type: String },
  taxExemptionInfo: { type: String }
}, schemaOptions);

// Hospital Schema
export const HospitalSchema = new Schema({
  _id: { type: String, required: true },
  templeId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  address: { type: String },
  distance: { type: String },
  phone: { type: String },
  emergencyAvailable: { type: Boolean, default: true },
  latitude: { type: Number },
  longitude: { type: Number },
  facilities: [{ type: String }],
  ambulanceNumber: { type: String }
}, schemaOptions);

// Emergency Contact Schema
export const EmergencyContactSchema = new Schema({
  _id: { type: String, required: true },
  templeId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  phone: { type: String, required: true },
  altPhone: { type: String },
  description: { type: String },
  availableHours: { type: String, default: '24 Hours' },
  active: { type: Boolean, default: true }
}, schemaOptions);

// Guideline Schema
export const GuidelineSchema = new Schema({
  _id: { type: String, required: true },
  templeId: { type: String, default: 'all', index: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  content: [{ type: String }],
  importance: { type: String, default: 'Mandatory' },
  active: { type: Boolean, default: true }
}, schemaOptions);

// Announcement Schema
export const AnnouncementSchema = new Schema({
  _id: { type: String, required: true },
  templeId: { type: String, default: 'all', index: true },
  templeName: { type: String },
  title: { type: String, required: true },
  description: { type: String, required: true },
  priority: { type: String, default: 'Notice' },
  publishDate: { type: String, default: () => new Date().toISOString().slice(0, 10) },
  expiryDate: { type: String },
  active: { type: Boolean, default: true }
}, schemaOptions);

// Contact Message Schema
export const MessageSchema = new Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  subject: { type: String, required: true },
  message: { type: String, required: true },
  status: { type: String, enum: ['New', 'Read', 'Resolved'], default: 'New' },
  createdAt: { type: String, default: () => new Date().toISOString() }
}, schemaOptions);

// Favorite Schema
export const FavoriteSchema = new Schema({
  _id: { type: String, required: true },
  userId: { type: String, required: true, index: true },
  itemType: { type: String, required: true },
  itemId: { type: String, required: true },
  title: { type: String },
  details: { type: String },
  createdAt: { type: String, default: () => new Date().toISOString() }
}, schemaOptions);

// Booking Schema
export const BookingSchema = new Schema({
  _id: { type: String, required: true },
  bookingId: { type: String, required: true, unique: true, index: true },
  userId: { type: String, index: true },
  templeId: { type: String, required: true, index: true },
  templeName: { type: String, required: true },
  poojaId: { type: String, required: true },
  poojaName: { type: String, required: true },
  date: { type: String, required: true, index: true },
  slot: { type: String, required: true },
  devoteeName: { type: String, required: true },
  gotram: { type: String },
  nakshatram: { type: String },
  personCount: { type: Number, default: 1 },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  sankalpam: { type: String },
  amount: { type: Number, default: 0 },
  paymentMode: { type: String, default: 'Demo Online' },
  status: { type: String, enum: ['Confirmed', 'Completed', 'Cancelled'], default: 'Confirmed' },
  qrDataUrl: { type: String },
  createdAt: { type: String, default: () => new Date().toISOString() }
}, schemaOptions);

// Calendar Event Schema
export const CalendarEventSchema = new Schema({
  _id: { type: String, required: true },
  templeId: { type: String, default: 'all', index: true },
  templeName: { type: String, default: 'All Temples' },
  title: { type: String, required: true },
  date: { type: String, required: true, index: true },
  time: { type: String, required: true },
  category: {
    type: String,
    enum: ['Festival', 'Pooja', 'Special Seva', 'Timing Change', 'Announcement'],
    default: 'Special Seva'
  },
  description: { type: String, required: true },
  location: { type: String },
  priority: { type: String, default: 'Normal' }
}, schemaOptions);

// Visit Plan Schema
export const VisitPlanSchema = new Schema({
  _id: { type: String, required: true },
  userId: { type: String, index: true },
  templeId: { type: String, required: true, index: true },
  templeName: { type: String, required: true },
  visitDate: { type: String, required: true },
  visitorCount: { type: Number, default: 1 },
  arrivalTime: { type: String, required: true },
  hasElderly: { type: Boolean, default: false },
  hasChildren: { type: Boolean, default: false },
  transportMode: { type: String, default: 'Private Car' },
  wheelchairNeeded: { type: Boolean, default: false },
  notes: { type: String },
  itinerary: [{
    time: String,
    title: String,
    description: String,
    icon: String,
    category: String
  }],
  summary: {
    recommendedArrival: String,
    estimatedDuration: String,
    parkingZone: String,
    prasadamCounter: String,
    emergencyDesk: String,
    dressCodeSummary: String
  },
  createdAt: { type: String, default: () => new Date().toISOString() }
}, schemaOptions);

// Feedback Schema
export const FeedbackSchema = new Schema({
  _id: { type: String, required: true },
  userId: { type: String, index: true },
  userName: { type: String, required: true },
  userEmail: { type: String },
  templeId: { type: String, required: true, index: true },
  templeName: { type: String, required: true },
  overallRating: { type: Number, required: true, min: 1, max: 5 },
  useful: { type: Boolean, default: true },
  navigationRating: { type: Number, default: 5, min: 1, max: 5 },
  facilitiesRating: { type: Number, default: 5, min: 1, max: 5 },
  experienceText: { type: String, required: true },
  suggestions: { type: String },
  createdAt: { type: String, default: () => new Date().toISOString() }
}, schemaOptions);

// Export Mongoose models safely
export const UserModel = mongoose.models.User || mongoose.model('User', UserSchema);
export const TempleModel = mongoose.models.Temple || mongoose.model('Temple', TempleSchema);
export const PoojaModel = mongoose.models.Pooja || mongoose.model('Pooja', PoojaSchema);
export const ScheduleModel = mongoose.models.Schedule || mongoose.model('Schedule', ScheduleSchema);
export const FacilityModel = mongoose.models.Facility || mongoose.model('Facility', FacilitySchema);
export const ParkingModel = mongoose.models.Parking || mongoose.model('Parking', ParkingSchema);
export const PrasadamModel = mongoose.models.Prasadam || mongoose.model('Prasadam', PrasadamSchema);
export const DonationModel = mongoose.models.Donation || mongoose.model('Donation', DonationSchema);
export const HospitalModel = mongoose.models.Hospital || mongoose.model('Hospital', HospitalSchema);
export const EmergencyContactModel = mongoose.models.EmergencyContact || mongoose.model('EmergencyContact', EmergencyContactSchema);
export const GuidelineModel = mongoose.models.Guideline || mongoose.model('Guideline', GuidelineSchema);
export const AnnouncementModel = mongoose.models.Announcement || mongoose.model('Announcement', AnnouncementSchema);
export const MessageModel = mongoose.models.Message || mongoose.model('Message', MessageSchema);
export const FavoriteModel = mongoose.models.Favorite || mongoose.model('Favorite', FavoriteSchema);
export const BookingModel = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
export const CalendarEventModel = mongoose.models.CalendarEvent || mongoose.model('CalendarEvent', CalendarEventSchema);
export const VisitPlanModel = mongoose.models.VisitPlan || mongoose.model('VisitPlan', VisitPlanSchema);
export const FeedbackModel = mongoose.models.Feedback || mongoose.model('Feedback', FeedbackSchema);
