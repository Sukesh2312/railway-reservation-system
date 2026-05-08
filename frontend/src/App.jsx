import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/user/HomePage";
import LoginPage from "./pages/user/LoginPage";
import RegisterPage from "./pages/user/RegisterPage";
import SearchTrainsPage from "./pages/user/SearchTrainsPage";
import TrainDetailsPage from "./pages/user/TrainDetailsPage";
import SeatAvailabilityPage from "./pages/user/SeatAvailabilityPage";
import TicketBookingPage from "./pages/user/TicketBookingPage";
import PaymentPage from "./pages/user/PaymentPage";
import BookingSuccessPage from "./pages/user/BookingSuccessPage";
import MyBookingsPage from "./pages/user/MyBookingsPage";
import TicketCancellationPage from "./pages/user/TicketCancellationPage";
import UserProfilePage from "./pages/user/UserProfilePage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AddTrainPage from "./pages/admin/AddTrainPage";
import ManageTrainsPage from "./pages/admin/ManageTrainsPage";
import ManageUsersPage from "./pages/admin/ManageUsersPage";
import ReportsPage from "./pages/admin/ReportsPage";
import SeatPredictionDashboard from "./pages/admin/SeatPredictionDashboard";
import PlatformAssignmentDashboard from "./pages/admin/PlatformAssignmentDashboard";
import CongestionMonitoringDashboard from "./pages/admin/CongestionMonitoringDashboard";
import BookingAnalyticsDashboard from "./pages/admin/BookingAnalyticsDashboard";

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/search" element={<SearchTrainsPage />} />
        <Route path="/trains/:id" element={<TrainDetailsPage />} />
        <Route path="/seat-availability/:id" element={<SeatAvailabilityPage />} />
        <Route path="/book/:id" element={<ProtectedRoute><TicketBookingPage /></ProtectedRoute>} />
        <Route path="/payment/:bookingId" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
        <Route path="/booking-success/:pnr" element={<ProtectedRoute><BookingSuccessPage /></ProtectedRoute>} />
        <Route path="/my-bookings" element={<ProtectedRoute><MyBookingsPage /></ProtectedRoute>} />
        <Route path="/cancel/:bookingId" element={<ProtectedRoute><TicketCancellationPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly><AdminDashboardPage /></ProtectedRoute>} />
        <Route path="/admin/add-train" element={<ProtectedRoute adminOnly><AddTrainPage /></ProtectedRoute>} />
        <Route path="/admin/manage-trains" element={<ProtectedRoute adminOnly><ManageTrainsPage /></ProtectedRoute>} />
        <Route path="/admin/manage-users" element={<ProtectedRoute adminOnly><ManageUsersPage /></ProtectedRoute>} />
        <Route path="/admin/reports" element={<ProtectedRoute adminOnly><ReportsPage /></ProtectedRoute>} />
        <Route path="/admin/seat-prediction" element={<ProtectedRoute adminOnly><SeatPredictionDashboard /></ProtectedRoute>} />
        <Route path="/admin/platform-assignment" element={<ProtectedRoute adminOnly><PlatformAssignmentDashboard /></ProtectedRoute>} />
        <Route path="/admin/congestion" element={<ProtectedRoute adminOnly><CongestionMonitoringDashboard /></ProtectedRoute>} />
        <Route path="/admin/booking-analytics" element={<ProtectedRoute adminOnly><BookingAnalyticsDashboard /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}
