import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Pages
import Home from "../pages/Home";
import RoomList from "../pages/RoomList";
import RoomDetails from "../pages/RoomDetails";
import Booking from "../pages/Booking";
import Auth from "../pages/Auth";
import AboutUs from "../pages/AboutUs";
import ContactUs from "../pages/ContactUs";
import FAQ from "../pages/FAQ";
import ServicesPage from "../pages/ServicesPage";

// Dashboard / Admin Components
import UserDashboard from "../user/UserDashboard";
import AdminDashboard from "../Admin/AdminDashboard";

// Route Guard: Regular logged-in users
export function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}

// Route Guard: Admin only
export function AdminRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentUser || currentUser.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/rooms" element={<RoomList />} />
      <Route path="/rooms/:id" element={<RoomDetails />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<ContactUs />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/services" element={<ServicesPage />} />

      {/* Protected User Dashboard */}
      <Route 
        path="/dashboard" 
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        } 
      />

      {/* Protected checkout route */}
      <Route 
        path="/booking/:roomId" 
        element={
          <ProtectedRoute>
            <Booking />
          </ProtectedRoute>
        } 
      />

      {/* Protected Admin routes */}
      <Route 
        path="/admin" 
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } 
      />

      {/* Backward Compatibility/Redirects for existing routes */}
      <Route path="/Dashbord" element={<Navigate to="/admin" replace />} />
      <Route path="/roomManage" element={<Navigate to="/admin?tab=rooms" replace />} />
      <Route path="/roomadd" element={<Navigate to="/admin?tab=rooms" replace />} />
      <Route path="/teamManage" element={<Navigate to="/admin?tab=team" replace />} />
      <Route path="/teamadd" element={<Navigate to="/admin?tab=team" replace />} />
      
      {/* 404 Route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
