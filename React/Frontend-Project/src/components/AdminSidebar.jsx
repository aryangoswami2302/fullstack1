import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useSelector } from 'react-redux';
import { 
  FaTachometerAlt, 
  FaClipboardList, 
  FaQrcode,
  FaUserTie,
  FaTrophy,
  FaChevronLeft,
  FaChevronRight,
  FaMoneyBillAlt,
  FaSignOutAlt
} from 'react-icons/fa';

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  const menuItems = [
    { name: 'Dashboard', path: '/admin-dashboard', icon: <FaTachometerAlt /> },
    { name: 'Manage Plans', path: '/admin-plans', icon: <FaClipboardList /> },
    { name: 'Payments', path: '/admin-payments', icon: <FaMoneyBillAlt /> },
    { name: 'Attendance', path: '/admin-attendance', icon: <FaQrcode /> },
    { name: 'Trainers', path: '/admin-trainers', icon: <FaUserTie /> },
    { name: 'Leaderboard', path: '/leaderboard', icon: <FaTrophy /> },
  ];

  return (
    <aside className={`h-screen sticky top-0 left-0 bg-slate-900 text-white transition-all duration-300 flex flex-col z-[60] shadow-2xl ${collapsed ? 'w-20' : 'w-72'}`}>
      {/* Brand Header */}
      <div className="p-6 flex justify-between items-center border-b border-white/10 mb-4">
        {!collapsed && (
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl text-white">G</div>
            <span className="font-black text-xl tracking-tight italic text-white">GYM <span className="text-blue-500">PRO</span></span>
          </div>
        )}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className={`p-2 rounded-xl bg-white/5 hover:bg-blue-600 transition-all text-white shadow-lg ${collapsed ? 'mx-auto' : ''}`}
        >
          {collapsed ? <FaChevronRight /> : <FaChevronLeft />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
        {!collapsed && <p className="px-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Admin Panel</p>}
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center px-4 py-3.5 rounded-2xl transition-all duration-300 group relative
              ${isActive 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40' 
                : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }
            `}
          >
            <span className={`text-xl ${collapsed ? 'mx-auto' : 'mr-4'}`}>
              {item.icon}
            </span>
            {!collapsed && <span className="font-bold text-sm tracking-wide">{item.name}</span>}
            
            {collapsed && (
              <div className="absolute left-20 bg-slate-800 text-white px-3 py-1 rounded-md text-xs opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[70] shadow-xl">
                {item.name}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer / Profile */}
      <div className="p-4 mt-auto border-t border-white/10 bg-black/20">
        {collapsed ? (
           <button onClick={handleLogout} className="w-12 h-12 flex items-center justify-center mx-auto text-red-400 hover:bg-red-500/10 rounded-2xl transition-colors">
              <FaSignOutAlt className="text-xl" />
           </button>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 p-2 rounded-2xl bg-white/5 border border-white/10">
               <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-xl font-bold">
                  {user?.email?.charAt(0).toUpperCase() || 'A'}
               </div>
               <div className="flex flex-col min-w-0">
                  <span className="text-sm font-bold truncate">{user?.email?.split('@')[0]}</span>
                  <span className="text-[10px] text-blue-400 font-bold uppercase tracking-tighter">Admin</span>
               </div>
            </div>
            <button 
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full py-3 bg-red-500/10 hover:bg-red-600 text-red-500 hover:text-white rounded-2xl font-bold text-xs transition-all border border-red-500/20"
            >
              <FaSignOutAlt /> Sign Out
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default AdminSidebar;
