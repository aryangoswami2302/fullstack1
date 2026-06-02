import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, addDoc, query, where, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import { FaQrcode, FaUserCheck, FaSearch, FaHistory, FaCheckCircle, FaUserCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const AdminAttendance = () => {
  const [members, setMembers] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('manual'); // 'manual' or 'history'

  useEffect(() => {
    fetchMembers();
    fetchRecentLogs();
  }, []);

  const fetchMembers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'members'));
      setMembers(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      toast.error('Failed to load members');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentLogs = async () => {
    try {
      const q = query(
        collection(db, 'attendance'),
        orderBy('timestamp', 'desc'),
        limit(10)
      );
      const querySnapshot = await getDocs(q);
      setRecentLogs(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkAttendance = async (member) => {
    try {
      // Check if already marked today
      const today = new Date();
      today.setHours(0,0,0,0);
      
      await addDoc(collection(db, 'attendance'), {
        userId: member.id,
        userName: member.name,
        timestamp: serverTimestamp(),
        date: today.toISOString()
      });

      toast.success(`Attendance marked for ${member.name}`);
      fetchRecentLogs();
    } catch (error) {
      toast.error('Failed to mark attendance');
    }
  };

  const filteredMembers = members.filter(m => 
    m.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-500/30">
              <FaUserCheck />
            </div>
            Attendance System
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 font-medium">Manage member daily check-ins easily.</p>
        </div>
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
          <button
            onClick={() => setView('manual')}
            className={`px-6 py-2 rounded-xl font-bold transition-all ${view === 'manual' ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-md' : 'text-gray-500'}`}
          >
            Mark Manual
          </button>
          <button
            onClick={() => setView('history')}
            className={`px-6 py-2 rounded-xl font-bold transition-all ${view === 'history' ? 'bg-white dark:bg-gray-700 text-blue-600 shadow-md' : 'text-gray-500'}`}
          >
            Recent Logs
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === 'manual' ? (
          <motion.div
            key="manual"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="relative mb-8">
              <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search member by name or email..."
                className="w-full pl-14 pr-6 py-5 bg-white dark:bg-gray-800 rounded-[2rem] shadow-xl border-none focus:ring-2 focus:ring-blue-500 text-lg outline-none transition-all dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map((member) => (
                <div key={member.id} className="bg-white dark:bg-gray-800 p-6 rounded-[2.5rem] shadow-lg border border-gray-100 dark:border-gray-700 flex items-center justify-between group hover:border-blue-500 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                      <FaUserCircle className="text-2xl" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">{member.name}</h4>
                      <p className="text-xs text-gray-500">{member.plan || 'No Plan'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleMarkAttendance(member)}
                    className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                    title="Mark Attendance"
                  >
                    <FaCheckCircle className="text-xl" />
                  </button>
                </div>
              ))}
              {filteredMembers.length === 0 && (
                <div className="col-span-full text-center py-20 text-gray-400">No members found matching your search.</div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            <div className="p-8 border-b border-gray-100 dark:border-gray-700 bg-slate-50 dark:bg-slate-900/50 font-bold text-xs uppercase tracking-widest text-gray-500">
              Today's Recent Check-ins
            </div>
            <div className="divide-y divide-gray-50 dark:divide-gray-700">
              {recentLogs.length === 0 ? (
                <div className="p-20 text-center text-gray-400">No logs found for today.</div>
              ) : (
                recentLogs.map((log) => (
                  <div key={log.id} className="p-6 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center">
                        <FaUserCheck />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white">{log.userName}</h4>
                        <p className="text-[10px] text-gray-400 uppercase font-black">Checked In</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {log.timestamp?.toDate ? log.timestamp.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminAttendance;
