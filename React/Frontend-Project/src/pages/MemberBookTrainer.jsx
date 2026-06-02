import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { db } from '../firebase';
import { collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { FaUserTie, FaCalendarCheck, FaClock, FaStar, FaHistory, FaCheckCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const MemberBookTrainer = () => {
  const { user } = useSelector((state) => state.auth);
  const [trainers, setTrainers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const trainersSnap = await getDocs(collection(db, 'trainers'));
      setTrainers(trainersSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

      if (user) {
        const userId = user.uid || user.id;
        const bookingsQ = query(
          collection(db, 'bookings'),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        );
        const bookingsSnap = await getDocs(bookingsQ);
        setBookings(bookingsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBook = async (trainer) => {
    try {
      const userId = user.uid || user.id;
      await addDoc(collection(db, 'bookings'), {
        userId: userId,
        userName: user.name || user.email.split('@')[0],
        trainerId: trainer.id,
        trainerName: trainer.name,
        time: trainer.availability,
        status: 'Confirmed',
        createdAt: new Date().toISOString()
      });
      toast.success(`Slot booked with ${trainer.name}!`);
      fetchData();
    } catch (error) {
      toast.error('Booking failed');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <FaCalendarCheck className="text-blue-600" /> Book a Trainer
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Choose a professional to guide your fitness journey.</p>
        </div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-200 transition-all"
        >
          {showHistory ? 'View Trainers' : <><FaHistory /> My Bookings</>}
        </button>
      </div>

      <AnimatePresence mode="wait">
        {showHistory ? (
          <motion.div
            key="history"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {bookings.length === 0 ? (
              <div className="text-center py-20 text-gray-400">No bookings yet.</div>
            ) : (
              bookings.map((booking) => (
                <div key={booking.id} className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full text-green-600">
                      <FaCheckCircle />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">{booking.trainerName}</h4>
                      <p className="text-xs text-gray-500">{booking.time}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </motion.div>
        ) : (
          <motion.div
            key="trainers"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {trainers.map((trainer) => (
              <div key={trainer.id} className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 shadow-xl border border-gray-100 dark:border-gray-700 hover:-translate-y-2 transition-all duration-300">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-3xl flex items-center justify-center text-2xl font-black shadow-lg shadow-blue-500/30">
                    {trainer.name.charAt(0)}
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-3 py-1 rounded-full">
                    <FaStar className="text-yellow-400 text-xs" />
                    <span className="text-xs font-bold text-yellow-700 dark:text-yellow-500">{trainer.rating}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{trainer.name}</h3>
                <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-[0.2em] mb-6">{trainer.specialty}</p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <FaClock className="text-blue-500" />
                    <span className="font-medium">{trainer.availability}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <FaUserTie className="text-blue-500" />
                    <span className="font-medium">{trainer.experience} Years Exp.</span>
                  </div>
                </div>

                <button
                  onClick={() => handleBook(trainer)}
                  className="w-full bg-slate-900 dark:bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95"
                >
                  Book This Slot
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MemberBookTrainer;
