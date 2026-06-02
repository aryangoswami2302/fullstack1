// Push Notifications Service
// This manages browser push notifications for the gym app

export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const sendNotification = (title, options = {}) => {
  if (Notification.permission === 'granted') {
    const defaultOptions = {
      icon: '/images/logo.png',
      badge: '/images/badge.png',
      tag: 'gym-pro-notification',
      requireInteraction: false,
      ...options
    };

    const notification = new Notification(title, defaultOptions);

    // Close notification after 5 seconds if not set otherwise
    if (!options.requireInteraction) {
      setTimeout(() => notification.close(), 5000);
    }

    return notification;
  }
};

export const sendWorkoutReminder = (workoutName, time) => {
  return sendNotification(`⏰ Time for ${workoutName}!`, {
    body: `Your ${workoutName} workout starts in 15 minutes at ${time}. Get ready! 💪`,
    tag: 'workout-reminder',
    requireInteraction: true
  });
};

export const sendClassNotification = (className, instructor, time) => {
  return sendNotification(`🏋️ ${className} Class Starting!`, {
    body: `Instructor: ${instructor} • Starting at ${time}`,
    tag: 'class-notification',
    requireInteraction: true
  });
};

export const sendAchievementNotification = (achievement, description) => {
  return sendNotification(`🎉 Achievement Unlocked!`, {
    body: `${achievement}\n${description}`,
    tag: 'achievement-notification',
    requireInteraction: false
  });
};

export const sendMembershipExpiryNotification = (daysLeft) => {
  return sendNotification(`⚠️ Membership Expiring Soon!`, {
    body: `Your membership expires in ${daysLeft} days. Renew now to keep your benefits! 💳`,
    tag: 'membership-expiry',
    requireInteraction: true
  });
};

export const sendNewVideoNotification = (videoTitle, category) => {
  return sendNotification(`📹 New Workout Video: ${videoTitle}`, {
    body: `Check out the new ${category} workout video in our library!`,
    tag: 'new-video',
    requireInteraction: false
  });
};

export const sendPaymentReminderNotification = (amount, dueDate) => {
  return sendNotification(`💳 Payment Due Reminder`, {
    body: `${amount} is due on ${dueDate}. Keep your membership active!`,
    tag: 'payment-reminder',
    requireInteraction: true
  });
};

export const sendMotivationalNotification = (message) => {
  const motivationalMessages = [
    { title: '💪 You Got This!', body: message || 'Your consistency is building your success. Keep pushing!' },
    { title: '🔥 Stay Strong!', body: message || 'Every workout counts. Keep crushing your goals!' },
    { title: '⭐ Amazing Progress!', body: message || 'You\'re doing great! One more set to go!' },
    { title: '🏆 Champion Mentality!', body: message || 'Success is the sum of small efforts. Keep going!' }
  ];

  const random = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
  return sendNotification(random.title, {
    body: random.body,
    tag: 'motivational',
    requireInteraction: false
  });
};

// Store notification preferences
export const saveNotificationPreferences = (preferences) => {
  localStorage.setItem('notificationPreferences', JSON.stringify({
    enabled: preferences.enabled || false,
    workoutReminders: preferences.workoutReminders || false,
    classReminders: preferences.classReminders || false,
    paymentReminders: preferences.paymentReminders || false,
    achievements: preferences.achievements || false,
    newVideos: preferences.newVideos || false,
    motivational: preferences.motivational || false,
    ...preferences
  }));
};

// Get notification preferences
export const getNotificationPreferences = () => {
  const prefs = localStorage.getItem('notificationPreferences');
  return prefs ? JSON.parse(prefs) : {
    enabled: false,
    workoutReminders: false,
    classReminders: false,
    paymentReminders: false,
    achievements: false,
    newVideos: false,
    motivational: false
  };
};

// Schedule regular notification checks
export const startNotificationScheduler = (callback) => {
  // Check every 5 minutes
  const interval = setInterval(() => {
    const prefs = getNotificationPreferences();
    if (prefs.enabled && callback) {
      callback();
    }
  }, 5 * 60 * 1000);

  return interval;
};

export const stopNotificationScheduler = (intervalId) => {
  clearInterval(intervalId);
};
