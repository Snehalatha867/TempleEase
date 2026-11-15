import { Request, Response } from 'express';
import QRCode from 'qrcode';
import { dataStore } from '../data/store.js';
import { AuthRequest } from '../middleware/auth.js';

export const getMetadata = async (_req: Request, res: Response) => {
  try {
    const allTemples = await dataStore.getTemples();
    const states = Array.from(new Set(allTemples.map(t => t.state))).sort();
    const deities = Array.from(new Set(allTemples.map(t => t.deity))).sort();
    const cities = Array.from(new Set(allTemples.map(t => t.city))).sort();

    res.json({
      success: true,
      data: {
        states,
        deities,
        cities,
        totalTemples: allTemples.length
      }
    });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch directory metadata.' });
  }
};

export const globalSearch = async (req: Request, res: Response) => {
  try {
    const query = typeof req.query.q === 'string' ? req.query.q : '';
    const results = await dataStore.search(query);
    res.json({ success: true, query, results });
  } catch {
    res.status(500).json({ success: false, message: 'Search query failed.' });
  }
};

export const listTemples = async (req: Request, res: Response) => {
  try {
    const q = typeof req.query.q === 'string' ? req.query.q : undefined;
    const state = typeof req.query.state === 'string' ? req.query.state : undefined;
    const deity = typeof req.query.deity === 'string' ? req.query.deity : undefined;
    const popular = req.query.popular === 'true' ? true : (req.query.popular === 'false' ? false : undefined);
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : undefined;

    const temples = await dataStore.getTemples({ q, state, deity, popular, limit });
    res.json({ success: true, count: temples.length, data: temples });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to load temples directory.' });
  }
};

export const getTempleDetail = async (req: Request, res: Response) => {
  try {
    const temple = await dataStore.getTempleByIdOrSlug(req.params.idOrSlug);
    if (!temple) {
      return res.status(404).json({ success: false, message: 'Temple not found in directory.' });
    }

    const [poojas, schedule, parking, facilities, prasadam, donations, hospitals, emergency] = await Promise.all([
      dataStore.getPoojas(temple._id),
      dataStore.getSchedule(temple._id),
      dataStore.getParking(temple._id),
      dataStore.getFacilities(temple._id),
      dataStore.getPrasadam(temple._id),
      dataStore.getDonations(temple._id),
      dataStore.getHospitals(temple._id),
      dataStore.getEmergencyContacts(temple._id)
    ]);

    res.json({
      success: true,
      data: {
        ...temple,
        poojas,
        schedule,
        parking,
        facilities,
        prasadam,
        donations,
        hospitals,
        emergency
      }
    });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch temple details.' });
  }
};

export const createTemple = async (req: AuthRequest, res: Response) => {
  try {
    const newTemple = await dataStore.createTemple(req.body);
    res.status(201).json({ success: true, message: 'Temple registered successfully.', data: newTemple });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to create temple.' });
  }
};

export const updateTemple = async (req: AuthRequest, res: Response) => {
  try {
    const updated = await dataStore.updateTemple(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Temple record not found.' });
    }
    res.json({ success: true, message: 'Temple details updated successfully.', data: updated });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to update temple.' });
  }
};

export const deleteTemple = async (req: AuthRequest, res: Response) => {
  try {
    const success = await dataStore.deleteTemple(req.params.id);
    if (!success) {
      return res.status(404).json({ success: false, message: 'Temple not found.' });
    }
    res.json({ success: true, message: 'Temple and associated records deleted.' });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to delete temple.' });
  }
};

async function resolveTempleId(idOrSlug: string): Promise<string> {
  const temple = await dataStore.getTempleByIdOrSlug(idOrSlug);
  return temple ? temple._id : idOrSlug;
}

export const getTemplePoojas = async (req: Request, res: Response) => {
  try {
    const templeId = await resolveTempleId(req.params.id);
    const poojas = await dataStore.getPoojas(templeId);
    res.json({ success: true, count: poojas.length, data: poojas });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch poojas.' });
  }
};

export const getTempleSchedule = async (req: Request, res: Response) => {
  try {
    const templeId = await resolveTempleId(req.params.id);
    const schedule = await dataStore.getSchedule(templeId);
    res.json({ success: true, count: schedule.length, data: schedule });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch schedule.' });
  }
};

export const getTempleFacilities = async (req: Request, res: Response) => {
  try {
    const templeId = await resolveTempleId(req.params.id);
    const facilities = await dataStore.getFacilities(templeId);
    res.json({ success: true, count: facilities.length, data: facilities });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch facilities.' });
  }
};

export const getTempleParking = async (req: Request, res: Response) => {
  try {
    const templeId = await resolveTempleId(req.params.id);
    const parking = await dataStore.getParking(templeId);
    res.json({ success: true, count: parking.length, data: parking });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch parking.' });
  }
};

export const getTemplePrasadam = async (req: Request, res: Response) => {
  try {
    const templeId = await resolveTempleId(req.params.id);
    const prasadam = await dataStore.getPrasadam(templeId);
    res.json({ success: true, count: prasadam.length, data: prasadam });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch prasadam.' });
  }
};

export const getTempleDonations = async (req: Request, res: Response) => {
  try {
    const templeId = await resolveTempleId(req.params.id);
    const donations = await dataStore.getDonations(templeId);
    res.json({ success: true, count: donations.length, data: donations });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch donation info.' });
  }
};

export const getTempleHospitals = async (req: Request, res: Response) => {
  try {
    const templeId = await resolveTempleId(req.params.id);
    const hospitals = await dataStore.getHospitals(templeId);
    res.json({ success: true, count: hospitals.length, data: hospitals });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch hospitals.' });
  }
};

export const getTempleEmergency = async (req: Request, res: Response) => {
  try {
    const templeId = await resolveTempleId(req.params.id);
    const emergency = await dataStore.getEmergencyContacts(templeId);
    res.json({ success: true, count: emergency.length, data: emergency });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch emergency contacts.' });
  }
};

export const getTempleQr = async (req: Request, res: Response) => {
  try {
    const temple = await dataStore.getTempleByIdOrSlug(req.params.id);
    if (!temple) {
      return res.status(404).json({ success: false, message: 'Temple not found.' });
    }

    const host = req.get('host') || 'localhost:3000';
    const protocol = req.protocol || 'http';
    const targetUrl = `${protocol}://${host}/temples/${temple.slug || temple._id}`;

    const qrDataUrl = await QRCode.toDataURL(targetUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: '#7B1D16',
        light: '#FFFFFF'
      }
    });

    res.json({
      success: true,
      templeId: temple._id,
      templeName: temple.name,
      url: targetUrl,
      qrDataUrl
    });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to generate QR code.' });
  }
};
