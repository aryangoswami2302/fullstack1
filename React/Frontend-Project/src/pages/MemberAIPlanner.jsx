import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FaDumbbell, FaUtensils, FaRobot, FaMagic, FaHistory, FaPlusCircle } from 'react-icons/fa';
import { generateWorkoutPlan } from '../services/aiService';
import { db } from '../firebase';
import { collection, addDoc, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import toast from 'react-hot-toast';

const MemberAIPlanner = () => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [plans, setPlans] = useState([]);
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    goal: 'Muscle Gain',
    experience: 'Beginner',
    gender: 'Male'
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchSavedPlans();
  }, [user]);

  const fetchSavedPlans = async () => {
    if (!user) return;
    try {
      const userId = user.uid || user.id;
      if (!userId) {
        console.error("User ID is still undefined");
        return;
      }
      const q = query(
        collection(db, 'ai_plans'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(5)
      );
      const querySnapshot = await getDocs(q);
      const plansList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPlans(plansList);
    } catch (error) {
      console.error("Error fetching plans:", error);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const planText = await generateWorkoutPlan(formData);
      
      // Save to Firebase
      const userId = user.uid || user.id;
      const docRef = await addDoc(collection(db, 'ai_plans'), {
        userId: userId,
        ...formData,
        plan: planText,
        createdAt: new Date().toISOString()
      });

      toast.success('Your AI Plan is ready!');
      setPlans([{ id: docRef.id, plan: planText, ...formData }, ...plans]);
      setShowForm(false);
    } catch (error) {
      toast.error(error.message || 'Failed to generate plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <FaRobot className="text-blue-600" /> AI Personal Trainer
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Get professional workout and diet plans tailored specifically for you using Gemini AI.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/30"
        >
          {showForm ? 'View History' : <><FaPlusCircle /> Generate New Plan</>}
        </button>
      </div>

      {showForm ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700"
        >
          <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Age</label>
              <input
                type="number"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Weight (kg)</label>
              <input
                type="number"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Height (cm)</label>
              <input
                type="number"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Gender</label>
              <select
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Goal</label>
              <select
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={formData.goal}
                onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
              >
                <option value="Muscle Gain">Muscle Gain</option>
                <option value="Weight Loss">Weight Loss</option>
                <option value="Tone & Shape">Tone & Shape</option>
                <option value="Endurance">Endurance</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Experience</label>
              <select
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div className="md:col-span-3 mt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating your master plan...
                  </span>
                ) : (
                  <><FaMagic /> Generate My Plan</>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      ) : (
        <div className="space-y-8">
          {plans.length === 0 ? (
            <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
              <FaRobot className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">No plans generated yet. Let's create your first one!</p>
            </div>
          ) : (
            plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-8 shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-bl-3xl">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                    {new Date(plan.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-4 mb-8">
                  <div className="bg-slate-100 dark:bg-slate-700 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                    <span className="text-gray-500">Goal:</span> {plan.goal}
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-700 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                    <span className="text-gray-500">BMI Context:</span> {plan.weight}kg / {plan.height}cm
                  </div>
                </div>

                <div className="prose prose-blue dark:prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                    {plan.plan}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MemberAIPlanner;
