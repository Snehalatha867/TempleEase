import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { SearchModal } from './components/common/SearchModal';
import { QrScannerModal } from './components/common/QrScannerModal';

// Pages
import { HomePage } from './pages/HomePage';
import { ExploreTemplesPage } from './pages/ExploreTemplesPage';
import { TempleDetailPage } from './pages/TempleDetailPage';
import { AboutPage } from './pages/AboutPage';
import { TimingsSchedulePage } from './pages/TimingsSchedulePage';
import { PoojaPage } from './pages/PoojaPage';
import { FacilitiesPage } from './pages/FacilitiesPage';
import { ParkingPage } from './pages/ParkingPage';
import { EmergencyPage } from './pages/EmergencyPage';
import { HospitalsPage } from './pages/HospitalsPage';
import { GuidelinesPage } from './pages/GuidelinesPage';
import { MapPage } from './pages/MapPage';
import { QrPage } from './pages/QrPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

// 6 Core Pilgrim Service Enhancements
import { PoojaBookingPage } from './pages/PoojaBookingPage';
import { TempleCalendarPage } from './pages/TempleCalendarPage';
import { VisitorPlannerPage } from './pages/VisitorPlannerPage';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { FavouritesPage } from './pages/FavouritesPage';
import { FeedbackPage } from './pages/FeedbackPage';

// Scroll to top helper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export default function App() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [scanQrOpen, setScanQrOpen] = useState(false);

  return (
    <AuthProvider>
      <LanguageProvider>
        <BrowserRouter>
          <ScrollToTop />
          <div className="min-h-screen flex flex-col bg-[#FAF7F2] text-[#241F1A]">
            
            {/* Navigation Bar with Language Switcher & Service Dropdown */}
            <Navbar 
              onOpenSearch={() => setSearchOpen(true)}
              onOpenScanQr={() => setScanQrOpen(true)}
            />

            {/* Global Search Modal */}
            <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

            {/* Quick QR Scanner & Temple Selector Modal */}
            <QrScannerModal isOpen={scanQrOpen} onClose={() => setScanQrOpen(false)} />

            {/* Main Content Area */}
            <main className="grow">
              <Routes>
                {/* Home & Directory */}
                <Route path="/" element={<HomePage onOpenSearch={() => setSearchOpen(true)} onOpenScanQr={() => setScanQrOpen(true)} />} />
                <Route path="/temples" element={<ExploreTemplesPage />} />
                <Route path="/temples/:id" element={<TempleDetailPage />} />
                <Route path="/temple" element={<Navigate to="/temples/tirumala-venkateswara" replace />} />

                {/* 6 Key Pilgrim Features */}
                <Route path="/booking" element={<PoojaBookingPage />} />
                <Route path="/bookings" element={<PoojaBookingPage />} />
                <Route path="/bookings/:id" element={<PoojaBookingPage />} />
                <Route path="/calendar" element={<TempleCalendarPage />} />
                <Route path="/planner" element={<VisitorPlannerPage />} />
                <Route path="/plan" element={<VisitorPlannerPage />} />
                <Route path="/announcements" element={<AnnouncementsPage />} />
                <Route path="/favourites" element={<FavouritesPage />} />
                <Route path="/favorites" element={<FavouritesPage />} />
                <Route path="/feedback" element={<FeedbackPage />} />

                {/* Additional Pilgrim Services */}
                <Route path="/timings" element={<TimingsSchedulePage />} />
                <Route path="/poojas" element={<PoojaPage />} />
                <Route path="/facilities" element={<FacilitiesPage />} />
                <Route path="/parking" element={<ParkingPage />} />
                <Route path="/emergency" element={<EmergencyPage />} />
                <Route path="/hospitals" element={<HospitalsPage />} />
                <Route path="/guidelines" element={<GuidelinesPage />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/qr" element={<QrPage />} />
                
                {/* Institutional & Contact */}
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />

                {/* Auth & User */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/admin/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/admin" element={<AdminDashboardPage />} />
                <Route path="/admin/dashboard" element={<AdminDashboardPage />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>

            {/* Dignified Institutional Footer matching Reference Footer */}
            <Footer />
          </div>
        </BrowserRouter>
      </LanguageProvider>
    </AuthProvider>
  );
}
