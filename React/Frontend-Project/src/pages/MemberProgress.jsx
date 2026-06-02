import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { FaWeight, FaRulerVertical, FaChartLine, FaPlus, FaHistory } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import toast from 'react-hot-toast';

const MemberProgress = () => {
  const { user } = useSelector((state) => state.auth);
  const [history, setHistory] = useState([]);
  const [formData, setFormData] = useState({
    weight: '',
    chest: '',
    waist: '',
    arms: '',
  });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const fetchHistory = async () => {
    if (!user) return;
    try {
      const userId = user.uid || user.id;
      const q = query(
        collection(db, 'member_progress'),
        where('userId', '==', userId),
        orderBy('date', 'asc')
      );
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Format date for chart
        dateFormatted: new Date(doc.data().date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      }));
      setHistory(data);
    } catch (error) {
      console.error("Error fetching progress:", error);
    } finally {
      // Done
    }
  };

  const handleAddProgress = async (e) => {
    e.preventDefault();
    try {
      const userId = user.uid || user.id;
      const newLog = {
        userId: userId,
        ...formData,
        weight: parseFloat(formData.weight),
        date: new Date().toISOString(),
      };
      await addDoc(collection(db, 'member_progress'), newLog);
      toast.success('Progress logged successfully!');
      setFormData({ weight: '', chest: '', waist: '', arms: '' });
      setShowAddForm(false);
      fetchHistory();
    } catch (error) {
      toast.error('Failed to log progress');
    }
  };


  const latestWeight = history.length > 0 ? history[history.length - 1].weight : '--';
  
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <FaChartLine className="text-indigo-600" /> My Fitness Journey
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Track your body transformation over time.</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/30"
        >
          <FaPlus /> {showAddForm ? 'Cancel' : 'Log Progress'}
        </button>
      </div>

      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-3xl p-8 mb-8 shadow-xl border border-gray-100 dark:border-gray-700"
        >
          <form onSubmit={handleAddProgress} className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Weight (kg)</label>
              <input
                type="number" step="0.1" required
                className="w-full px-4 py-3 rounded-xl border dark:bg-gray-700 dark:text-white dark:border-gray-600 outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Chest (inches)</label>
              <input
                type="number" step="0.1"
                className="w-full px-4 py-3 rounded-xl border dark:bg-gray-700 dark:text-white dark:border-gray-600 outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.chest}
                onChange={(e) => setFormData({ ...formData, chest: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Waist (inches)</label>
              <input
                type="number" step="0.1"
                className="w-full px-4 py-3 rounded-xl border dark:bg-gray-700 dark:text-white dark:border-gray-600 outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.waist}
                onChange={(e) => setFormData({ ...formData, waist: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Arms (inches)</label>
              <input
                type="number" step="0.1"
                className="w-full px-4 py-3 rounded-xl border dark:bg-gray-700 dark:text-white dark:border-gray-600 outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.arms}
                onChange={(e) => setFormData({ ...formData, arms: e.target.value })}
              />
            </div>
            <div className="md:col-span-4">
              <button type="submit" className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all">
                Save Progress Log
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Card */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 shadow-xl border border-gray-100 dark:border-gray-700">
          <h3 className="text-xl font-black text-gray-800 dark:text-white mb-6 uppercase tracking-tight">Weight Trend</h3>
          <div className="h-[400px] w-full">
            {history.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history}>
                  <defs>
                    <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="dateFormatted" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} domain={['auto', 'auto']} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Area type="monotone" dataKey="weight" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorWeight)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400">
                Log your first weight to see the trend.
              </div>
            )}
          </div>
        </div>

        {/* Stats Column */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] p-8 text-white shadow-xl">
            <FaWeight className="text-4xl mb-4 opacity-50" />
            <p className="text-sm font-bold uppercase tracking-widest opacity-80">Latest Weight</p>
            <h2 className="text-5xl font-black mt-1">{latestWeight} <span className="text-2xl opacity-60">kg</span></h2>
            <div className="mt-6 pt-6 border-t border-white/10 flex justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase opacity-60">Total Change</p>
                <p className="font-bold text-lg">
                  {history.length > 1 ? (history[history.length-1].weight - history[0].weight).toFixed(1) : 0} kg
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase opacity-60">Last Log</p>
                <p className="font-bold text-lg">
                  {history.length > 0 ? history[history.length-1].dateFormatted : 'Never'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-[2rem] p-8 shadow-xl border border-gray-100 dark:border-gray-700">
            <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <FaHistory className="text-gray-400" /> Recent Logs
            </h4>
            <div className="space-y-4">
              {history.slice(-3).reverse().map((log, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b last:border-0 border-gray-50 dark:border-gray-700">
                  <div>
                    <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{log.dateFormatted}</p>
                    <p className="text-xs text-gray-500">Weight: {log.weight}kg</p>
                  </div>
                  {log.chest && <span className="text-[10px] bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-md font-bold text-gray-500">C: {log.chest}"</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberProgress;
