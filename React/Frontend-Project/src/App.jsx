import { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';

import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase/config';
import { setUser } from './store/authSlice';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import AdminDashboard from './pages/AdminDashboard';
import AdminAttendance from './pages/AdminAttendance';
import AdminPayments from './pages/AdminPayments';
import AdminTrainers from './pages/AdminTrainers';
import MemberDashboard from './pages/MemberDashboard';
import MemberAIPlanner from './pages/MemberAIPlanner';
import MemberBilling from './pages/MemberBilling';
import MemberBookTrainer from './pages/MemberBookTrainer';
import MemberProgress from './pages/MemberProgress';
import NotificationSettings from './pages/NotificationSettings';
import WorkoutVideos from './pages/WorkoutVideos';
import Leaderboard from './pages/Leaderboard';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import AdminPlans from './pages/AdminPlans';
import AdminSidebar from './components/AdminSidebar';

function App() {
  const { user, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch the user's document from Firestore
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        let userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          isAdmin: false,
          plan: 'none'
        };

        if (userDocSnap.exists()) {
           userData = { ...userData, ...userDocSnap.data() };
        }

        dispatch(setUser({
          ...userData,
          role: (userData.isAdmin || firebaseUser.email?.toLowerCase() === 'aryan23@gmail.com') ? 'admin' : 'member' 
        }));
      } else {
        dispatch(setUser(null));
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-admin-darkBg">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const isAdmin = user?.role === 'admin';
  const isAdminRoute = location.pathname.startsWith('/admin') || location.pathname === '/leaderboard';
  
  // ચેક કરીએ કે શું અત્યારે કોઈ ડેશબોર્ડ કે એપ રિલેટેડ પેજ ખુલ્લું છે
  const isDashboardView = 
    location.pathname.startsWith('/admin') || 
    location.pathname.startsWith('/member') || 
    location.pathname === '/leaderboard' || 
    location.pathname === '/workout-videos' || 
    location.pathname === '/notification-settings';

  return (
    <div className={`min-h-screen flex ${isAdmin && isAdminRoute ? 'flex-row' : 'flex-col'} bg-slate-50 dark:bg-admin-darkBg transition-colors duration-300`}>
      <Toaster position="top-right" toastOptions={{ 
        className: 'dark:bg-gray-800 dark:text-white border dark:border-gray-700',
        duration: 3000
      }} />
      
      {isAdmin && isAdminRoute && <AdminSidebar />}

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Navbar />
        
        <main className="flex-grow flex flex-col overflow-y-auto">
          <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-full">
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                {/* Routes... */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/about" 
              element={
                <ProtectedRoute>
                  <About />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/services" 
              element={
                <ProtectedRoute>
                  <Services />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/contact" 
              element={
                <ProtectedRoute>
                  <Contact />
                </ProtectedRoute>
              } 
            />
            
            <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" replace />} />
            <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to="/" replace />} />
            
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
              path="/admin-attendance" 
              element={
                <ProtectedRoute allowedRole="admin">
                  <AdminAttendance />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/admin-payments" 
              element={
                <ProtectedRoute allowedRole="admin">
                  <AdminPayments />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/admin-trainers" 
              element={
                <ProtectedRoute allowedRole="admin">
                  <AdminTrainers />
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

            <Route
              path="/member-ai-planner"
              element={
                <ProtectedRoute allowedRole="member">
                  <MemberAIPlanner />
                </ProtectedRoute>
              }
            />

            <Route
              path="/member-billing"
              element={
                <ProtectedRoute allowedRole="member">
                  <MemberBilling />
                </ProtectedRoute>
              }
            />

            <Route
              path="/member-book-trainer"
              element={
                <ProtectedRoute allowedRole="member">
                  <MemberBookTrainer />
                </ProtectedRoute>
              }
            />

            <Route
              path="/member-progress"
              element={
                <ProtectedRoute allowedRole="member">
                  <MemberProgress />
                </ProtectedRoute>
              }
            />

            <Route
              path="/notification-settings"
              element={
                <ProtectedRoute allowedRole="member">
                  <NotificationSettings />
                </ProtectedRoute>
              }
            />

            <Route
              path="/workout-videos"
              element={
                <ProtectedRoute allowedRole="member">
                  <WorkoutVideos />
                </ProtectedRoute>
              }
            />

            <Route
              path="/leaderboard"
              element={
                <ProtectedRoute>
                  <Leaderboard />
                </ProtectedRoute>
              }
            />

            <Route path="/register" element={!user ? <Register /> : <Navigate to="/" replace />} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
          </div>
      </main>

      {/* ફક્ત પબ્લિક પેજીસ પર જ ફૂટર બતાવો */}
      {!isDashboardView && <Footer />}
      </div>
    </div>
  );
}

export default App;
