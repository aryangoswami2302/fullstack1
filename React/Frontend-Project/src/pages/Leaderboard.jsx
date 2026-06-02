import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { FaTrophy, FaMedal, FaCrown, FaFire, FaUserCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Leaderboard = () => {
  const [topMembers, setTopMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      // Note: In a real app, you'd have a 'visits' field on user doc or a cloud function to aggregate.
      // For this demo, we'll aggregate from 'attendance' collection.
      const attendanceSnap = await getDocs(collection(db, 'attendance'));
      const counts = {};
      
      attendanceSnap.forEach(doc => {
        const userId = doc.data().userId;
        counts[userId] = (counts[userId] || 0) + 1;
      });

      // Fetch member names (this is inefficient for large datasets, but works for now)
      const membersSnap = await getDocs(collection(db, 'members')); // Adjust based on where names are
      const memberNames = {};
      membersSnap.forEach(doc => {
        memberNames[doc.id] = doc.data().name;
      });

      const sorted = Object.keys(counts)
        .map(uid => ({
          uid,
          name: memberNames[uid] || `Member ${uid.substring(0, 5)}`,
          visits: counts[uid]
        }))
        .sort((a, b) => b.visits - a.visits)
        .slice(0, 10);

      setTopMembers(sorted);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (index) => {
    switch(index) {
      case 0: return <FaCrown className="text-yellow-400 text-2xl" />;
      case 1: return <FaMedal className="text-slate-300 text-2xl" />;
      case 2: return <FaMedal className="text-orange-400 text-2xl" />;
      default: return <span className="text-gray-400 font-bold w-6 text-center">{index + 1}</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="inline-block p-4 bg-yellow-100 dark:bg-yellow-900/30 rounded-full mb-4"
        >
          <FaTrophy className="text-5xl text-yellow-500" />
        </motion.div>
        <h1 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Hall of Fame</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Recognizing our most dedicated athletes.</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-8 border-b border-gray-100 dark:border-gray-700 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center font-bold text-xs uppercase tracking-[0.2em] text-gray-500">
          <span>Rank & Member</span>
          <span>Visits</span>
        </div>

        <div className="divide-y divide-gray-50 dark:divide-gray-700">
          {topMembers.length === 0 ? (
            <div className="py-20 text-center text-gray-400">Loading the leaderboard...</div>
          ) : (
            topMembers.map((member, index) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={member.uid}
                className={`p-6 flex justify-between items-center transition-colors hover:bg-slate-50 dark:hover:bg-slate-700/30 ${index === 0 ? 'bg-yellow-50/30 dark:bg-yellow-900/10' : ''}`}
              >
                <div className="flex items-center gap-6">
                  <div className="w-10 flex justify-center">
                    {getRankIcon(index)}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-2xl flex items-center justify-center">
                      <FaUserCircle className="text-2xl text-gray-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">{member.name}</h4>
                      {index === 0 && <span className="text-[10px] font-black text-yellow-600 dark:text-yellow-500 uppercase tracking-widest flex items-center gap-1"><FaFire /> Top Performer</span>}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black text-gray-900 dark:text-white">{member.visits}</span>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sessions</p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      <div className="mt-8 text-center bg-blue-50 dark:bg-blue-900/20 p-6 rounded-3xl border border-blue-100 dark:border-blue-900/30">
        <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">
          Top 3 members every month get a <strong>15% Discount</strong> on their next renewal! 🚀
        </p>
      </div>
    </div>
  );
};

export default Leaderboard;
