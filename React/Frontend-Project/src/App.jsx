import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import MemberDashboard from './pages/MemberDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import AdminPlans from './pages/AdminPlans';

function App() {
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-admin-darkBg transition-colors duration-300">
      <Toaster position="top-right" toastOptions={{ 
        className: 'dark:bg-gray-800 dark:text-white border dark:border-gray-700',
        duration: 3000
      }} />
      <Navbar />
      
      <main className="flex-grow flex flex-col pt-8 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            
            <Route 
              path="/login" 
              element={!user ? <Login /> : <Navigate to={user.role === 'admin' ? '/admin-dashboard' : '/member-dashboard'} replace />} 
            />
            
            {/* Protected Routes */}
            <Route 
              path="/admin-dashboard" 
              element={
                <ProtectedRoute allowedRole="admin">
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/admin-plans" 
              element={
                <ProtectedRoute allowedRole="admin">
                  <AdminPlans />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/member-dashboard" 
              element={
                <ProtectedRoute allowedRole="member">
                  <MemberDashboard />
                </ProtectedRoute>
              } 
            />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

export default App;
