import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FaBell, FaCheck, FaTimes, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import toast from 'react-hot-toast';
import {
  requestNotificationPermission,
  getNotificationPreferences,
  saveNotificationPreferences,
  sendMotivationalNotification
} from '../services/notificationService';

const NotificationSettings = () => {
  const { user } = useSelector((state) => state.auth);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [preferences, setPreferences] = useState({
    enabled: false,
    workoutReminders: false,
    classReminders: false,
    paymentReminders: false,
    achievements: false,
    newVideos: false,
    motivational: false
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    checkNotificationPermission();
    loadPreferences();
  }, []);

  const checkNotificationPermission = () => {
    if ('Notification' in window) {
      setPermissionGranted(Notification.permission === 'granted');
    }
  };

  const loadPreferences = () => {
    const saved = getNotificationPreferences();
    setPreferences(saved);
  };

  const handleRequestPermission = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      setPermissionGranted(true);
      toast.success('Notifications enabled! 🎉');
      // Send a test notification
      sendMotivationalNotification();
    } else {
      toast.error('Failed to enable notifications');
    }
  };

  const handleTogglePreference = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSavePreferences = async () => {
    setSaving(true);
    try {
      saveNotificationPreferences(preferences);
      toast.success('Notification preferences saved! ✅');
    } catch (error) {
      toast.error('Failed to save preferences');
    } finally {
      setSaving(false);
    }
  };

  const NotificationToggle = ({ label, description, prefKey, icon }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl flex items-center justify-between"
    >
      <div className="flex items-center gap-4">
        <div className="text-2xl text-blue-600">{icon}</div>
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white">{label}</h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
        </div>
      </div>
      <button
        onClick={() => handleTogglePreference(prefKey)}
        disabled={!permissionGranted}
        className={`text-3xl transition-all ${
          preferences[prefKey]
            ? 'text-blue-600'
            : 'text-gray-300 dark:text-gray-600'
        } ${!permissionGranted ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        {preferences[prefKey] ? <FaToggleOn /> : <FaToggleOff />}
      </button>
    </motion.div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3 mb-2">
          <FaBell className="text-blue-600" /> Notification Settings
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Stay updated with your fitness journey. Customize your notification preferences.
        </p>
      </div>

      {/* Permission Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-6 rounded-2xl mb-8 ${
          permissionGranted
            ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800'
            : 'bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`text-3xl ${permissionGranted ? 'text-green-600' : 'text-yellow-600'}`}>
              <FaBell />
            </div>
            <div>
              <h3 className={`font-bold text-lg ${permissionGranted ? 'text-green-800 dark:text-green-200' : 'text-yellow-800 dark:text-yellow-200'}`}>
                {permissionGranted ? '✅ Notifications Enabled' : '⚠️ Notifications Disabled'}
              </h3>
              <p className={`text-sm ${permissionGranted ? 'text-green-700 dark:text-green-300' : 'text-yellow-700 dark:text-yellow-300'}`}>
                {permissionGranted
                  ? 'You will receive notifications for enabled categories below.'
                  : 'Enable notifications to stay updated with reminders and achievements.'}
              </p>
            </div>
          </div>
          {!permissionGranted && (
            <button
              onClick={handleRequestPermission}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap"
            >
              Enable Now
            </button>
          )}
        </div>
      </motion.div>

      {/* Notification Preferences */}
      {permissionGranted ? (
        <>
          <div className="space-y-4 mb-8">
            <NotificationToggle
              label="Workout Reminders"
              description="Get reminded about your scheduled workouts 15 minutes before they start"
              prefKey="workoutReminders"
              icon="⏰"
            />
            <NotificationToggle
              label="Class Notifications"
              description="Be notified when your fitness classes are starting"
              prefKey="classReminders"
              icon="🏋️"
            />
            <NotificationToggle
              label="Payment Reminders"
              description="Get reminded about upcoming membership payments"
              prefKey="paymentReminders"
              icon="💳"
            />
            <NotificationToggle
              label="Achievements"
              description="Celebrate your fitness milestones and achievements"
              prefKey="achievements"
              icon="🎉"
            />
            <NotificationToggle
              label="New Workout Videos"
              description="Be notified when new workout videos are added to the library"
              prefKey="newVideos"
              icon="📹"
            />
            <NotificationToggle
              label="Motivational Messages"
              description="Receive daily motivational quotes to keep you inspired"
              prefKey="motivational"
              icon="💪"
            />
          </div>

          {/* Save Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-4"
          >
            <button
              onClick={handleSavePreferences}
              disabled={saving}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <FaCheck /> {saving ? 'Saving...' : 'Save Preferences'}
            </button>
            <button
              onClick={loadPreferences}
              className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-bold py-3 rounded-xl transition-all"
            >
              <FaTimes /> Reset
            </button>
          </motion.div>

          {/* Info Box */}
          <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border-l-4 border-blue-600">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>💡 Tip:</strong> Disable notifications you don't want to receive. You can update these settings anytime.
              Notifications are sent based on your preferences and app activity.
            </p>
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-50 dark:bg-gray-800 p-12 rounded-2xl text-center"
        >
          <FaBell className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Notifications Disabled
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Enable notifications to stay connected with your fitness journey and never miss important updates.
          </p>
          <button
            onClick={handleRequestPermission}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-all"
          >
            Enable Notifications
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default NotificationSettings;
