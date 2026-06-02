import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { FaUserTie, FaPlus, FaTrash, FaPen, FaClock, FaStar } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const AdminTrainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    specialty: 'Weight Loss',
    experience: '',
    availability: 'Morning (6 AM - 10 AM)',
    rating: '5.0'
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'trainers'));
      const list = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTrainers(list);
    } catch (error) {
      toast.error('Failed to fetch trainers');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateDoc(doc(db, 'trainers', editingId), formData);
        toast.success('Trainer updated successfully');
      } else {
        await addDoc(collection(db, 'trainers'), formData);
        toast.success('Trainer added successfully');
      }
      setFormData({ name: '', specialty: 'Weight Loss', experience: '', availability: 'Morning (6 AM - 10 AM)', rating: '5.0' });
      setEditingId(null);
      setShowForm(false);
      fetchTrainers();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await deleteDoc(doc(db, 'trainers', id));
        toast.success('Trainer removed');
        fetchTrainers();
      } catch (error) {
        toast.error('Delete failed');
      }
    }
  };

  const handleEdit = (trainer) => {
    setFormData(trainer);
    setEditingId(trainer.id);
    setShowForm(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <FaUserTie className="text-blue-600" /> Trainer Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your gym's professional trainers.</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditingId(null); }}
          className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2"
        >
          <FaPlus /> {showForm ? 'Cancel' : 'Add Trainer'}
        </button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-3xl p-8 mb-8 shadow-xl border border-gray-100 dark:border-gray-700"
        >
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <input
                required className="input-field"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Specialty</label>
              <select
                className="input-field"
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
              >
                <option value="Weight Loss">Weight Loss</option>
                <option value="Bodybuilding">Bodybuilding</option>
                <option value="Yoga & Flexibility">Yoga & Flexibility</option>
                <option value="Cardio & HIIT">Cardio & HIIT</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Experience (Years)</label>
              <input
                required type="number" className="input-field"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Availability</label>
              <select
                className="input-field"
                value={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
              >
                <option value="Morning (6 AM - 10 AM)">Morning (6 AM - 10 AM)</option>
                <option value="Afternoon (11 AM - 3 PM)">Afternoon (11 AM - 3 PM)</option>
                <option value="Evening (4 PM - 9 PM)">Evening (4 PM - 9 PM)</option>
              </select>
            </div>
            <div className="md:col-span-3">
              <button type="submit" className="w-full btn-primary py-4">
                {editingId ? 'Update Trainer' : 'Save Trainer'}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainers.map((trainer) => (
          <motion.div
            layout
            key={trainer.id}
            className="bg-white dark:bg-gray-800 rounded-[2rem] p-6 shadow-xl border border-gray-100 dark:border-gray-700 relative group"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 text-2xl font-bold">
                {trainer.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{trainer.name}</h3>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">{trainer.specialty}</p>
              </div>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Experience:</span>
                <span className="font-bold">{trainer.experience} Years</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-1"><FaClock className="text-xs" /> Availability:</span>
                <span className="font-bold text-[10px] uppercase text-right">{trainer.availability}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 flex items-center gap-1"><FaStar className="text-yellow-400 text-xs" /> Rating:</span>
                <span className="font-bold">{trainer.rating}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(trainer)}
                className="flex-1 py-2 bg-slate-100 dark:bg-slate-700 rounded-xl text-gray-600 dark:text-gray-300 font-bold text-xs hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(trainer.id)}
                className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all"
              >
                <FaTrash />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminTrainers;
