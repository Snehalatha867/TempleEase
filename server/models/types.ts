export interface IUser {
  _id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: 'USER' | 'ADMIN';
  favorites?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ITemple {
  _id: string;
  slug: string;
  name: string;
  subtitle: string;
  deity: string;
  state: string;
  district: string;
  city: string;
  address: string;
  pinCode?: string;
  latitude: number;
  longitude: number;
  description: string;
  history: string;
  significance: string;
  architecture: string;
  traditions: string;
  festivals: string;
  morningTimings: string;
  eveningTimings: string;
  darshanTimings: string;
  specialDayTimings?: string;
  phone: string;
  email: string;
  website: string;
  officialWebsite: string;
  sourceUrl: string;
  verificationStatus: 'Verified from Official Portal' | 'Information not yet verified';
  dressCodeMen: string;
  dressCodeWomen: string;
  rules: string[];
  photographyRule: string;
  footwearRule: string;
  queueInstructions: string;
  bannerImage: string;
  sanctumImage: string;
  popular: boolean;
  donationInfo?: {
    counterLocation: string;
    officialUrl: string;
    instructions: string;
    trustName: string;
  };
  prasadamSummary?: string;
  updatedAt: string;
}

export interface IPooja {
  _id: string;
  templeId: string;
  name: string;
  category: 'Daily Pooja' | 'Special Pooja' | 'Abhishekam' | 'Archana' | 'Special Seva' | 'Festival Seva';
  description: string;
  dateOrFrequency: string;
  time: string;
  duration: string;
  price: number;
  availability: 'Available' | 'Limited Slots' | 'Booked' | 'Walk-in Permitted';
  instructions: string;
  significance: string;
  prasadamDetails: string;
  verificationStatus?: 'Verified' | 'Pending Verification';
  active: boolean;
}

export interface IScheduleItem {
  _id: string;
  templeId: string;
  time: string;
  activity: string;
  location: string;
  category: string;
  status: 'Completed' | 'In Progress' | 'Upcoming' | 'Daily Routine';
  active: boolean;
}

export interface IFacility {
  _id: string;
  templeId: string;
  name: string;
  category: string;
  description: string;
  location: string;
  timing: string;
  status: 'Operational' | 'Maintenance' | 'Available 24x7';
  contact: string;
  icon: string;
}

export interface IParking {
  _id: string;
  templeId: string;
  name: string;
  location: string;
  capacity: string;
  timing: string;
  distance: string;
  walkingTime: string;
  vehicleTypes: string;
  fee: string;
  description: string;
  availability?: string;
  active: boolean;
}

export interface IPrasadamItem {
  _id: string;
  templeId: string;
  name: string;
  description: string;
  counterLocation: string;
  distributionTiming: string;
  price: string;
  availability: 'Available' | 'Morning Only' | 'Afternoon & Evening' | 'Free Annadanam';
  isSpecialOffering?: boolean;
}

export interface IDonationItem {
  _id: string;
  templeId: string;
  trustName: string;
  donationCounterLocation: string;
  officialDonationUrl: string;
  instructions: string;
  taxExemptionInfo: string;
}

export interface IHospital {
  _id: string;
  templeId: string;
  name: string;
  address: string;
  distance: string;
  phone: string;
  emergencyAvailable: boolean;
  latitude: number;
  longitude: number;
  facilities: string[];
  ambulanceNumber: string;
}

export interface IEmergencyContact {
  _id: string;
  templeId: string;
  name: string;
  category: 'Police' | 'Medical' | 'Fire' | 'Temple Security' | 'Women Helpline' | 'Tourist Desk';
  phone: string;
  altPhone?: string;
  description: string;
  availableHours: string;
  active: boolean;
}

export interface IGuideline {
  _id: string;
  templeId: string; // 'all' or specific templeId
  title: string;
  category: 'Dress Code' | 'Temple Rules' | 'Photography' | 'Footwear' | 'Queue Discipline' | 'Cleanliness' | 'Safety' | 'Special Assistance';
  content: string[];
  importance: 'High' | 'Mandatory' | 'Advisory';
  active: boolean;
}

export interface IAnnouncement {
  _id: string;
  templeId: string; // 'all' or specific templeId
  templeName?: string;
  title: string;
  description: string;
  priority: 'Urgent' | 'Important' | 'Notice' | 'General';
  publishDate: string;
  expiryDate?: string;
  active: boolean;
}

export interface IFavorite {
  _id: string;
  userId: string;
  itemType: 'temple' | 'pooja' | 'facility' | 'schedule';
  itemId: string;
  title: string;
  details?: string;
  createdAt: string;
}

export interface IContactMessage {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'New' | 'Read' | 'Resolved';
  createdAt: string;
}

export interface IBooking {
  _id: string;
  bookingId: string;
  userId?: string;
  templeId: string;
  templeName: string;
  poojaId: string;
  poojaName: string;
  date: string;
  slot: string;
  devoteeName: string;
  gotram?: string;
  nakshatram?: string;
  personCount: number;
  phone: string;
  email: string;
  sankalpam?: string;
  amount: number;
  paymentMode: 'Demo Online' | 'Prasadam Counter Token' | 'Free Seva';
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  qrDataUrl?: string;
  createdAt: string;
}

export interface ICalendarEvent {
  _id: string;
  templeId: string;
  templeName: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  category: 'Festival' | 'Pooja' | 'Special Seva' | 'Timing Change' | 'Announcement';
  description: string;
  location?: string;
  priority?: 'High' | 'Normal' | 'Special';
}

export interface IVisitPlan {
  _id: string;
  userId?: string;
  templeId: string;
  templeName: string;
  visitDate: string;
  visitorCount: number;
  arrivalTime: string;
  hasElderly: boolean;
  hasChildren: boolean;
  transportMode: string;
  wheelchairNeeded?: boolean;
  notes?: string;
  itinerary: Array<{
    time: string;
    title: string;
    description: string;
    icon?: string;
    category?: string;
  }>;
  summary: {
    recommendedArrival: string;
    estimatedDuration: string;
    parkingZone: string;
    prasadamCounter: string;
    emergencyDesk: string;
    dressCodeSummary: string;
  };
  createdAt: string;
}

export interface IFeedback {
  _id: string;
  userId?: string;
  userName: string;
  userEmail?: string;
  templeId: string;
  templeName: string;
  overallRating: number; // 1 to 5
  useful: boolean;
  navigationRating: number; // 1 to 5
  facilitiesRating: number; // 1 to 5
  experienceText: string;
  suggestions?: string;
  createdAt: string;
}
