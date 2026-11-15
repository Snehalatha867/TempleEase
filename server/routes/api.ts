import { Router } from 'express';
import { optionalAuth, requireAuth, requireAdmin } from '../middleware/auth.js';
import * as authController from '../controllers/authController.js';
import * as templeController from '../controllers/templeController.js';
import * as serviceController from '../controllers/serviceController.js';
import * as bookingController from '../controllers/bookingController.js';
import * as adminController from '../controllers/adminController.js';

export const apiRouter = Router();

// System Health & Metadata
apiRouter.get('/status', adminController.getSystemStatus);
apiRouter.get('/search', templeController.globalSearch);
apiRouter.get('/metadata', templeController.getMetadata);

// Authentication & Profile
apiRouter.post('/auth/register', authController.register);
apiRouter.post('/auth/login', authController.login);
apiRouter.get('/auth/me', requireAuth, authController.getMe);
apiRouter.put('/auth/profile', requireAuth, authController.updateProfile);
apiRouter.put('/auth/change-password', requireAuth, authController.changePassword);

// Temples Directory & CRUD
apiRouter.get('/temples', templeController.listTemples);
apiRouter.get('/temples/:idOrSlug', templeController.getTempleDetail);
apiRouter.post('/temples', requireAdmin, templeController.createTemple);
apiRouter.put('/temples/:id', requireAdmin, templeController.updateTemple);
apiRouter.delete('/temples/:id', requireAdmin, templeController.deleteTemple);

// Temple-Specific Sub-Collections & QR
apiRouter.get('/temples/:id/poojas', templeController.getTemplePoojas);
apiRouter.get('/temples/:id/schedule', templeController.getTempleSchedule);
apiRouter.get('/temples/:id/facilities', templeController.getTempleFacilities);
apiRouter.get('/temples/:id/parking', templeController.getTempleParking);
apiRouter.get('/temples/:id/prasadam', templeController.getTemplePrasadam);
apiRouter.get('/temples/:id/donations', templeController.getTempleDonations);
apiRouter.get('/temples/:id/hospitals', templeController.getTempleHospitals);
apiRouter.get('/temples/:id/emergency', templeController.getTempleEmergency);
apiRouter.get('/temples/:id/qr', templeController.getTempleQr);
apiRouter.all('/qr/generate', adminController.generateGeneralQr);

// Poojas / Sevas CRUD
apiRouter.get('/poojas', serviceController.listPoojas);
apiRouter.post('/poojas', requireAdmin, serviceController.createPooja);
apiRouter.put('/poojas/:id', requireAdmin, serviceController.updatePooja);
apiRouter.delete('/poojas/:id', requireAdmin, serviceController.deletePooja);

// Daily Schedule CRUD
apiRouter.get('/schedule', serviceController.listSchedule);
apiRouter.post('/schedule', requireAdmin, serviceController.createSchedule);
apiRouter.put('/schedule/:id', requireAdmin, serviceController.updateSchedule);
apiRouter.delete('/schedule/:id', requireAdmin, serviceController.deleteSchedule);

// Facilities CRUD
apiRouter.get('/facilities', serviceController.listFacilities);
apiRouter.post('/facilities', requireAdmin, serviceController.createFacility);
apiRouter.put('/facilities/:id', requireAdmin, serviceController.updateFacility);
apiRouter.delete('/facilities/:id', requireAdmin, serviceController.deleteFacility);

// Parking CRUD
apiRouter.get('/parking', serviceController.listParking);
apiRouter.post('/parking', requireAdmin, serviceController.createParking);
apiRouter.put('/parking/:id', requireAdmin, serviceController.updateParking);
apiRouter.delete('/parking/:id', requireAdmin, serviceController.deleteParking);

// Prasadam CRUD
apiRouter.get('/prasadam', serviceController.listPrasadam);
apiRouter.post('/prasadam', requireAdmin, serviceController.createPrasadam);
apiRouter.put('/prasadam/:id', requireAdmin, serviceController.updatePrasadam);
apiRouter.delete('/prasadam/:id', requireAdmin, serviceController.deletePrasadam);

// Hospitals CRUD
apiRouter.get('/hospitals', serviceController.listHospitals);
apiRouter.post('/hospitals', requireAdmin, serviceController.createHospital);
apiRouter.put('/hospitals/:id', requireAdmin, serviceController.updateHospital);
apiRouter.delete('/hospitals/:id', requireAdmin, serviceController.deleteHospital);

// Emergency Contacts CRUD
apiRouter.get('/emergency', serviceController.listEmergency);
apiRouter.post('/emergency', requireAdmin, serviceController.createEmergency);
apiRouter.put('/emergency/:id', requireAdmin, serviceController.updateEmergency);
apiRouter.delete('/emergency/:id', requireAdmin, serviceController.deleteEmergency);

// Visitor Guidelines CRUD
apiRouter.get('/guidelines', serviceController.listGuidelines);
apiRouter.post('/guidelines', requireAdmin, serviceController.createGuideline);
apiRouter.put('/guidelines/:id', requireAdmin, serviceController.updateGuideline);
apiRouter.delete('/guidelines/:id', requireAdmin, serviceController.deleteGuideline);

// Announcements CRUD
apiRouter.get('/announcements', serviceController.listAnnouncements);
apiRouter.post('/announcements', requireAdmin, serviceController.createAnnouncement);
apiRouter.put('/announcements/:id', requireAdmin, serviceController.updateAnnouncement);
apiRouter.delete('/announcements/:id', requireAdmin, serviceController.deleteAnnouncement);

// User Favorites
apiRouter.get('/favorites', requireAuth, serviceController.listFavorites);
apiRouter.post('/favorites', requireAuth, serviceController.addFavorite);
apiRouter.delete('/favorites/:itemId', requireAuth, serviceController.removeFavorite);

// Contact Inquiries
apiRouter.get('/contact', requireAdmin, serviceController.listMessages);
apiRouter.post('/contact', serviceController.submitMessage);
apiRouter.put('/contact/:id/status', requireAdmin, serviceController.updateMessageStatus);
apiRouter.delete('/contact/:id', requireAdmin, serviceController.deleteMessage);

// Admin Stats & Users
apiRouter.get('/admin/stats', requireAdmin, adminController.getDashboardStats);
apiRouter.get('/admin/users', requireAdmin, adminController.getAllUsers);

// Pooja / Seva Bookings
apiRouter.get('/bookings', requireAuth, bookingController.listBookings);
apiRouter.get('/bookings/:idOrBookingId', requireAuth, bookingController.getBookingById);
apiRouter.post('/bookings', optionalAuth, bookingController.createBooking);
apiRouter.put('/bookings/:id/cancel', requireAuth, bookingController.cancelBooking);

// Temple Calendar Events
apiRouter.get('/calendar-events', bookingController.listCalendarEvents);
apiRouter.post('/calendar-events', requireAdmin, bookingController.createCalendarEvent);
apiRouter.put('/calendar-events/:id', requireAdmin, bookingController.updateCalendarEvent);
apiRouter.delete('/calendar-events/:id', requireAdmin, bookingController.deleteCalendarEvent);

// Visitor Trip Planner
apiRouter.get('/visit-plans', requireAuth, bookingController.listVisitPlans);
apiRouter.get('/visit-plans/:id', requireAuth, bookingController.getVisitPlanById);
apiRouter.post('/visit-plans', optionalAuth, bookingController.createVisitPlan);
apiRouter.delete('/visit-plans/:id', requireAuth, bookingController.deleteVisitPlan);

// Visitor Feedback
apiRouter.get('/feedback', bookingController.listFeedback);
apiRouter.get('/feedback/stats', bookingController.getFeedbackStats);
apiRouter.post('/feedback', bookingController.createFeedback);
