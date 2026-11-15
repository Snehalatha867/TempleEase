import {
  IUser,
  ITemple,
  IPooja,
  IScheduleItem,
  IFacility,
  IParking,
  IPrasadamItem,
  IDonationItem,
  IHospital,
  IEmergencyContact,
  IGuideline,
  IAnnouncement,
  IFavorite,
  IContactMessage,
  IBooking,
  ICalendarEvent,
  IVisitPlan,
  IFeedback
} from '../models/types.js';
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
} from '../seed/seedData.js';
import { initialFavorites, initialMessages } from '../seed/seeder.js';
import { getDBStatus } from '../config/db.js';
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

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function genId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

class DataStore {
  private users: IUser[] = [...initialUsers];
  private temples: ITemple[] = [...initialTemples];
  private poojas: IPooja[] = [...initialPoojas];
  private schedule: IScheduleItem[] = [...initialSchedule];
  private facilities: IFacility[] = [...initialFacilities];
  private parking: IParking[] = [...initialParking];
  private prasadam: IPrasadamItem[] = [...initialPrasadam];
  private donations: IDonationItem[] = [...initialDonations];
  private hospitals: IHospital[] = [...initialHospitals];
  private emergencyContacts: IEmergencyContact[] = [...initialEmergencyContacts];
  private guidelines: IGuideline[] = [...initialGuidelines];
  private announcements: IAnnouncement[] = [...initialAnnouncements];
  private bookings: IBooking[] = [...initialBookings];
  private calendarEvents: ICalendarEvent[] = [...initialCalendarEvents];
  private visitPlans: IVisitPlan[] = [...initialVisitPlans];
  private feedback: IFeedback[] = [...initialFeedback];
  private favorites: IFavorite[] = [...initialFavorites];
  private messages: IContactMessage[] = [...initialMessages];

  private useMongo(): boolean {
    return getDBStatus().connected;
  }

  private normalizeTemple(t: ITemple): ITemple {
    let banner = t.bannerImage || '/images/default_temple.jpg';
    let sanctum = t.sanctumImage || '/images/default_temple.jpg';
    if (banner.startsWith('/src/assets/images/')) {
      banner = banner.replace('/src/assets/images/', '/images/');
    }
    if (sanctum.startsWith('/src/assets/images/')) {
      sanctum = sanctum.replace('/src/assets/images/', '/images/');
    }
    return {
      ...t,
      bannerImage: banner,
      sanctumImage: sanctum
    };
  }

  // ================= USERS =================
  async findUserByEmail(email: string): Promise<IUser | null> {
    if (this.useMongo()) {
      const doc = await UserModel.findOne({
        email: { $regex: new RegExp(`^${escapeRegex(email.trim())}$`, 'i') }
      }).lean<IUser>();
      return doc ? { ...doc } : null;
    }
    const user = this.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    return user ? { ...user } : null;
  }

  async findUserById(id: string): Promise<IUser | null> {
    if (this.useMongo()) {
      const doc = await UserModel.findById(id).lean<IUser>();
      return doc ? { ...doc } : null;
    }
    const user = this.users.find(u => u._id === id);
    return user ? { ...user } : null;
  }

  async createUser(data: Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>): Promise<IUser> {
    const newUser: IUser = {
      _id: genId('user'),
      ...data,
      favorites: data.favorites || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    if (this.useMongo()) {
      const created = await UserModel.create(newUser);
      return created.toObject() as IUser;
    }
    this.users.push(newUser);
    return { ...newUser };
  }

  async getAllUsers(): Promise<IUser[]> {
    if (this.useMongo()) {
      const docs = await UserModel.find({}).lean<IUser[]>();
      return docs.map(u => ({ ...u, password: '[PROTECTED]' }));
    }
    return this.users.map(u => ({ ...u, password: '[PROTECTED]' }));
  }

  async updateUser(id: string, updates: Partial<IUser>): Promise<IUser | null> {
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined)
    );
    const payload = { ...cleanUpdates, updatedAt: new Date().toISOString() };

    if (this.useMongo()) {
      const updated = await UserModel.findByIdAndUpdate(id, { $set: payload }, { new: true }).lean<IUser>();
      return updated ? { ...updated } : null;
    }

    const idx = this.users.findIndex(u => u._id === id);
    if (idx === -1) return null;
    this.users[idx] = { ...this.users[idx], ...payload };
    return { ...this.users[idx] };
  }

  // ================= TEMPLES =================
  async getTemples(params?: {
    q?: string;
    state?: string;
    deity?: string;
    popular?: boolean;
    limit?: number;
  }): Promise<ITemple[]> {
    if (this.useMongo()) {
      const filter: Record<string, any> = {};
      if (params?.popular !== undefined) {
        filter.popular = params.popular;
      }
      if (params?.state && params.state !== 'All' && params.state.trim() !== '') {
        filter.state = { $regex: new RegExp(`^${escapeRegex(params.state.trim())}$`, 'i') };
      }
      if (params?.deity && params.deity !== 'All' && params.deity.trim() !== '') {
        filter.deity = { $regex: new RegExp(`^${escapeRegex(params.deity.trim())}$`, 'i') };
      }
      if (params?.q && params.q.trim() !== '') {
        const rx = new RegExp(escapeRegex(params.q.trim()), 'i');
        filter.$or = [
          { name: rx },
          { city: rx },
          { district: rx },
          { state: rx },
          { deity: rx },
          { subtitle: rx }
        ];
      }
      let query = TempleModel.find(filter);
      if (params?.limit && params.limit > 0) {
        query = query.limit(params.limit);
      }
      const docs = await query.lean<ITemple[]>();
      return docs.map(t => this.normalizeTemple(t));
    }

    let list = [...this.temples];

    if (params?.popular !== undefined) {
      list = list.filter(t => t.popular === params.popular);
    }

    if (params?.state && params.state !== 'All' && params.state.trim() !== '') {
      list = list.filter(t => t.state.toLowerCase() === params.state?.toLowerCase());
    }

    if (params?.deity && params.deity !== 'All' && params.deity.trim() !== '') {
      list = list.filter(t => t.deity.toLowerCase() === params.deity?.toLowerCase());
    }

    if (params?.q && params.q.trim() !== '') {
      const q = params.q.toLowerCase().trim();
      list = list.filter(t =>
        t.name.toLowerCase().includes(q) ||
        t.city.toLowerCase().includes(q) ||
        t.district.toLowerCase().includes(q) ||
        t.state.toLowerCase().includes(q) ||
        t.deity.toLowerCase().includes(q) ||
        t.subtitle.toLowerCase().includes(q)
      );
    }

    if (params?.limit && params.limit > 0) {
      list = list.slice(0, params.limit);
    }

    return list.map(t => this.normalizeTemple(t));
  }

  async getTempleByIdOrSlug(idOrSlug: string): Promise<ITemple | null> {
    if (this.useMongo()) {
      const doc = await TempleModel.findOne({
        $or: [{ _id: idOrSlug }, { slug: idOrSlug }]
      }).lean<ITemple>();
      return doc ? this.normalizeTemple(doc) : null;
    }
    const t = this.temples.find(x => x._id === idOrSlug || x.slug === idOrSlug);
    return t ? this.normalizeTemple(t) : null;
  }

  async createTemple(data: Omit<ITemple, '_id' | 'updatedAt'>): Promise<ITemple> {
    const slug = data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newTemple: ITemple = {
      _id: genId('temple'),
      ...data,
      slug,
      updatedAt: new Date().toISOString()
    };
    if (this.useMongo()) {
      const created = await TempleModel.create(newTemple);
      return this.normalizeTemple(created.toObject() as ITemple);
    }
    this.temples.unshift(newTemple);
    return this.normalizeTemple(newTemple);
  }

  async updateTemple(id: string, updates: Partial<ITemple>): Promise<ITemple | null> {
    const payload = { ...updates, updatedAt: new Date().toISOString() };
    if (this.useMongo()) {
      const updated = await TempleModel.findByIdAndUpdate(id, { $set: payload }, { new: true }).lean<ITemple>();
      return updated ? this.normalizeTemple(updated) : null;
    }
    const idx = this.temples.findIndex(t => t._id === id);
    if (idx === -1) return null;
    this.temples[idx] = { ...this.temples[idx], ...payload };
    return this.normalizeTemple(this.temples[idx]);
  }

  async deleteTemple(id: string): Promise<boolean> {
    if (this.useMongo()) {
      const deleted = await TempleModel.findByIdAndDelete(id);
      if (!deleted) return false;
      await Promise.all([
        PoojaModel.deleteMany({ templeId: id }),
        ScheduleModel.deleteMany({ templeId: id }),
        FacilityModel.deleteMany({ templeId: id }),
        ParkingModel.deleteMany({ templeId: id }),
        PrasadamModel.deleteMany({ templeId: id }),
        DonationModel.deleteMany({ templeId: id }),
        HospitalModel.deleteMany({ templeId: id }),
        EmergencyContactModel.deleteMany({ templeId: id })
      ]);
      return true;
    }

    const idx = this.temples.findIndex(t => t._id === id);
    if (idx === -1) return false;
    this.temples.splice(idx, 1);
    this.poojas = this.poojas.filter(p => p.templeId !== id);
    this.schedule = this.schedule.filter(s => s.templeId !== id);
    this.facilities = this.facilities.filter(f => f.templeId !== id);
    this.parking = this.parking.filter(p => p.templeId !== id);
    this.prasadam = this.prasadam.filter(pr => pr.templeId !== id);
    this.donations = this.donations.filter(d => d.templeId !== id);
    this.hospitals = this.hospitals.filter(h => h.templeId !== id);
    this.emergencyContacts = this.emergencyContacts.filter(e => e.templeId !== id);
    return true;
  }

  // ================= POOJAS =================
  async getPoojas(templeId?: string): Promise<IPooja[]> {
    if (this.useMongo()) {
      const docs = await PoojaModel.find(templeId ? { templeId } : {}).lean<IPooja[]>();
      return docs.map(p => ({ ...p }));
    }
    if (templeId) {
      return this.poojas.filter(p => p.templeId === templeId).map(p => ({ ...p }));
    }
    return this.poojas.map(p => ({ ...p }));
  }

  async getPoojaById(id: string): Promise<IPooja | null> {
    if (this.useMongo()) {
      const doc = await PoojaModel.findById(id).lean<IPooja>();
      return doc ? { ...doc } : null;
    }
    const item = this.poojas.find(p => p._id === id);
    return item ? { ...item } : null;
  }

  async createPooja(data: Omit<IPooja, '_id'>): Promise<IPooja> {
    const newPooja: IPooja = { _id: genId('pooja'), ...data };
    if (this.useMongo()) {
      const created = await PoojaModel.create(newPooja);
      return created.toObject() as IPooja;
    }
    this.poojas.push(newPooja);
    return { ...newPooja };
  }

  async updatePooja(id: string, updates: Partial<IPooja>): Promise<IPooja | null> {
    if (this.useMongo()) {
      const updated = await PoojaModel.findByIdAndUpdate(id, { $set: updates }, { new: true }).lean<IPooja>();
      return updated ? { ...updated } : null;
    }
    const idx = this.poojas.findIndex(p => p._id === id);
    if (idx === -1) return null;
    this.poojas[idx] = { ...this.poojas[idx], ...updates };
    return { ...this.poojas[idx] };
  }

  async deletePooja(id: string): Promise<boolean> {
    if (this.useMongo()) {
      const deleted = await PoojaModel.findByIdAndDelete(id);
      return Boolean(deleted);
    }
    const idx = this.poojas.findIndex(p => p._id === id);
    if (idx === -1) return false;
    this.poojas.splice(idx, 1);
    return true;
  }

  // ================= SCHEDULE =================
  async getSchedule(templeId?: string): Promise<IScheduleItem[]> {
    if (this.useMongo()) {
      const filter = templeId ? { templeId, active: true } : {};
      const docs = await ScheduleModel.find(filter).lean<IScheduleItem[]>();
      return docs.map(s => ({ ...s }));
    }
    if (templeId) {
      return this.schedule.filter(s => s.templeId === templeId && s.active).map(s => ({ ...s }));
    }
    return this.schedule.map(s => ({ ...s }));
  }

  async createScheduleItem(data: Omit<IScheduleItem, '_id'>): Promise<IScheduleItem> {
    const newItem: IScheduleItem = { _id: genId('sched'), ...data };
    if (this.useMongo()) {
      const created = await ScheduleModel.create(newItem);
      return created.toObject() as IScheduleItem;
    }
    this.schedule.push(newItem);
    return { ...newItem };
  }

  async updateScheduleItem(id: string, updates: Partial<IScheduleItem>): Promise<IScheduleItem | null> {
    if (this.useMongo()) {
      const updated = await ScheduleModel.findByIdAndUpdate(id, { $set: updates }, { new: true }).lean<IScheduleItem>();
      return updated ? { ...updated } : null;
    }
    const idx = this.schedule.findIndex(s => s._id === id);
    if (idx === -1) return null;
    this.schedule[idx] = { ...this.schedule[idx], ...updates };
    return { ...this.schedule[idx] };
  }

  async deleteScheduleItem(id: string): Promise<boolean> {
    if (this.useMongo()) {
      const deleted = await ScheduleModel.findByIdAndDelete(id);
      return Boolean(deleted);
    }
    const idx = this.schedule.findIndex(s => s._id === id);
    if (idx === -1) return false;
    this.schedule.splice(idx, 1);
    return true;
  }

  // ================= FACILITIES =================
  async getFacilities(templeId?: string): Promise<IFacility[]> {
    if (this.useMongo()) {
      const docs = await FacilityModel.find(templeId ? { templeId } : {}).lean<IFacility[]>();
      return docs.map(f => ({ ...f }));
    }
    if (templeId) {
      return this.facilities.filter(f => f.templeId === templeId).map(f => ({ ...f }));
    }
    return this.facilities.map(f => ({ ...f }));
  }

  async createFacility(data: Omit<IFacility, '_id'>): Promise<IFacility> {
    const item: IFacility = { _id: genId('fac'), ...data };
    if (this.useMongo()) {
      const created = await FacilityModel.create(item);
      return created.toObject() as IFacility;
    }
    this.facilities.push(item);
    return { ...item };
  }

  async updateFacility(id: string, updates: Partial<IFacility>): Promise<IFacility | null> {
    if (this.useMongo()) {
      const updated = await FacilityModel.findByIdAndUpdate(id, { $set: updates }, { new: true }).lean<IFacility>();
      return updated ? { ...updated } : null;
    }
    const idx = this.facilities.findIndex(f => f._id === id);
    if (idx === -1) return null;
    this.facilities[idx] = { ...this.facilities[idx], ...updates };
    return { ...this.facilities[idx] };
  }

  async deleteFacility(id: string): Promise<boolean> {
    if (this.useMongo()) {
      const deleted = await FacilityModel.findByIdAndDelete(id);
      return Boolean(deleted);
    }
    const idx = this.facilities.findIndex(f => f._id === id);
    if (idx === -1) return false;
    this.facilities.splice(idx, 1);
    return true;
  }

  // ================= PARKING =================
  async getParking(templeId?: string): Promise<IParking[]> {
    if (this.useMongo()) {
      const filter = templeId ? { templeId, active: true } : {};
      const docs = await ParkingModel.find(filter).lean<IParking[]>();
      return docs.map(p => ({ ...p }));
    }
    if (templeId) {
      return this.parking.filter(p => p.templeId === templeId && p.active).map(p => ({ ...p }));
    }
    return this.parking.map(p => ({ ...p }));
  }

  async createParking(data: Omit<IParking, '_id'>): Promise<IParking> {
    const item: IParking = { _id: genId('park'), ...data };
    if (this.useMongo()) {
      const created = await ParkingModel.create(item);
      return created.toObject() as IParking;
    }
    this.parking.push(item);
    return { ...item };
  }

  async updateParking(id: string, updates: Partial<IParking>): Promise<IParking | null> {
    if (this.useMongo()) {
      const updated = await ParkingModel.findByIdAndUpdate(id, { $set: updates }, { new: true }).lean<IParking>();
      return updated ? { ...updated } : null;
    }
    const idx = this.parking.findIndex(p => p._id === id);
    if (idx === -1) return null;
    this.parking[idx] = { ...this.parking[idx], ...updates };
    return { ...this.parking[idx] };
  }

  async deleteParking(id: string): Promise<boolean> {
    if (this.useMongo()) {
      const deleted = await ParkingModel.findByIdAndDelete(id);
      return Boolean(deleted);
    }
    const idx = this.parking.findIndex(p => p._id === id);
    if (idx === -1) return false;
    this.parking.splice(idx, 1);
    return true;
  }

  // ================= PRASADAM =================
  async getPrasadam(templeId?: string): Promise<IPrasadamItem[]> {
    if (this.useMongo()) {
      const docs = await PrasadamModel.find(templeId ? { templeId } : {}).lean<IPrasadamItem[]>();
      return docs.map(p => ({ ...p }));
    }
    if (templeId) {
      return this.prasadam.filter(p => p.templeId === templeId).map(p => ({ ...p }));
    }
    return this.prasadam.map(p => ({ ...p }));
  }

  async createPrasadam(data: Omit<IPrasadamItem, '_id'>): Promise<IPrasadamItem> {
    const item: IPrasadamItem = { _id: genId('prasad'), ...data };
    if (this.useMongo()) {
      const created = await PrasadamModel.create(item);
      return created.toObject() as IPrasadamItem;
    }
    this.prasadam.push(item);
    return { ...item };
  }

  async updatePrasadam(id: string, updates: Partial<IPrasadamItem>): Promise<IPrasadamItem | null> {
    if (this.useMongo()) {
      const updated = await PrasadamModel.findByIdAndUpdate(id, { $set: updates }, { new: true }).lean<IPrasadamItem>();
      return updated ? { ...updated } : null;
    }
    const idx = this.prasadam.findIndex(p => p._id === id);
    if (idx === -1) return null;
    this.prasadam[idx] = { ...this.prasadam[idx], ...updates };
    return { ...this.prasadam[idx] };
  }

  async deletePrasadam(id: string): Promise<boolean> {
    if (this.useMongo()) {
      const deleted = await PrasadamModel.findByIdAndDelete(id);
      return Boolean(deleted);
    }
    const idx = this.prasadam.findIndex(p => p._id === id);
    if (idx === -1) return false;
    this.prasadam.splice(idx, 1);
    return true;
  }

  // ================= DONATIONS =================
  async getDonations(templeId?: string): Promise<IDonationItem[]> {
    if (this.useMongo()) {
      const docs = await DonationModel.find(templeId ? { templeId } : {}).lean<IDonationItem[]>();
      return docs.map(d => ({ ...d }));
    }
    if (templeId) {
      return this.donations.filter(d => d.templeId === templeId).map(d => ({ ...d }));
    }
    return this.donations.map(d => ({ ...d }));
  }

  async createDonation(data: Omit<IDonationItem, '_id'>): Promise<IDonationItem> {
    const item: IDonationItem = { _id: genId('don'), ...data };
    if (this.useMongo()) {
      const created = await DonationModel.create(item);
      return created.toObject() as IDonationItem;
    }
    this.donations.push(item);
    return { ...item };
  }

  async updateDonation(id: string, updates: Partial<IDonationItem>): Promise<IDonationItem | null> {
    if (this.useMongo()) {
      const updated = await DonationModel.findByIdAndUpdate(id, { $set: updates }, { new: true }).lean<IDonationItem>();
      return updated ? { ...updated } : null;
    }
    const idx = this.donations.findIndex(d => d._id === id);
    if (idx === -1) return null;
    this.donations[idx] = { ...this.donations[idx], ...updates };
    return { ...this.donations[idx] };
  }

  async deleteDonation(id: string): Promise<boolean> {
    if (this.useMongo()) {
      const deleted = await DonationModel.findByIdAndDelete(id);
      return Boolean(deleted);
    }
    const idx = this.donations.findIndex(d => d._id === id);
    if (idx === -1) return false;
    this.donations.splice(idx, 1);
    return true;
  }

  // ================= HOSPITALS =================
  async getHospitals(templeId?: string): Promise<IHospital[]> {
    if (this.useMongo()) {
      const docs = await HospitalModel.find(templeId ? { templeId } : {}).lean<IHospital[]>();
      return docs.map(h => ({ ...h }));
    }
    if (templeId) {
      return this.hospitals.filter(h => h.templeId === templeId).map(h => ({ ...h }));
    }
    return this.hospitals.map(h => ({ ...h }));
  }

  async createHospital(data: Omit<IHospital, '_id'>): Promise<IHospital> {
    const item: IHospital = { _id: genId('hosp'), ...data };
    if (this.useMongo()) {
      const created = await HospitalModel.create(item);
      return created.toObject() as IHospital;
    }
    this.hospitals.push(item);
    return { ...item };
  }

  async updateHospital(id: string, updates: Partial<IHospital>): Promise<IHospital | null> {
    if (this.useMongo()) {
      const updated = await HospitalModel.findByIdAndUpdate(id, { $set: updates }, { new: true }).lean<IHospital>();
      return updated ? { ...updated } : null;
    }
    const idx = this.hospitals.findIndex(h => h._id === id);
    if (idx === -1) return null;
    this.hospitals[idx] = { ...this.hospitals[idx], ...updates };
    return { ...this.hospitals[idx] };
  }

  async deleteHospital(id: string): Promise<boolean> {
    if (this.useMongo()) {
      const deleted = await HospitalModel.findByIdAndDelete(id);
      return Boolean(deleted);
    }
    const idx = this.hospitals.findIndex(h => h._id === id);
    if (idx === -1) return false;
    this.hospitals.splice(idx, 1);
    return true;
  }

  // ================= EMERGENCY CONTACTS =================
  async getEmergencyContacts(templeId?: string): Promise<IEmergencyContact[]> {
    if (this.useMongo()) {
      const filter = templeId
        ? { templeId: { $in: [templeId, 'all'] }, active: true }
        : {};
      const docs = await EmergencyContactModel.find(filter).lean<IEmergencyContact[]>();
      return docs.map(e => ({ ...e }));
    }
    if (templeId) {
      return this.emergencyContacts
        .filter(e => (e.templeId === templeId || e.templeId === 'all') && e.active)
        .map(e => ({ ...e }));
    }
    return this.emergencyContacts.map(e => ({ ...e }));
  }

  async createEmergencyContact(data: Omit<IEmergencyContact, '_id'>): Promise<IEmergencyContact> {
    const item: IEmergencyContact = { _id: genId('emg'), ...data };
    if (this.useMongo()) {
      const created = await EmergencyContactModel.create(item);
      return created.toObject() as IEmergencyContact;
    }
    this.emergencyContacts.push(item);
    return { ...item };
  }

  async updateEmergencyContact(id: string, updates: Partial<IEmergencyContact>): Promise<IEmergencyContact | null> {
    if (this.useMongo()) {
      const updated = await EmergencyContactModel.findByIdAndUpdate(id, { $set: updates }, { new: true }).lean<IEmergencyContact>();
      return updated ? { ...updated } : null;
    }
    const idx = this.emergencyContacts.findIndex(e => e._id === id);
    if (idx === -1) return null;
    this.emergencyContacts[idx] = { ...this.emergencyContacts[idx], ...updates };
    return { ...this.emergencyContacts[idx] };
  }

  async deleteEmergencyContact(id: string): Promise<boolean> {
    if (this.useMongo()) {
      const deleted = await EmergencyContactModel.findByIdAndDelete(id);
      return Boolean(deleted);
    }
    const idx = this.emergencyContacts.findIndex(e => e._id === id);
    if (idx === -1) return false;
    this.emergencyContacts.splice(idx, 1);
    return true;
  }

  // ================= GUIDELINES =================
  async getGuidelines(templeId?: string): Promise<IGuideline[]> {
    if (this.useMongo()) {
      const filter = templeId
        ? { templeId: { $in: [templeId, 'all'] }, active: true }
        : {};
      const docs = await GuidelineModel.find(filter).lean<IGuideline[]>();
      return docs.map(g => ({ ...g }));
    }
    if (templeId) {
      return this.guidelines.filter(g => (g.templeId === templeId || g.templeId === 'all') && g.active).map(g => ({ ...g }));
    }
    return this.guidelines.map(g => ({ ...g }));
  }

  async createGuideline(data: Omit<IGuideline, '_id'>): Promise<IGuideline> {
    const item: IGuideline = { _id: genId('guide'), ...data };
    if (this.useMongo()) {
      const created = await GuidelineModel.create(item);
      return created.toObject() as IGuideline;
    }
    this.guidelines.push(item);
    return { ...item };
  }

  async updateGuideline(id: string, updates: Partial<IGuideline>): Promise<IGuideline | null> {
    if (this.useMongo()) {
      const updated = await GuidelineModel.findByIdAndUpdate(id, { $set: updates }, { new: true }).lean<IGuideline>();
      return updated ? { ...updated } : null;
    }
    const idx = this.guidelines.findIndex(g => g._id === id);
    if (idx === -1) return null;
    this.guidelines[idx] = { ...this.guidelines[idx], ...updates };
    return { ...this.guidelines[idx] };
  }

  async deleteGuideline(id: string): Promise<boolean> {
    if (this.useMongo()) {
      const deleted = await GuidelineModel.findByIdAndDelete(id);
      return Boolean(deleted);
    }
    const idx = this.guidelines.findIndex(g => g._id === id);
    if (idx === -1) return false;
    this.guidelines.splice(idx, 1);
    return true;
  }

  // ================= ANNOUNCEMENTS =================
  async getAnnouncements(templeId?: string): Promise<IAnnouncement[]> {
    if (this.useMongo()) {
      const filter = templeId
        ? { templeId: { $in: [templeId, 'all'] }, active: true }
        : { active: true };
      const docs = await AnnouncementModel.find(filter).sort({ publishDate: -1 }).lean<IAnnouncement[]>();
      return docs.map(a => ({ ...a }));
    }
    if (templeId) {
      return this.announcements.filter(a => (a.templeId === templeId || a.templeId === 'all') && a.active).map(a => ({ ...a }));
    }
    return this.announcements.filter(a => a.active).map(a => ({ ...a }));
  }

  async createAnnouncement(data: Omit<IAnnouncement, '_id'>): Promise<IAnnouncement> {
    const item: IAnnouncement = { _id: genId('ann'), ...data };
    if (this.useMongo()) {
      const created = await AnnouncementModel.create(item);
      return created.toObject() as IAnnouncement;
    }
    this.announcements.unshift(item);
    return { ...item };
  }

  async updateAnnouncement(id: string, updates: Partial<IAnnouncement>): Promise<IAnnouncement | null> {
    if (this.useMongo()) {
      const updated = await AnnouncementModel.findByIdAndUpdate(id, { $set: updates }, { new: true }).lean<IAnnouncement>();
      return updated ? { ...updated } : null;
    }
    const idx = this.announcements.findIndex(a => a._id === id);
    if (idx === -1) return null;
    this.announcements[idx] = { ...this.announcements[idx], ...updates };
    return { ...this.announcements[idx] };
  }

  async deleteAnnouncement(id: string): Promise<boolean> {
    if (this.useMongo()) {
      const deleted = await AnnouncementModel.findByIdAndDelete(id);
      return Boolean(deleted);
    }
    const idx = this.announcements.findIndex(a => a._id === id);
    if (idx === -1) return false;
    this.announcements.splice(idx, 1);
    return true;
  }

  // ================= FAVORITES =================
  async getFavoritesByUser(userId: string): Promise<Array<IFavorite & { temple?: ITemple }>> {
    if (this.useMongo()) {
      const favs = await FavoriteModel.find({ userId }).lean<IFavorite[]>();
      const templeIds = favs.filter(f => f.itemType === 'temple').map(f => f.itemId);
      const temples = templeIds.length
        ? await TempleModel.find({ $or: [{ _id: { $in: templeIds } }, { slug: { $in: templeIds } }] }).lean<ITemple[]>()
        : [];
      return favs.map(f => {
        const temple = f.itemType === 'temple'
          ? temples.find(t => t._id === f.itemId || t.slug === f.itemId)
          : undefined;
        return {
          ...f,
          temple: temple ? this.normalizeTemple(temple) : undefined
        };
      });
    }

    return this.favorites
      .filter(f => f.userId === userId)
      .map(f => {
        const temple = f.itemType === 'temple'
          ? this.temples.find(t => t._id === f.itemId || t.slug === f.itemId)
          : undefined;
        return {
          ...f,
          temple: temple ? this.normalizeTemple(temple) : undefined
        };
      });
  }

  async addFavorite(
    userId: string,
    data: { itemType: 'temple' | 'pooja' | 'facility' | 'schedule'; itemId: string; title: string; details?: string }
  ): Promise<IFavorite> {
    if (this.useMongo()) {
      const existing = await FavoriteModel.findOne({ userId, itemId: data.itemId }).lean<IFavorite>();
      if (existing) return { ...existing };
      const newFav: IFavorite = {
        _id: genId('fav'),
        userId,
        ...data,
        createdAt: new Date().toISOString()
      };
      const created = await FavoriteModel.create(newFav);
      return created.toObject() as IFavorite;
    }

    const existing = this.favorites.find(f => f.userId === userId && f.itemId === data.itemId);
    if (existing) return { ...existing };
    const newFav: IFavorite = {
      _id: genId('fav'),
      userId,
      ...data,
      createdAt: new Date().toISOString()
    };
    this.favorites.push(newFav);
    return { ...newFav };
  }

  async removeFavorite(userId: string, itemId: string): Promise<boolean> {
    if (this.useMongo()) {
      const res = await FavoriteModel.deleteOne({ userId, itemId });
      return res.deletedCount > 0;
    }
    const idx = this.favorites.findIndex(f => f.userId === userId && f.itemId === itemId);
    if (idx === -1) return false;
    this.favorites.splice(idx, 1);
    return true;
  }

  // ================= CONTACT MESSAGES =================
  async getMessages(): Promise<IContactMessage[]> {
    if (this.useMongo()) {
      const docs = await MessageModel.find({}).sort({ createdAt: -1 }).lean<IContactMessage[]>();
      return docs.map(m => ({ ...m }));
    }
    return this.messages.map(m => ({ ...m }));
  }

  async createMessage(data: Omit<IContactMessage, '_id' | 'status' | 'createdAt'>): Promise<IContactMessage> {
    const newMsg: IContactMessage = {
      _id: genId('msg'),
      ...data,
      status: 'New',
      createdAt: new Date().toISOString()
    };
    if (this.useMongo()) {
      const created = await MessageModel.create(newMsg);
      return created.toObject() as IContactMessage;
    }
    this.messages.unshift(newMsg);
    return { ...newMsg };
  }

  async updateMessageStatus(id: string, status: 'New' | 'Read' | 'Resolved'): Promise<IContactMessage | null> {
    if (this.useMongo()) {
      const updated = await MessageModel.findByIdAndUpdate(id, { $set: { status } }, { new: true }).lean<IContactMessage>();
      return updated ? { ...updated } : null;
    }
    const idx = this.messages.findIndex(m => m._id === id);
    if (idx === -1) return null;
    this.messages[idx].status = status;
    return { ...this.messages[idx] };
  }

  async deleteMessage(id: string): Promise<boolean> {
    if (this.useMongo()) {
      const deleted = await MessageModel.findByIdAndDelete(id);
      return Boolean(deleted);
    }
    const idx = this.messages.findIndex(m => m._id === id);
    if (idx === -1) return false;
    this.messages.splice(idx, 1);
    return true;
  }

  // ================= POOJA / SEVA BOOKINGS =================
  async getBookings(userId?: string, templeId?: string): Promise<IBooking[]> {
    if (this.useMongo()) {
      const filter: Record<string, any> = {};
      if (userId) filter.userId = userId;
      if (templeId) filter.templeId = templeId;
      const docs = await BookingModel.find(filter).sort({ createdAt: -1 }).lean<IBooking[]>();
      return docs.map(b => ({ ...b }));
    }
    return this.bookings
      .filter(b => {
        if (userId && b.userId !== userId) return false;
        if (templeId && b.templeId !== templeId) return false;
        return true;
      })
      .map(b => ({ ...b }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getBookingById(idOrBookingId: string, ownerId?: string): Promise<IBooking | null> {
    if (this.useMongo()) {
      const filter: Record<string, any> = {
        $or: [{ _id: idOrBookingId }, { bookingId: idOrBookingId }]
      };
      if (ownerId) filter.userId = ownerId;
      const doc = await BookingModel.findOne(filter).lean<IBooking>();
      return doc ? { ...doc } : null;
    }
    const booking = this.bookings.find(b =>
      (b._id === idOrBookingId || b.bookingId === idOrBookingId) &&
      (!ownerId || b.userId === ownerId)
    );
    return booking ? { ...booking } : null;
  }

  async createBooking(data: Omit<IBooking, '_id' | 'createdAt'>): Promise<IBooking> {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingId = data.bookingId || `TE-BK-${new Date().getFullYear()}-${randomSuffix}`;
    const newBooking: IBooking = {
      _id: genId('bk'),
      ...data,
      bookingId,
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    };
    if (this.useMongo()) {
      const created = await BookingModel.create(newBooking);
      return created.toObject() as IBooking;
    }
    this.bookings.unshift(newBooking);
    return { ...newBooking };
  }

  async cancelBooking(idOrBookingId: string, ownerId?: string): Promise<IBooking | null> {
    if (this.useMongo()) {
      const filter: Record<string, any> = {
        $or: [{ _id: idOrBookingId }, { bookingId: idOrBookingId }]
      };
      if (ownerId) filter.userId = ownerId;
      const updated = await BookingModel.findOneAndUpdate(
        filter,
        { $set: { status: 'Cancelled' } },
        { new: true }
      ).lean<IBooking>();
      return updated ? { ...updated } : null;
    }
    const idx = this.bookings.findIndex(b =>
      (b._id === idOrBookingId || b.bookingId === idOrBookingId) &&
      (!ownerId || b.userId === ownerId)
    );
    if (idx === -1) return null;
    this.bookings[idx].status = 'Cancelled';
    return { ...this.bookings[idx] };
  }

  // ================= TEMPLE CALENDAR EVENTS =================
  async getCalendarEvents(params?: { templeId?: string; date?: string; month?: string }): Promise<ICalendarEvent[]> {
    if (this.useMongo()) {
      const filter: Record<string, any> = {};
      if (params?.templeId && params.templeId !== 'all') {
        filter.templeId = { $in: [params.templeId, 'all'] };
      }
      if (params?.date) {
        filter.date = params.date;
      } else if (params?.month) {
        filter.date = { $regex: new RegExp(`^${escapeRegex(params.month)}`) };
      }
      const docs = await CalendarEventModel.find(filter).sort({ date: 1 }).lean<ICalendarEvent[]>();
      return docs.map(ev => ({ ...ev }));
    }

    return this.calendarEvents.filter(ev => {
      if (params?.templeId && params.templeId !== 'all' && ev.templeId !== 'all' && ev.templeId !== params.templeId) {
        return false;
      }
      if (params?.date && ev.date !== params.date) {
        return false;
      }
      if (params?.month && !ev.date.startsWith(params.month)) {
        return false;
      }
      return true;
    }).sort((a, b) => a.date.localeCompare(b.date));
  }

  async createCalendarEvent(data: Omit<ICalendarEvent, '_id'>): Promise<ICalendarEvent> {
    const newEvent: ICalendarEvent = { _id: genId('cal'), ...data };
    if (this.useMongo()) {
      const created = await CalendarEventModel.create(newEvent);
      return created.toObject() as ICalendarEvent;
    }
    this.calendarEvents.push(newEvent);
    return { ...newEvent };
  }

  async updateCalendarEvent(id: string, data: Partial<ICalendarEvent>): Promise<ICalendarEvent | null> {
    if (this.useMongo()) {
      const updated = await CalendarEventModel.findByIdAndUpdate(id, { $set: data }, { new: true }).lean<ICalendarEvent>();
      return updated ? { ...updated } : null;
    }
    const idx = this.calendarEvents.findIndex(e => e._id === id);
    if (idx === -1) return null;
    this.calendarEvents[idx] = { ...this.calendarEvents[idx], ...data };
    return { ...this.calendarEvents[idx] };
  }

  async deleteCalendarEvent(id: string): Promise<boolean> {
    if (this.useMongo()) {
      const deleted = await CalendarEventModel.findByIdAndDelete(id);
      return Boolean(deleted);
    }
    const idx = this.calendarEvents.findIndex(e => e._id === id);
    if (idx === -1) return false;
    this.calendarEvents.splice(idx, 1);
    return true;
  }

  // ================= VISITOR TRIP PLANS =================
  async getVisitPlans(userId?: string): Promise<IVisitPlan[]> {
    if (this.useMongo()) {
      const docs = await VisitPlanModel.find(userId ? { userId } : {}).sort({ createdAt: -1 }).lean<IVisitPlan[]>();
      return docs.map(p => ({ ...p }));
    }
    return this.visitPlans
      .filter(p => !userId || p.userId === userId)
      .map(p => ({ ...p }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getVisitPlanById(id: string, ownerId?: string): Promise<IVisitPlan | null> {
    if (this.useMongo()) {
      const filter: Record<string, any> = { _id: id };
      if (ownerId) filter.userId = ownerId;
      const doc = await VisitPlanModel.findOne(filter).lean<IVisitPlan>();
      return doc ? { ...doc } : null;
    }
    const plan = this.visitPlans.find(p => p._id === id && (!ownerId || p.userId === ownerId));
    return plan ? { ...plan } : null;
  }

  async createVisitPlan(data: Omit<IVisitPlan, '_id' | 'createdAt'>): Promise<IVisitPlan> {
    const newPlan: IVisitPlan = {
      _id: genId('plan'),
      ...data,
      createdAt: new Date().toISOString()
    };
    if (this.useMongo()) {
      const created = await VisitPlanModel.create(newPlan);
      return created.toObject() as IVisitPlan;
    }
    this.visitPlans.unshift(newPlan);
    return { ...newPlan };
  }

  async deleteVisitPlan(id: string, ownerId?: string): Promise<boolean> {
    if (this.useMongo()) {
      const filter: Record<string, any> = { _id: id };
      if (ownerId) filter.userId = ownerId;
      const deleted = await VisitPlanModel.findOneAndDelete(filter);
      return Boolean(deleted);
    }
    const idx = this.visitPlans.findIndex(p => p._id === id && (!ownerId || p.userId === ownerId));
    if (idx === -1) return false;
    this.visitPlans.splice(idx, 1);
    return true;
  }

  // ================= VISITOR FEEDBACK =================
  async getFeedback(templeId?: string): Promise<IFeedback[]> {
    if (this.useMongo()) {
      const docs = await FeedbackModel.find(templeId ? { templeId } : {}).sort({ createdAt: -1 }).lean<IFeedback[]>();
      return docs.map(fb => ({ ...fb }));
    }
    return this.feedback
      .filter(fb => !templeId || fb.templeId === templeId)
      .map(fb => ({ ...fb }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createFeedback(data: Omit<IFeedback, '_id' | 'createdAt'>): Promise<IFeedback> {
    const newFeedback: IFeedback = {
      _id: genId('fb'),
      ...data,
      createdAt: new Date().toISOString()
    };
    if (this.useMongo()) {
      const created = await FeedbackModel.create(newFeedback);
      return created.toObject() as IFeedback;
    }
    this.feedback.unshift(newFeedback);
    return { ...newFeedback };
  }

  async getFeedbackStats() {
    const list = this.useMongo()
      ? await FeedbackModel.find({}).lean<IFeedback[]>()
      : this.feedback;

    const total = list.length;
    if (total === 0) {
      return {
        averageRating: 5.0,
        totalCount: 0,
        usefulPercent: 100,
        breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }
    const sum = list.reduce((acc, curr) => acc + curr.overallRating, 0);
    const usefulCount = list.filter(fb => fb.useful).length;
    const breakdown: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    list.forEach(fb => {
      const rounded = Math.round(fb.overallRating);
      if (breakdown[rounded] !== undefined) {
        breakdown[rounded]++;
      }
    });

    return {
      averageRating: parseFloat((sum / total).toFixed(1)),
      totalCount: total,
      usefulPercent: Math.round((usefulCount / total) * 100),
      breakdown
    };
  }

  // ================= SEARCH =================
  async search(query: string): Promise<{
    temples: ITemple[];
    poojas: IPooja[];
    facilities: IFacility[];
    parking: IParking[];
  }> {
    const q = query.toLowerCase().trim();
    if (!q) {
      return { temples: [], poojas: [], facilities: [], parking: [] };
    }

    if (this.useMongo()) {
      const rx = new RegExp(escapeRegex(q), 'i');
      const [temples, poojas, facilities, parking] = await Promise.all([
        TempleModel.find({
          $or: [
            { name: rx },
            { city: rx },
            { district: rx },
            { state: rx },
            { deity: rx },
            { subtitle: rx }
          ]
        }).limit(10).lean<ITemple[]>(),
        PoojaModel.find({
          $or: [{ name: rx }, { category: rx }, { description: rx }]
        }).limit(10).lean<IPooja[]>(),
        FacilityModel.find({
          $or: [{ name: rx }, { category: rx }, { description: rx }]
        }).limit(10).lean<IFacility[]>(),
        ParkingModel.find({
          $or: [{ name: rx }, { location: rx }]
        }).limit(10).lean<IParking[]>()
      ]);

      return {
        temples: temples.map(t => this.normalizeTemple(t)),
        poojas,
        facilities,
        parking
      };
    }

    const matchedTemples = this.temples.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.city.toLowerCase().includes(q) ||
      t.district.toLowerCase().includes(q) ||
      t.state.toLowerCase().includes(q) ||
      t.deity.toLowerCase().includes(q) ||
      t.subtitle.toLowerCase().includes(q)
    );

    const matchedPoojas = this.poojas.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );

    const matchedFacilities = this.facilities.filter(f =>
      f.name.toLowerCase().includes(q) ||
      f.category.toLowerCase().includes(q) ||
      f.description.toLowerCase().includes(q)
    );

    const matchedParking = this.parking.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q)
    );

    return {
      temples: matchedTemples.slice(0, 10).map(t => this.normalizeTemple(t)),
      poojas: matchedPoojas.slice(0, 10),
      facilities: matchedFacilities.slice(0, 10),
      parking: matchedParking.slice(0, 10)
    };
  }

  // ================= STATS FOR ADMIN =================
  async getDashboardStats() {
    if (this.useMongo()) {
      const [
        totalTemples,
        totalUsers,
        totalPoojas,
        totalFacilities,
        totalParking,
        totalPrasadam,
        totalHospitals,
        totalEmergency,
        totalAnnouncements,
        totalMessages,
        totalBookings,
        totalCalendarEvents,
        totalVisitPlans,
        totalFeedback
      ] = await Promise.all([
        TempleModel.countDocuments(),
        UserModel.countDocuments(),
        PoojaModel.countDocuments(),
        FacilityModel.countDocuments(),
        ParkingModel.countDocuments(),
        PrasadamModel.countDocuments(),
        HospitalModel.countDocuments(),
        EmergencyContactModel.countDocuments(),
        AnnouncementModel.countDocuments(),
        MessageModel.countDocuments(),
        BookingModel.countDocuments(),
        CalendarEventModel.countDocuments(),
        VisitPlanModel.countDocuments(),
        FeedbackModel.countDocuments()
      ]);

      return {
        totalTemples,
        totalUsers,
        totalPoojas,
        totalFacilities,
        totalParking,
        totalPrasadam,
        totalHospitals,
        totalEmergency,
        totalAnnouncements,
        totalMessages,
        totalBookings,
        totalCalendarEvents,
        totalVisitPlans,
        totalFeedback
      };
    }

    return {
      totalTemples: this.temples.length,
      totalUsers: this.users.length,
      totalPoojas: this.poojas.length,
      totalFacilities: this.facilities.length,
      totalParking: this.parking.length,
      totalPrasadam: this.prasadam.length,
      totalHospitals: this.hospitals.length,
      totalEmergency: this.emergencyContacts.length,
      totalAnnouncements: this.announcements.length,
      totalMessages: this.messages.length,
      totalBookings: this.bookings.length,
      totalCalendarEvents: this.calendarEvents.length,
      totalVisitPlans: this.visitPlans.length,
      totalFeedback: this.feedback.length
    };
  }
}

export const dataStore = new DataStore();
