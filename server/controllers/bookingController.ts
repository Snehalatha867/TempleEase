import { Request, Response } from 'express';
import QRCode from 'qrcode';
import { dataStore } from '../data/store.js';
import { AuthRequest } from '../middleware/auth.js';

// ================= POOJA / SEVA BOOKINGS =================
export const listBookings = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.role === 'ADMIN'
      ? req.query.userId as string | undefined
      : req.user!.id;
    const templeId = req.query.templeId as string | undefined;
    const bookings = await dataStore.getBookings(userId, templeId);
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch bookings.' });
  }
};

export const getBookingById = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = req.user?.role === 'ADMIN' ? undefined : req.user!.id;
    const booking = await dataStore.getBookingById(req.params.idOrBookingId, ownerId);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking record not found.' });
    }
    res.json({ success: true, data: booking });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to retrieve booking.' });
  }
};

export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const {
      templeId,
      templeName,
      poojaId,
      poojaName,
      date,
      slot,
      devoteeName,
      gotram,
      nakshatram,
      personCount,
      phone,
      email,
      sankalpam,
      amount,
      paymentMode
    } = req.body;

    if (!templeId || !poojaName || !date || !slot || !devoteeName || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all mandatory booking fields (temple, pooja, date, slot, devotee name, phone, email).'
      });
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const bookingId = `TE-BK-${new Date().getFullYear()}-${randomSuffix}`;

    const host = req.get('host') || 'localhost:3000';
    const protocol = req.protocol || 'http';
    const qrDataPayload = `${protocol}://${host}/bookings/${bookingId}`;
    let qrDataUrl = '';
    try {
      qrDataUrl = await QRCode.toDataURL(qrDataPayload, {
        width: 380,
        margin: 2,
        color: {
          dark: '#7B1D16',
          light: '#FFFFFF'
        }
      });
    } catch {
      qrDataUrl = '';
    }

    const newBooking = await dataStore.createBooking({
      bookingId,
      userId: req.user?.id,
      templeId,
      templeName: templeName || 'Temple Shrine',
      poojaId: poojaId || 'general_pooja',
      poojaName,
      date,
      slot,
      devoteeName: devoteeName.trim(),
      gotram: gotram ? gotram.trim() : undefined,
      nakshatram: nakshatram ? nakshatram.trim() : undefined,
      personCount: Number(personCount) || 1,
      phone: phone.trim(),
      email: email.trim(),
      sankalpam: sankalpam ? sankalpam.trim() : undefined,
      amount: Number(amount) || 0,
      paymentMode: paymentMode || 'Demo Online',
      status: 'Confirmed',
      qrDataUrl
    });

    res.status(201).json({
      success: true,
      message: `Pooja booking confirmed successfully! Booking ID: ${bookingId}`,
      data: newBooking
    });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to process seva booking.' });
  }
};

export const cancelBooking = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = req.user?.role === 'ADMIN' ? undefined : req.user!.id;
    const updated = await dataStore.cancelBooking(req.params.id, ownerId);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }
    res.json({ success: true, message: 'Booking cancelled successfully.', data: updated });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to cancel booking.' });
  }
};

// ================= TEMPLE CALENDAR =================
export const listCalendarEvents = async (req: Request, res: Response) => {
  try {
    const templeId = typeof req.query.templeId === 'string' ? req.query.templeId : undefined;
    const date = typeof req.query.date === 'string' ? req.query.date : undefined;
    const month = typeof req.query.month === 'string' ? req.query.month : undefined;

    const events = await dataStore.getCalendarEvents({ templeId, date, month });
    res.json({ success: true, count: events.length, data: events });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch calendar events.' });
  }
};

export const createCalendarEvent = async (req: AuthRequest, res: Response) => {
  try {
    const { templeId, templeName, title, date, time, category, description, location, priority } = req.body;
    if (!title || !date || !time || !description) {
      return res.status(400).json({ success: false, message: 'Title, date, time, and description are required.' });
    }

    const newEvent = await dataStore.createCalendarEvent({
      templeId: templeId || 'all',
      templeName: templeName || 'All Temples',
      title: title.trim(),
      date,
      time,
      category: category || 'Special Seva',
      description: description.trim(),
      location: location ? location.trim() : undefined,
      priority: priority || 'Normal'
    });

    res.status(201).json({ success: true, message: 'Calendar event added.', data: newEvent });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to create calendar event.' });
  }
};

export const updateCalendarEvent = async (req: AuthRequest, res: Response) => {
  try {
    const updated = await dataStore.updateCalendarEvent(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Calendar event not found.' });
    }
    res.json({ success: true, message: 'Calendar event updated.', data: updated });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to update calendar event.' });
  }
};

export const deleteCalendarEvent = async (req: AuthRequest, res: Response) => {
  try {
    const success = await dataStore.deleteCalendarEvent(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Calendar event not found.' });
    }
    res.json({ success: true, message: 'Calendar event removed.' });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to delete calendar event.' });
  }
};

// ================= VISITOR TRIP PLANS =================
export const listVisitPlans = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.role === 'ADMIN'
      ? req.query.userId as string | undefined
      : req.user!.id;
    const plans = await dataStore.getVisitPlans(userId);
    res.json({ success: true, count: plans.length, data: plans });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch visit plans.' });
  }
};

export const getVisitPlanById = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = req.user?.role === 'ADMIN' ? undefined : req.user!.id;
    const plan = await dataStore.getVisitPlanById(req.params.id, ownerId);
    if (!plan) return res.status(404).json({ success: false, message: 'Visit plan not found.' });
    res.json({ success: true, data: plan });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch plan.' });
  }
};

export const createVisitPlan = async (req: AuthRequest, res: Response) => {
  try {
    const {
      templeId,
      templeName,
      visitDate,
      visitorCount,
      arrivalTime,
      hasElderly,
      hasChildren,
      transportMode,
      wheelchairNeeded,
      notes
    } = req.body;

    if (!templeId || !visitDate) {
      return res.status(400).json({ success: false, message: 'Temple and visit date are required.' });
    }

    const temple = await dataStore.getTempleByIdOrSlug(templeId);
    const resolvedName = temple ? temple.name : (templeName || 'Sacred Temple Shrine');
    const defaultArrival = arrivalTime || '06:00 AM';

    const itinerary = [
      {
        time: defaultArrival,
        title: 'Arrival & Dedicated Parking',
        description: `Arrive at ${resolvedName}. Dedicated parking area with ${hasElderly || wheelchairNeeded ? 'wheelchair-accessible bay and battery cart shuttle' : 'spacious multi-level visitor parking'}.`,
        icon: 'Car',
        category: 'Arrival'
      },
      {
        time: '30 mins after arrival',
        title: 'Footwear Deposit & Security Check',
        description: `Deposit mobile phones and footwear at verified free counters. ${hasElderly ? 'Elderly wheelchair priority assistance desk available near Gate 1.' : 'Proceed through security queue.'}`,
        icon: 'ShieldCheck',
        category: 'Preparation'
      },
      {
        time: '1 hour after arrival',
        title: 'Sanctum Darshan & Holy Pooja',
        description: `Enter the sanctum for divine darshan. Follow queue protocols (${temple ? temple.dressCodeMen : 'traditional attire'}). ${hasElderly ? 'Special senior citizen seating line available.' : ''}`,
        icon: 'Sparkles',
        category: 'Darshan'
      },
      {
        time: '2.5 hours after arrival',
        title: 'Prasadam Collection & Annadanam',
        description: `Collect sacred teertham and blessed prasadam. Free Annadanam (Nitya Annadanam) available at the dining hall.`,
        icon: 'Droplet',
        category: 'Prasadam'
      },
      {
        time: '3.5 hours after arrival',
        title: 'Prakaram Parikrama & Departure',
        description: `Complete sacred pradakshina of the holy outer corridors, temple tank/teertham, and proceed back to parking shuttle.`,
        icon: 'Clock',
        category: 'Wrap-up'
      }
    ];

    const summary = {
      recommendedArrival: `${defaultArrival} (Early morning recommended to avoid mid-day heat and queues)`,
      estimatedDuration: hasElderly || hasChildren ? '4 to 5 Hours (relaxed pace)' : '3 to 4 Hours',
      parkingZone: temple ? `${temple.city} Main Pilgrim Parking Complex` : 'Designated Temple Parking Area',
      prasadamCounter: 'Prasadam Distribution Counter (Gate 2 & Annadanam Complex)',
      emergencyDesk: 'Temple First Aid Centre & 24x7 Emergency Help Desk',
      dressCodeSummary: temple ? `${temple.dressCodeMen}; ${temple.dressCodeWomen}` : 'Strict traditional Indian attire required.'
    };

    const newPlan = await dataStore.createVisitPlan({
      userId: req.user?.id,
      templeId,
      templeName: resolvedName,
      visitDate,
      visitorCount: Number(visitorCount) || 1,
      arrivalTime: defaultArrival,
      hasElderly: Boolean(hasElderly),
      hasChildren: Boolean(hasChildren),
      transportMode: transportMode || 'Private Car',
      wheelchairNeeded: Boolean(wheelchairNeeded),
      notes: notes ? notes.trim() : '',
      itinerary,
      summary
    });

    res.status(201).json({
      success: true,
      message: 'Personalized temple visit plan generated successfully!',
      data: newPlan
    });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to generate visit plan.' });
  }
};

export const deleteVisitPlan = async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = req.user?.role === 'ADMIN' ? undefined : req.user!.id;
    const success = await dataStore.deleteVisitPlan(req.params.id, ownerId);
    if (!success) return res.status(404).json({ success: false, message: 'Plan not found.' });
    res.json({ success: true, message: 'Plan deleted successfully.' });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to delete plan.' });
  }
};

// ================= VISITOR FEEDBACK =================
export const listFeedback = async (req: Request, res: Response) => {
  try {
    const templeId = typeof req.query.templeId === 'string' ? req.query.templeId : undefined;
    const feedbackList = await dataStore.getFeedback(templeId);
    res.json({ success: true, count: feedbackList.length, data: feedbackList });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to load feedback.' });
  }
};

export const getFeedbackStats = async (_req: Request, res: Response) => {
  try {
    const stats = await dataStore.getFeedbackStats();
    res.json({ success: true, data: stats });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to calculate feedback statistics.' });
  }
};

export const createFeedback = async (req: Request, res: Response) => {
  try {
    const {
      templeId,
      templeName,
      overallRating,
      useful,
      navigationRating,
      facilitiesRating,
      experienceText,
      suggestions,
      userName,
      userEmail,
      userId
    } = req.body;

    if (!overallRating || !experienceText || !experienceText.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an overall rating and your visit experience feedback.'
      });
    }

    const newFeedback = await dataStore.createFeedback({
      userId: userId || undefined,
      userName: userName ? userName.trim() : 'Visiting Devotee',
      userEmail: userEmail ? userEmail.trim() : undefined,
      templeId: templeId || 'temple_tirumala_01',
      templeName: templeName || 'Sacred Temple',
      overallRating: Math.min(5, Math.max(1, Number(overallRating) || 5)),
      useful: useful !== undefined ? Boolean(useful) : true,
      navigationRating: Math.min(5, Math.max(1, Number(navigationRating) || 5)),
      facilitiesRating: Math.min(5, Math.max(1, Number(facilitiesRating) || 5)),
      experienceText: experienceText.trim(),
      suggestions: suggestions ? suggestions.trim() : undefined
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your valuable feedback! It helps improve pilgrim assistance for everyone.',
      data: newFeedback
    });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to record feedback.' });
  }
};
