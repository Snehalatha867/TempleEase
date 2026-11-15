import { Request, Response } from 'express';
import { dataStore } from '../data/store.js';
import { AuthRequest } from '../middleware/auth.js';

const qTempleId = (req: Request) => (typeof req.query.templeId === 'string' ? req.query.templeId : undefined);

// Poojas
export const listPoojas = async (req: Request, res: Response) => {
  try {
    const data = await dataStore.getPoojas(qTempleId(req));
    res.json({ success: true, count: data.length, data });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch poojas.' });
  }
};
export const createPooja = async (req: AuthRequest, res: Response) => {
  try {
    const data = await dataStore.createPooja(req.body);
    res.status(201).json({ success: true, message: 'Pooja added successfully.', data });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to create pooja.' });
  }
};
export const updatePooja = async (req: AuthRequest, res: Response) => {
  try {
    const updated = await dataStore.updatePooja(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Pooja not found.' });
    res.json({ success: true, message: 'Pooja updated.', data: updated });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to update pooja.' });
  }
};
export const deletePooja = async (req: AuthRequest, res: Response) => {
  try {
    const ok = await dataStore.deletePooja(req.params.id);
    if (!ok) return res.status(404).json({ success: false, message: 'Pooja not found.' });
    res.json({ success: true, message: 'Pooja deleted.' });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to delete pooja.' });
  }
};

// Schedule
export const listSchedule = async (req: Request, res: Response) => {
  try {
    const data = await dataStore.getSchedule(qTempleId(req));
    res.json({ success: true, count: data.length, data });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch schedule.' });
  }
};
export const createSchedule = async (req: AuthRequest, res: Response) => {
  try {
    const data = await dataStore.createScheduleItem(req.body);
    res.status(201).json({ success: true, message: 'Schedule entry added.', data });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to add schedule.' });
  }
};
export const updateSchedule = async (req: AuthRequest, res: Response) => {
  try {
    const updated = await dataStore.updateScheduleItem(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Schedule entry not found.' });
    res.json({ success: true, message: 'Schedule entry updated.', data: updated });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to update schedule.' });
  }
};
export const deleteSchedule = async (req: AuthRequest, res: Response) => {
  try {
    const ok = await dataStore.deleteScheduleItem(req.params.id);
    if (!ok) return res.status(404).json({ success: false, message: 'Entry not found.' });
    res.json({ success: true, message: 'Schedule entry deleted.' });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to delete schedule.' });
  }
};

// Facilities
export const listFacilities = async (req: Request, res: Response) => {
  try {
    const data = await dataStore.getFacilities(qTempleId(req));
    res.json({ success: true, count: data.length, data });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch facilities.' });
  }
};
export const createFacility = async (req: AuthRequest, res: Response) => {
  try {
    const data = await dataStore.createFacility(req.body);
    res.status(201).json({ success: true, message: 'Facility created.', data });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to create facility.' });
  }
};
export const updateFacility = async (req: AuthRequest, res: Response) => {
  try {
    const updated = await dataStore.updateFacility(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Facility not found.' });
    res.json({ success: true, message: 'Facility updated.', data: updated });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to update facility.' });
  }
};
export const deleteFacility = async (req: AuthRequest, res: Response) => {
  try {
    const ok = await dataStore.deleteFacility(req.params.id);
    if (!ok) return res.status(404).json({ success: false, message: 'Facility not found.' });
    res.json({ success: true, message: 'Facility deleted.' });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to delete facility.' });
  }
};

// Parking
export const listParking = async (req: Request, res: Response) => {
  try {
    const data = await dataStore.getParking(qTempleId(req));
    res.json({ success: true, count: data.length, data });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch parking.' });
  }
};
export const createParking = async (req: AuthRequest, res: Response) => {
  try {
    const data = await dataStore.createParking(req.body);
    res.status(201).json({ success: true, message: 'Parking area created.', data });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to create parking.' });
  }
};
export const updateParking = async (req: AuthRequest, res: Response) => {
  try {
    const updated = await dataStore.updateParking(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Parking not found.' });
    res.json({ success: true, message: 'Parking updated.', data: updated });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to update parking.' });
  }
};
export const deleteParking = async (req: AuthRequest, res: Response) => {
  try {
    const ok = await dataStore.deleteParking(req.params.id);
    if (!ok) return res.status(404).json({ success: false, message: 'Parking not found.' });
    res.json({ success: true, message: 'Parking deleted.' });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to delete parking.' });
  }
};

// Prasadam
export const listPrasadam = async (req: Request, res: Response) => {
  try {
    const data = await dataStore.getPrasadam(qTempleId(req));
    res.json({ success: true, count: data.length, data });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch prasadam.' });
  }
};
export const createPrasadam = async (req: AuthRequest, res: Response) => {
  try {
    const data = await dataStore.createPrasadam(req.body);
    res.status(201).json({ success: true, message: 'Prasadam item created.', data });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to add prasadam.' });
  }
};
export const updatePrasadam = async (req: AuthRequest, res: Response) => {
  try {
    const updated = await dataStore.updatePrasadam(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Prasadam not found.' });
    res.json({ success: true, message: 'Prasadam updated.', data: updated });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to update prasadam.' });
  }
};
export const deletePrasadam = async (req: AuthRequest, res: Response) => {
  try {
    const ok = await dataStore.deletePrasadam(req.params.id);
    if (!ok) return res.status(404).json({ success: false, message: 'Prasadam not found.' });
    res.json({ success: true, message: 'Prasadam deleted.' });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to delete prasadam.' });
  }
};

// Hospitals
export const listHospitals = async (req: Request, res: Response) => {
  try {
    const data = await dataStore.getHospitals(qTempleId(req));
    res.json({ success: true, count: data.length, data });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch hospitals.' });
  }
};
export const createHospital = async (req: AuthRequest, res: Response) => {
  try {
    const data = await dataStore.createHospital(req.body);
    res.status(201).json({ success: true, message: 'Hospital added.', data });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to add hospital.' });
  }
};
export const updateHospital = async (req: AuthRequest, res: Response) => {
  try {
    const updated = await dataStore.updateHospital(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Hospital not found.' });
    res.json({ success: true, message: 'Hospital updated.', data: updated });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to update hospital.' });
  }
};
export const deleteHospital = async (req: AuthRequest, res: Response) => {
  try {
    const ok = await dataStore.deleteHospital(req.params.id);
    if (!ok) return res.status(404).json({ success: false, message: 'Hospital not found.' });
    res.json({ success: true, message: 'Hospital deleted.' });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to delete hospital.' });
  }
};

// Emergency Contacts
export const listEmergency = async (req: Request, res: Response) => {
  try {
    const data = await dataStore.getEmergencyContacts(qTempleId(req));
    res.json({ success: true, count: data.length, data });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch emergency contacts.' });
  }
};
export const createEmergency = async (req: AuthRequest, res: Response) => {
  try {
    const data = await dataStore.createEmergencyContact(req.body);
    res.status(201).json({ success: true, message: 'Emergency contact added.', data });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to add contact.' });
  }
};
export const updateEmergency = async (req: AuthRequest, res: Response) => {
  try {
    const updated = await dataStore.updateEmergencyContact(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Contact not found.' });
    res.json({ success: true, message: 'Emergency contact updated.', data: updated });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to update emergency contact.' });
  }
};
export const deleteEmergency = async (req: AuthRequest, res: Response) => {
  try {
    const ok = await dataStore.deleteEmergencyContact(req.params.id);
    if (!ok) return res.status(404).json({ success: false, message: 'Contact not found.' });
    res.json({ success: true, message: 'Emergency contact deleted.' });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to delete emergency contact.' });
  }
};

// Guidelines
export const listGuidelines = async (req: Request, res: Response) => {
  try {
    const data = await dataStore.getGuidelines(qTempleId(req));
    res.json({ success: true, count: data.length, data });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch guidelines.' });
  }
};
export const createGuideline = async (req: AuthRequest, res: Response) => {
  try {
    const data = await dataStore.createGuideline(req.body);
    res.status(201).json({ success: true, message: 'Guideline added.', data });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to add guideline.' });
  }
};
export const updateGuideline = async (req: AuthRequest, res: Response) => {
  try {
    const updated = await dataStore.updateGuideline(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Guideline not found.' });
    res.json({ success: true, message: 'Guideline updated.', data: updated });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to update guideline.' });
  }
};
export const deleteGuideline = async (req: AuthRequest, res: Response) => {
  try {
    const ok = await dataStore.deleteGuideline(req.params.id);
    if (!ok) return res.status(404).json({ success: false, message: 'Guideline not found.' });
    res.json({ success: true, message: 'Guideline deleted.' });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to delete guideline.' });
  }
};

// Announcements
export const listAnnouncements = async (req: Request, res: Response) => {
  try {
    const data = await dataStore.getAnnouncements(qTempleId(req));
    res.json({ success: true, count: data.length, data });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch announcements.' });
  }
};
export const createAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const data = await dataStore.createAnnouncement(req.body);
    res.status(201).json({ success: true, message: 'Announcement published.', data });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to publish announcement.' });
  }
};
export const updateAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const updated = await dataStore.updateAnnouncement(req.params.id, req.body);
    if (!updated) return res.status(404).json({ success: false, message: 'Announcement not found.' });
    res.json({ success: true, message: 'Announcement updated.', data: updated });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to update announcement.' });
  }
};
export const deleteAnnouncement = async (req: AuthRequest, res: Response) => {
  try {
    const ok = await dataStore.deleteAnnouncement(req.params.id);
    if (!ok) return res.status(404).json({ success: false, message: 'Announcement not found.' });
    res.json({ success: true, message: 'Announcement deleted.' });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to delete announcement.' });
  }
};

// Favorites
export const listFavorites = async (req: AuthRequest, res: Response) => {
  try {
    const favs = await dataStore.getFavoritesByUser(req.user!.id);
    res.json({ success: true, count: favs.length, data: favs });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch favorites.' });
  }
};
export const addFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const { itemType, itemId, title, details } = req.body;
    if (!itemType || !itemId || !title) {
      return res.status(400).json({ success: false, message: 'Item details are required.' });
    }
    const fav = await dataStore.addFavorite(req.user!.id, { itemType, itemId, title, details });
    res.status(201).json({ success: true, message: 'Saved to your favorites.', data: fav });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to save favorite.' });
  }
};
export const removeFavorite = async (req: AuthRequest, res: Response) => {
  try {
    const success = await dataStore.removeFavorite(req.user!.id, req.params.itemId);
    res.json({ success, message: success ? 'Removed from favorites.' : 'Item not found in favorites.' });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to remove favorite.' });
  }
};

// Contact Messages
export const listMessages = async (_req: AuthRequest, res: Response) => {
  try {
    const messages = await dataStore.getMessages();
    res.json({ success: true, count: messages.length, data: messages });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to fetch messages.' });
  }
};
export const submitMessage = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, message: 'All required fields must be filled.' });
    }
    const newMsg = await dataStore.createMessage({
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : '',
      subject: subject.trim(),
      message: message.trim()
    });
    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out. Your inquiry has been received by our visitor desk.',
      data: newMsg
    });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to submit contact message.' });
  }
};
export const updateMessageStatus = async (req: AuthRequest, res: Response) => {
  try {
    const updated = await dataStore.updateMessageStatus(req.params.id, req.body.status);
    if (!updated) return res.status(404).json({ success: false, message: 'Message not found.' });
    res.json({ success: true, message: 'Status updated.', data: updated });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to update message status.' });
  }
};
export const deleteMessage = async (req: AuthRequest, res: Response) => {
  try {
    const ok = await dataStore.deleteMessage(req.params.id);
    if (!ok) return res.status(404).json({ success: false, message: 'Message not found.' });
    res.json({ success: true, message: 'Message deleted.' });
  } catch {
    res.status(500).json({ success: false, message: 'Failed to delete message.' });
  }
};
