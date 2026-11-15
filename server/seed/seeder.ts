import {
  UserModel,
  TempleModel,
  PoojaModel,
  ScheduleModel,
  FacilityModel,
  ParkingModel,
  PrasadamModel,
  DonationModel,
  HospitalModel,
  EmergencyContactModel,
  GuidelineModel,
  AnnouncementModel,
  MessageModel,
  FavoriteModel,
  BookingModel,
  CalendarEventModel,
  VisitPlanModel,
  FeedbackModel
} from '../models/mongooseModels.js';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import {
  initialUsers,
  initialTemples,
  initialPoojas,
  initialSchedule,
  initialFacilities,
  initialParking,
  initialPrasadam,
  initialDonations,
  initialHospitals,
  initialEmergencyContacts,
  initialGuidelines,
  initialAnnouncements,
  initialBookings,
  initialCalendarEvents,
  initialVisitPlans,
  initialFeedback
} from './seedData.js';
import { IFavorite, IContactMessage } from '../models/types.js';

export const initialFavorites: IFavorite[] = [
  {
    _id: 'fav_01',
    userId: 'user_devotee_01',
    itemType: 'temple',
    itemId: 'temple_tirumala_01',
    title: 'Sri Venkateswara Temple – Tirumala',
    details: 'Tirupati, Andhra Pradesh',
    createdAt: new Date().toISOString()
  },
  {
    _id: 'fav_02',
    userId: 'user_devotee_01',
    itemType: 'temple',
    itemId: 'temple_somnath_05',
    title: 'Somnath Temple',
    details: 'Prabhas Patan, Gujarat',
    createdAt: new Date().toISOString()
  }
];

export const initialMessages: IContactMessage[] = [
  {
    _id: 'msg_01',
    name: 'Ramesh Verma',
    email: 'ramesh.v@example.com',
    phone: '+91 94401 23456',
    subject: 'Wheelchair assistance for elderly mother at Tirumala',
    message: 'Namaste, we will be arriving this Saturday morning around 7 AM. Could you confirm if wheelchair assistance will be available at Gate 3?',
    status: 'Read',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    _id: 'msg_02',
    name: 'Lakshmi Priya',
    email: 'lakshmi.p@example.com',
    phone: '+91 98492 56789',
    subject: 'Sparsha Darshan timings at Srisailam query',
    message: 'Are Sparsha Darshan tickets available online or counter booking on Mondays in Kartika Masam?',
    status: 'New',
    createdAt: new Date(Date.now() - 3600000).toISOString()
  }
];

async function seedIfEmpty(model: any, data: any[], label: string): Promise<number> {
  if (!data.length) return 0;
  const count = await model.countDocuments();
  if (count === 0) {
    await model.insertMany(data, { ordered: false });
    console.log(`[Seeder] Seeded ${data.length} ${label}`);
    return data.length;
  }
  return 0;
}

export async function seedDatabase(): Promise<void> {
  try {
    let totalInserted = 0;
    if (process.env.NODE_ENV === 'production') {
      const adminExists = await UserModel.exists({ role: 'ADMIN' });
      if (!adminExists) {
        const { INITIAL_ADMIN_NAME, INITIAL_ADMIN_EMAIL, INITIAL_ADMIN_PHONE, INITIAL_ADMIN_PASSWORD } = process.env;
        const adminEmail = INITIAL_ADMIN_EMAIL?.trim().toLowerCase();
        if (!INITIAL_ADMIN_NAME?.trim() || !INITIAL_ADMIN_EMAIL?.trim() ||
            !INITIAL_ADMIN_PHONE?.trim() || !INITIAL_ADMIN_PASSWORD ||
            INITIAL_ADMIN_PASSWORD.length < 12 ||
            !adminEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminEmail)) {
          throw new Error(
            'No production admin exists. Set INITIAL_ADMIN_NAME, INITIAL_ADMIN_EMAIL, ' +
            'INITIAL_ADMIN_PHONE, and a valid INITIAL_ADMIN_EMAIL; INITIAL_ADMIN_PASSWORD must be at least 12 characters.'
          );
        }

        await UserModel.create({
          _id: `user_admin_${randomUUID()}`,
          name: INITIAL_ADMIN_NAME.trim(),
          email: adminEmail,
          phone: INITIAL_ADMIN_PHONE.trim(),
          password: await bcrypt.hash(INITIAL_ADMIN_PASSWORD, 12),
          role: 'ADMIN',
          favorites: []
        });
        totalInserted += 1;
        console.log('[Seeder] Created the initial production admin account.');
      }
    } else {
      totalInserted += await seedIfEmpty(UserModel, initialUsers, 'users');
    }
    totalInserted += await seedIfEmpty(TempleModel, initialTemples, 'temples');
    totalInserted += await seedIfEmpty(PoojaModel, initialPoojas, 'poojas');
    totalInserted += await seedIfEmpty(ScheduleModel, initialSchedule, 'schedule items');
    totalInserted += await seedIfEmpty(FacilityModel, initialFacilities, 'facilities');
    totalInserted += await seedIfEmpty(ParkingModel, initialParking, 'parking zones');
    totalInserted += await seedIfEmpty(PrasadamModel, initialPrasadam, 'prasadam items');
    totalInserted += await seedIfEmpty(DonationModel, initialDonations, 'donation records');
    totalInserted += await seedIfEmpty(HospitalModel, initialHospitals, 'hospitals');
    totalInserted += await seedIfEmpty(EmergencyContactModel, initialEmergencyContacts, 'emergency contacts');
    totalInserted += await seedIfEmpty(GuidelineModel, initialGuidelines, 'guidelines');
    totalInserted += await seedIfEmpty(AnnouncementModel, initialAnnouncements, 'announcements');
    totalInserted += await seedIfEmpty(FavoriteModel, initialFavorites, 'favorites');
    totalInserted += await seedIfEmpty(MessageModel, initialMessages, 'messages');
    totalInserted += await seedIfEmpty(BookingModel, initialBookings, 'bookings');
    totalInserted += await seedIfEmpty(CalendarEventModel, initialCalendarEvents, 'calendar events');
    totalInserted += await seedIfEmpty(VisitPlanModel, initialVisitPlans, 'visit plans');
    totalInserted += await seedIfEmpty(FeedbackModel, initialFeedback, 'feedback entries');

    if (totalInserted > 0) {
      console.log(`[Seeder] Database initialized cleanly (${totalInserted} total records inserted).`);
    } else {
      console.log('[Seeder] MongoDB collections already contain data. Skipping initial seed.');
    }
  } catch (err) {
    console.error('[Seeder] Error while seeding MongoDB:', err);
    if (process.env.NODE_ENV === 'production') {
      throw err;
    }
  }
}
