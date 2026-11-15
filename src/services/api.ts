import axios, { AxiosError, AxiosRequestConfig } from "axios";
import {
  User,
  Temple,
  Pooja,
  ScheduleItem,
  Facility,
  Parking,
  PrasadamItem,
  DonationItem,
  Hospital,
  EmergencyContact,
  Guideline,
  Announcement,
  Favorite,
  ContactMessage,
  Booking,
  CalendarEvent,
  VisitPlan,
  Feedback,
} from "../types";

const TOKEN_KEY = "temple_ease_token";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://templeease-2.onrender.com";

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

const apiClient = axios.create({
  baseURL: apiBaseUrl || undefined,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

async function request<T>(
  endpoint: string,
  config: AxiosRequestConfig = {},
): Promise<T> {
  try {
    const response = await apiClient.request<T>({
      url: endpoint,
      ...config,
    });
    return response.data;
  } catch (err) {
    const axiosErr = err as AxiosError<{ message?: string }>;
    const message =
      axiosErr.response?.data?.message ||
      axiosErr.message ||
      `Request failed with status ${axiosErr.response?.status || "unknown"}`;
    throw new Error(message);
  }
}

export const api = {
  // System & Metadata
  getStatus: () =>
    request<{
      status: string;
      app: string;
      db: { connected: boolean; mode: string };
    }>("/api/status"),
  getMetadata: () =>
    request<{
      success: boolean;
      data: {
        states: string[];
        deities: string[];
        cities: string[];
        totalTemples: number;
      };
    }>("/api/metadata"),
  search: (q: string) =>
    request<{
      success: boolean;
      query: string;
      results: {
        temples: Temple[];
        poojas: Pooja[];
        facilities: Facility[];
        parking: Parking[];
      };
    }>(`/api/search?q=${encodeURIComponent(q)}`),

  // Auth
  register: (payload: {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
  }) =>
    request<{ success: boolean; message: string; token: string; user: User }>(
      "/api/auth/register",
      {
        method: "POST",
        data: payload,
      },
    ),

  login: (payload: { email: string; password: string }) =>
    request<{ success: boolean; message: string; token: string; user: User }>(
      "/api/auth/login",
      {
        method: "POST",
        data: payload,
      },
    ),

  getMe: () => request<{ success: boolean; user: User }>("/api/auth/me"),

  updateProfile: (payload: { name: string; phone: string }) =>
    request<{ success: boolean; message: string; user: User }>(
      "/api/auth/profile",
      {
        method: "PUT",
        data: payload,
      },
    ),

  changePassword: (payload: {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  }) =>
    request<{ success: boolean; message: string }>(
      "/api/auth/change-password",
      {
        method: "PUT",
        data: payload,
      },
    ),

  // Temples Directory & Details
  getTemples: (params?: {
    q?: string;
    state?: string;
    deity?: string;
    popular?: boolean;
    limit?: number;
  }) => {
    const queryParts: string[] = [];
    if (params?.q) queryParts.push(`q=${encodeURIComponent(params.q)}`);
    if (params?.state && params.state !== "All")
      queryParts.push(`state=${encodeURIComponent(params.state)}`);
    if (params?.deity && params.deity !== "All")
      queryParts.push(`deity=${encodeURIComponent(params.deity)}`);
    if (params?.popular !== undefined)
      queryParts.push(`popular=${params.popular}`);
    if (params?.limit) queryParts.push(`limit=${params.limit}`);
    const qs = queryParts.length ? `?${queryParts.join("&")}` : "";
    return request<{ success: boolean; count: number; data: Temple[] }>(
      `/api/temples${qs}`,
    );
  },

  getTemple: (idOrSlug = "temple_tirumala_01") =>
    request<{ success: boolean; data: Temple }>(
      `/api/temples/${encodeURIComponent(idOrSlug)}`,
    ),

  getTempleById: (idOrSlug: string) =>
    request<{ success: boolean; data: Temple }>(
      `/api/temples/${encodeURIComponent(idOrSlug)}`,
    ),

  createTemple: (data: Partial<Temple>) =>
    request<{ success: boolean; message: string; data: Temple }>(
      "/api/temples",
      {
        method: "POST",
        data,
      },
    ),

  updateTemple: (id: string, data: Partial<Temple>) =>
    request<{ success: boolean; message: string; data: Temple }>(
      `/api/temples/${id}`,
      {
        method: "PUT",
        data,
      },
    ),

  deleteTemple: (id: string) =>
    request<{ success: boolean; message: string }>(`/api/temples/${id}`, {
      method: "DELETE",
    }),

  // Specific Temple Sub-Collections
  getTemplePoojas: (id: string) =>
    request<{ success: boolean; count: number; data: Pooja[] }>(
      `/api/temples/${id}/poojas`,
    ),
  getTempleSchedule: (id: string) =>
    request<{ success: boolean; count: number; data: ScheduleItem[] }>(
      `/api/temples/${id}/schedule`,
    ),
  getTempleFacilities: (id: string) =>
    request<{ success: boolean; count: number; data: Facility[] }>(
      `/api/temples/${id}/facilities`,
    ),
  getTempleParking: (id: string) =>
    request<{ success: boolean; count: number; data: Parking[] }>(
      `/api/temples/${id}/parking`,
    ),
  getTemplePrasadam: (id: string) =>
    request<{ success: boolean; count: number; data: PrasadamItem[] }>(
      `/api/temples/${id}/prasadam`,
    ),
  getTempleDonations: (id: string) =>
    request<{ success: boolean; count: number; data: DonationItem[] }>(
      `/api/temples/${id}/donations`,
    ),
  getTempleHospitals: (id: string) =>
    request<{ success: boolean; count: number; data: Hospital[] }>(
      `/api/temples/${id}/hospitals`,
    ),
  getTempleEmergency: (id: string) =>
    request<{ success: boolean; count: number; data: EmergencyContact[] }>(
      `/api/temples/${id}/emergency`,
    ),
  getTempleQr: (id: string) =>
    request<{
      success: boolean;
      templeId: string;
      templeName: string;
      url: string;
      qrDataUrl: string;
    }>(`/api/temples/${id}/qr`),
  generateQr: (url?: string) =>
    request<{ success: boolean; targetUrl: string; qrDataUrl: string }>(
      url
        ? `/api/qr/generate?url=${encodeURIComponent(url)}`
        : "/api/qr/generate",
    ),

  // Global / Multi-Temple Poojas
  getPoojas: (templeId?: string) =>
    request<{ success: boolean; count: number; data: Pooja[] }>(
      `/api/poojas${templeId ? `?templeId=${templeId}` : ""}`,
    ),
  createPooja: (data: Partial<Pooja>) =>
    request<{ success: boolean; message: string; data: Pooja }>("/api/poojas", {
      method: "POST",
      data,
    }),
  updatePooja: (id: string, data: Partial<Pooja>) =>
    request<{ success: boolean; message: string; data: Pooja }>(
      `/api/poojas/${id}`,
      {
        method: "PUT",
        data,
      },
    ),
  deletePooja: (id: string) =>
    request<{ success: boolean; message: string }>(`/api/poojas/${id}`, {
      method: "DELETE",
    }),

  // Schedule
  getSchedule: (templeId?: string) =>
    request<{ success: boolean; count: number; data: ScheduleItem[] }>(
      `/api/schedule${templeId ? `?templeId=${templeId}` : ""}`,
    ),
  createSchedule: (data: Partial<ScheduleItem>) =>
    request<{ success: boolean; message: string; data: ScheduleItem }>(
      "/api/schedule",
      {
        method: "POST",
        data,
      },
    ),
  updateSchedule: (id: string, data: Partial<ScheduleItem>) =>
    request<{ success: boolean; message: string; data: ScheduleItem }>(
      `/api/schedule/${id}`,
      {
        method: "PUT",
        data,
      },
    ),
  deleteSchedule: (id: string) =>
    request<{ success: boolean; message: string }>(`/api/schedule/${id}`, {
      method: "DELETE",
    }),

  // Facilities
  getFacilities: (templeId?: string) =>
    request<{ success: boolean; count: number; data: Facility[] }>(
      `/api/facilities${templeId ? `?templeId=${templeId}` : ""}`,
    ),
  createFacility: (data: Partial<Facility>) =>
    request<{ success: boolean; message: string; data: Facility }>(
      "/api/facilities",
      {
        method: "POST",
        data,
      },
    ),
  updateFacility: (id: string, data: Partial<Facility>) =>
    request<{ success: boolean; message: string; data: Facility }>(
      `/api/facilities/${id}`,
      {
        method: "PUT",
        data,
      },
    ),
  deleteFacility: (id: string) =>
    request<{ success: boolean; message: string }>(`/api/facilities/${id}`, {
      method: "DELETE",
    }),

  // Parking
  getParking: (templeId?: string) =>
    request<{ success: boolean; count: number; data: Parking[] }>(
      `/api/parking${templeId ? `?templeId=${templeId}` : ""}`,
    ),
  createParking: (data: Partial<Parking>) =>
    request<{ success: boolean; message: string; data: Parking }>(
      "/api/parking",
      {
        method: "POST",
        data,
      },
    ),
  updateParking: (id: string, data: Partial<Parking>) =>
    request<{ success: boolean; message: string; data: Parking }>(
      `/api/parking/${id}`,
      {
        method: "PUT",
        data,
      },
    ),
  deleteParking: (id: string) =>
    request<{ success: boolean; message: string }>(`/api/parking/${id}`, {
      method: "DELETE",
    }),

  // Prasadam
  getPrasadam: (templeId?: string) =>
    request<{ success: boolean; count: number; data: PrasadamItem[] }>(
      `/api/prasadam${templeId ? `?templeId=${templeId}` : ""}`,
    ),
  createPrasadam: (data: Partial<PrasadamItem>) =>
    request<{ success: boolean; message: string; data: PrasadamItem }>(
      "/api/prasadam",
      {
        method: "POST",
        data,
      },
    ),
  updatePrasadam: (id: string, data: Partial<PrasadamItem>) =>
    request<{ success: boolean; message: string; data: PrasadamItem }>(
      `/api/prasadam/${id}`,
      {
        method: "PUT",
        data,
      },
    ),
  deletePrasadam: (id: string) =>
    request<{ success: boolean; message: string }>(`/api/prasadam/${id}`, {
      method: "DELETE",
    }),

  // Hospitals
  getHospitals: (templeId?: string) =>
    request<{ success: boolean; count: number; data: Hospital[] }>(
      `/api/hospitals${templeId ? `?templeId=${templeId}` : ""}`,
    ),
  createHospital: (data: Partial<Hospital>) =>
    request<{ success: boolean; message: string; data: Hospital }>(
      "/api/hospitals",
      {
        method: "POST",
        data,
      },
    ),
  updateHospital: (id: string, data: Partial<Hospital>) =>
    request<{ success: boolean; message: string; data: Hospital }>(
      `/api/hospitals/${id}`,
      {
        method: "PUT",
        data,
      },
    ),
  deleteHospital: (id: string) =>
    request<{ success: boolean; message: string }>(`/api/hospitals/${id}`, {
      method: "DELETE",
    }),

  // Emergency
  getEmergency: (templeId?: string) =>
    request<{ success: boolean; count: number; data: EmergencyContact[] }>(
      `/api/emergency${templeId ? `?templeId=${templeId}` : ""}`,
    ),
  createEmergency: (data: Partial<EmergencyContact>) =>
    request<{ success: boolean; message: string; data: EmergencyContact }>(
      "/api/emergency",
      {
        method: "POST",
        data,
      },
    ),
  updateEmergency: (id: string, data: Partial<EmergencyContact>) =>
    request<{ success: boolean; message: string; data: EmergencyContact }>(
      `/api/emergency/${id}`,
      {
        method: "PUT",
        data,
      },
    ),
  deleteEmergency: (id: string) =>
    request<{ success: boolean; message: string }>(`/api/emergency/${id}`, {
      method: "DELETE",
    }),

  // Guidelines
  getGuidelines: (templeId?: string) =>
    request<{ success: boolean; count: number; data: Guideline[] }>(
      `/api/guidelines${templeId ? `?templeId=${templeId}` : ""}`,
    ),
  createGuideline: (data: Partial<Guideline>) =>
    request<{ success: boolean; message: string; data: Guideline }>(
      "/api/guidelines",
      {
        method: "POST",
        data,
      },
    ),
  updateGuideline: (id: string, data: Partial<Guideline>) =>
    request<{ success: boolean; message: string; data: Guideline }>(
      `/api/guidelines/${id}`,
      {
        method: "PUT",
        data,
      },
    ),
  deleteGuideline: (id: string) =>
    request<{ success: boolean; message: string }>(`/api/guidelines/${id}`, {
      method: "DELETE",
    }),

  // Announcements
  getAnnouncements: (templeId?: string) =>
    request<{ success: boolean; count: number; data: Announcement[] }>(
      `/api/announcements${templeId ? `?templeId=${templeId}` : ""}`,
    ),
  createAnnouncement: (data: Partial<Announcement>) =>
    request<{ success: boolean; message: string; data: Announcement }>(
      "/api/announcements",
      {
        method: "POST",
        data,
      },
    ),
  updateAnnouncement: (id: string, data: Partial<Announcement>) =>
    request<{ success: boolean; message: string; data: Announcement }>(
      `/api/announcements/${id}`,
      {
        method: "PUT",
        data,
      },
    ),
  deleteAnnouncement: (id: string) =>
    request<{ success: boolean; message: string }>(`/api/announcements/${id}`, {
      method: "DELETE",
    }),

  // Favorites
  getFavorites: () =>
    request<{ success: boolean; count: number; data: Favorite[] }>(
      "/api/favorites",
    ),
  addFavorite: (payload: {
    itemType: string;
    itemId: string;
    title: string;
    details?: string;
  }) =>
    request<{ success: boolean; message: string; data: Favorite }>(
      "/api/favorites",
      {
        method: "POST",
        data: payload,
      },
    ),
  removeFavorite: (itemId: string) =>
    request<{ success: boolean; message: string }>(`/api/favorites/${itemId}`, {
      method: "DELETE",
    }),

  // Contact
  sendContactMessage: (payload: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }) =>
    request<{ success: boolean; message: string; data: ContactMessage }>(
      "/api/contact",
      {
        method: "POST",
        data: payload,
      },
    ),

  // Admin
  getAdminMessages: () =>
    request<{ success: boolean; count: number; data: ContactMessage[] }>(
      "/api/contact",
    ),
  updateMessageStatus: (id: string, status: "New" | "Read" | "Resolved") =>
    request<{ success: boolean; message: string; data: ContactMessage }>(
      `/api/contact/${id}/status`,
      {
        method: "PUT",
        data: { status },
      },
    ),
  deleteMessage: (id: string) =>
    request<{ success: boolean; message: string }>(`/api/contact/${id}`, {
      method: "DELETE",
    }),
  getAdminStats: () =>
    request<{ success: boolean; data: Record<string, number> }>(
      "/api/admin/stats",
    ),
  getAdminUsers: () =>
    request<{ success: boolean; count: number; data: User[] }>(
      "/api/admin/users",
    ),

  // Pooja / Seva Bookings
  getBookings: (params?: { userId?: string; templeId?: string }) => {
    const qParts: string[] = [];
    if (params?.userId)
      qParts.push(`userId=${encodeURIComponent(params.userId)}`);
    if (params?.templeId)
      qParts.push(`templeId=${encodeURIComponent(params.templeId)}`);
    const qs = qParts.length ? `?${qParts.join("&")}` : "";
    return request<{ success: boolean; count: number; data: Booking[] }>(
      `/api/bookings${qs}`,
    );
  },
  getBookingById: (idOrBookingId: string) =>
    request<{ success: boolean; data: Booking }>(
      `/api/bookings/${encodeURIComponent(idOrBookingId)}`,
    ),
  createBooking: (payload: Partial<Booking>) =>
    request<{ success: boolean; message: string; data: Booking }>(
      "/api/bookings",
      {
        method: "POST",
        data: payload,
      },
    ),
  cancelBooking: (id: string) =>
    request<{ success: boolean; message: string; data: Booking }>(
      `/api/bookings/${id}/cancel`,
      {
        method: "PUT",
      },
    ),

  // Temple Calendar Events
  getCalendarEvents: (params?: {
    templeId?: string;
    date?: string;
    month?: string;
  }) => {
    const qParts: string[] = [];
    if (params?.templeId && params.templeId !== "all")
      qParts.push(`templeId=${encodeURIComponent(params.templeId)}`);
    if (params?.date) qParts.push(`date=${encodeURIComponent(params.date)}`);
    if (params?.month) qParts.push(`month=${encodeURIComponent(params.month)}`);
    const qs = qParts.length ? `?${qParts.join("&")}` : "";
    return request<{ success: boolean; count: number; data: CalendarEvent[] }>(
      `/api/calendar-events${qs}`,
    );
  },
  createCalendarEvent: (payload: Partial<CalendarEvent>) =>
    request<{ success: boolean; message: string; data: CalendarEvent }>(
      "/api/calendar-events",
      {
        method: "POST",
        data: payload,
      },
    ),
  updateCalendarEvent: (id: string, payload: Partial<CalendarEvent>) =>
    request<{ success: boolean; message: string; data: CalendarEvent }>(
      `/api/calendar-events/${id}`,
      {
        method: "PUT",
        data: payload,
      },
    ),
  deleteCalendarEvent: (id: string) =>
    request<{ success: boolean; message: string }>(
      `/api/calendar-events/${id}`,
      {
        method: "DELETE",
      },
    ),

  // Visitor Trip Planner
  getVisitPlans: (userId?: string) =>
    request<{ success: boolean; count: number; data: VisitPlan[] }>(
      `/api/visit-plans${userId ? `?userId=${encodeURIComponent(userId)}` : ""}`,
    ),
  getVisitPlanById: (id: string) =>
    request<{ success: boolean; data: VisitPlan }>(`/api/visit-plans/${id}`),
  createVisitPlan: (payload: any) =>
    request<{ success: boolean; message: string; data: VisitPlan }>(
      "/api/visit-plans",
      {
        method: "POST",
        data: payload,
      },
    ),
  deleteVisitPlan: (id: string) =>
    request<{ success: boolean; message: string }>(`/api/visit-plans/${id}`, {
      method: "DELETE",
    }),

  // Feedback & Ratings
  getFeedback: (templeId?: string) =>
    request<{ success: boolean; count: number; data: Feedback[] }>(
      `/api/feedback${templeId ? `?templeId=${encodeURIComponent(templeId)}` : ""}`,
    ),
  getFeedbackStats: () =>
    request<{
      success: boolean;
      data: {
        averageRating: number;
        totalCount: number;
        usefulPercent: number;
        breakdown: Record<number, number>;
      };
    }>("/api/feedback/stats"),
  createFeedback: (payload: Partial<Feedback>) =>
    request<{ success: boolean; message: string; data: Feedback }>(
      "/api/feedback",
      {
        method: "POST",
        data: payload,
      },
    ),
};
