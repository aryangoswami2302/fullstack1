import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FaUserCircle, 
  FaCalendarAlt, 
  FaIdCard, 
  FaBatteryFull, 
  FaExclamationTriangle,
  FaChartLine,
  FaWeight,
  FaUsers,
  FaCog,
  FaCheckCircle,
  FaTrophy,
  FaFire,
  FaDumbbell,
  FaUserEdit,
  FaSave,
  FaCheck,
  FaVideo,
  FaCalendarCheck
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { fetchMembers } from '../services/firebaseService';
import { motion, AnimatePresence } from 'framer-motion';
import { db, auth } from '../firebase/config';
import { doc, updateDoc, collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { setUser } from '../store/authSlice';

const MemberDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  // Progress state
  const [weight, setWeight] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Members list state
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Profile update state
  const [newName, setNewName] = useState(user?.name || '');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [attendanceCount, setAttendanceCount] = useState(0);

  useEffect(() => {
    if (user) {
      setNewName(user.name || '');
      fetchAttendance();
    }
  }, [user]);

  const fetchAttendance = async () => {
    if (!user) return;
    try {
      const userId = user.uid || user.id;
      const q = query(
        collection(db, 'attendance'),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      setAttendanceCount(querySnapshot.size);
    } catch (error) {
      console.error("Error fetching attendance:", error);
    }
  };

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const data = await fetchMembers();
        setMembers(data);
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setLoadingMembers(false);
      }
    };
    loadMembers();
  }, []);

  // Fallback values if user data is missing
  const profileName = user?.name || (user?.email ? user.email.split('@')[0] : 'Member');
  const userPlan = user?.plan !== 'none' ? user?.plan : 'No Active Plan';
  
  const isActive = userPlan !== 'No Active Plan';

  const handleSaveProgress = (e) => {
    e.preventDefault();
    if (!weight) return;
    
    setIsSaving(true);
    // Simulate API call for saving progress
    setTimeout(() => {
      setIsSaving(false);
      toast.success('Progress updated successfully!');
      setWeight('');
    }, 800);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;

    setIsUpdatingProfile(true);
    try {
      const userId = user.uid || user.id;
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { name: newName });
      
      // Update state
      dispatch(setUser({ ...user, name: newName }));
      toast.success('Profile name updated!');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const filteredMembers = members.filter(m => 
    (m.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
    (m.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="max-w-6xl mx-auto space-y-8 py-6 px-4"
    >
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white dark:bg-admin-darkCard p-8 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-6">
          <div className="relative">
             <FaUserCircle className="text-7xl text-blue-500/20" />
             <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-black text-blue-600">{profileName.charAt(0)}</span>
             </div>
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Welcome, {profileName}!</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">{user?.email}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider
            ${isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400'}`}>
            {isActive ? <><FaBatteryFull className="mr-1"/> Active</> : <><FaExclamationTriangle className="mr-1"/> Inactive</>}
          </span>
        </div>
      </div>

      {/* Quick Stats Grid - Moving Admin-style cards to User side */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card border-l-4 border-blue-500 flex items-center justify-between p-6">
          <div>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">My Plan</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white mt-1 capitalize">{userPlan}</p>
          </div>
          <FaIdCard className="text-4xl text-blue-100 dark:text-blue-900/20" />
        </div>

        <div className="card border-l-4 border-orange-500 flex items-center justify-between p-6">
          <div>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Gym Visits</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">{attendanceCount} Sessions</p>
          </div>
          <FaFire className="text-4xl text-orange-100 dark:text-orange-900/20" />
        </div>

        <div className="card border-l-4 border-purple-500 flex items-center justify-between p-6">
          <div>
            <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Community Rank</p>
            <p className="text-2xl font-black text-gray-900 dark:text-white mt-1">#--</p>
          </div>
          <FaTrophy className="text-4xl text-purple-100 dark:text-purple-900/20" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Settings */}
        <div className="card p-8 space-y-6">
          <div className="flex items-center gap-3">
            <FaUserEdit className="text-2xl text-blue-500" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Profile Settings</h3>
          </div>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Display Name</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="input-field flex-grow" 
                  placeholder="Enter your name" 
                />
                <button 
                  type="submit" 
                  disabled={isUpdatingProfile}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl font-bold transition-all disabled:opacity-50"
                >
                  {isUpdatingProfile ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <FaSave />}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Progress Tracking Section */}
        <div className="card border-t-4 border-emerald-500 p-8">
          <div className="flex items-center space-x-3 mb-6">
            <FaChartLine className="text-2xl text-emerald-600" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Track Progress</h3>
          </div>
          
          <form onSubmit={handleSaveProgress} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-grow relative">
              <div className="relative">
                <FaWeight className="absolute left-3 top-3.5 text-gray-400" />
                <input 
                  type="number" 
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="input-field pl-10 w-full" 
                  placeholder="Enter current weight (kg)" 
                  required 
                />
              </div>
            </div>
            <button 
              type="submit" 
              disabled={isSaving}
              className="btn-primary sm:w-auto px-8 py-2.5 flex justify-center items-center disabled:opacity-70 whitespace-nowrap"
            >
              {isSaving ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Log Entry'}
            </button>
          </form>
        </div>
      </div>

      {/* Gym Community Section */}
      <div className="card overflow-hidden border-t-4 border-blue-500 p-8">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
            <FaUsers className="mr-2 text-blue-500" /> Gym Community
          </h2>
          
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <input 
              type="text" 
              placeholder="Search members..." 
              className="input-field py-1.5 px-3 min-w-[200px] text-sm w-full"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[200px]">
          {loadingMembers ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b dark:border-gray-700 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="pb-3 px-4 font-semibold">Member</th>
                  <th className="pb-3 px-4 font-semibold text-right">Plan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-sm">
                {filteredMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-semibold text-gray-900 dark:text-white">{m.name || 'Member'}</p>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold border
                        ${m.plan && m.plan !== 'none' 
                          ? 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800' 
                          : 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700'}`}>
                        {m.plan || 'none'}
                      </span>
                    </td>
                  </tr>
                ))}
                {filteredMembers.length === 0 && (
                  <tr>
                    <td colSpan="3" className="py-8 text-center text-gray-500 dark:text-gray-400">
                      {searchTerm ? `No members found matching "${searchTerm}"` : "No members available."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MemberDashboard;
