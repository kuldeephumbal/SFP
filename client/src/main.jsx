import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css';
import './i18n';
import App from './App';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ScrollToTop from './components/ScrollToTop';
import Dashboard from './pages/admin/Dashboard';
import Settings from './pages/admin/Settings';
import Login from './pages/user/Login';
import MemberApplication from './pages/admin/MemberApplication';
import Slider from './pages/admin/Slider';
import RecentActivity from './pages/admin/RecentActivity';
import LatestActivity from './pages/admin/LatestActivity';
import YoutubeVideos from './pages/admin/YoutubeVideos';
import Member from './pages/admin/Member';
import UpcomingEvent from './pages/admin/UpcomingEvent';
import Profile from './pages/admin/Profile';
import UserLandingPage from './pages/user/index';
import MemberApply from './pages/user/MemberApply';
import Donate from './pages/user/Donate';
import UpcomingEvents from './pages/user/UpcomingEvents';
import ListOfDonor from './pages/user/ListOfDonor';
import Gallery from './pages/user/Gallery';
import LatestActivityDetail from './pages/user/LatestActivityDetail';
import AdminGallery from './pages/admin/Gallery';
import AdminCrowdFunding from './pages/admin/CrowdFunding';
import AdminProblem from './pages/admin/ProblemRaised';
import AdminOurProjects from './pages/admin/OurProjects';
import AdminDonation from './pages/admin/Donation';
import AdminEnquiry from './pages/admin/Enquiry';
import AdminAchievements from './pages/admin/Achievements';
import ContactUs from './pages/user/ContactUs';
import AboutUs from './pages/user/AboutUs';
import OurTeam from './pages/user/OurTeam';
import Achievements from './pages/user/Achievements';
import CrowdFunding from './pages/user/CrowdFunding';
import YourProblem from './pages/user/YourProblem';
import OurProjects from './pages/user/OurProjects';
import TermsAndConditions from './pages/user/TermsAndConditions';
import PrivacyPolicy from './pages/user/PrivacyPolicy';
import Disclaimer from './pages/user/Disclaimer';
import RefundPolicy from './pages/user/RefundPolicy';
import NotFound from './pages/user/NotFound';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <ToastContainer position="top-right" autoClose={3000} theme="colored" />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<UserLandingPage />} />
        <Route path="/home" element={<UserLandingPage />} />
        <Route path="/member-apply" element={<MemberApply />} />
        <Route path="/upcoming-events" element={<UpcomingEvents />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/donors" element={<ListOfDonor />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/our-team" element={<OurTeam />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/crowdfunding" element={<CrowdFunding />} />
        <Route path="/your-problems" element={<YourProblem />} />
        <Route path="/projects" element={<OurProjects />} />
        <Route path="/terms" element={<TermsAndConditions />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/refund" element={<RefundPolicy />} />
        <Route path="/latest-activity/:id" element={<LatestActivityDetail />} />

        {/* Catch-all route for any other public pages */}
        <Route path="*" element={<Navigate to="/404" replace />} />
        <Route path="/404" element={<NotFound />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/user-login" element={<Login />} />
        <Route path="/settings" element={<Navigate to="/admin/settings" replace />} />

        {/* Admin Routes */}
        <Route path="/admin/*" element={<App>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="member-applications" element={<MemberApplication />} />
            <Route path="member" element={<Member />} />
            <Route path="slider" element={<Slider />} />
            <Route path="recent-activity" element={<RecentActivity />} />
            <Route path="latest-activity" element={<LatestActivity />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="youtube-videos" element={<YoutubeVideos />} />
            <Route path="upcoming-event" element={<UpcomingEvent />} />
            <Route path="crowd-funding" element={<AdminCrowdFunding />} />
            <Route path="problem-raised" element={<AdminProblem />} />
            <Route path="our-project" element={<AdminOurProjects />} />
            <Route path="donations" element={<AdminDonation />} />
            <Route path="enquiry" element={<AdminEnquiry />} />
            <Route path="achievements" element={<AdminAchievements />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </App>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);