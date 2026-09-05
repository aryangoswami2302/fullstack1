import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where 
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, isConfigured } from "../firebase/config";

// --- Seed Data from db.json ---
const seedRooms = [
  {
    id: "1",
    name: "Executive Suite",
    price: "5000",
    bed: "2",
    bath: "2",
    desc: "Experience high-end comfort with panoramic city views, premium bedding, and a separate workspace ideal for corporate executives.",
    img: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg",
    images: [
      "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg",
      "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg"
    ],
    rating: 4.8,
    type: "suite",
    amenities: ["Wifi", "AC", "TV", "Mini Bar", "Room Service", "Gym Access"],
    availability: true
  },
  {
    id: "2",
    name: "Smart Room",
    price: "2500",
    bed: "1",
    bath: "1",
    desc: "Modern and compact room featuring automated lighting, climate control, and voice-activated assistant for technology lovers.",
    img: "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg",
    images: [
      "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg"
    ],
    rating: 4.5,
    type: "single",
    amenities: ["Wifi", "AC", "TV", "Smart Assistant", "Keyless Entry"],
    availability: true
  },
  {
    id: "3",
    name: "Deluxe Room",
    price: "3500",
    bed: "2",
    bath: "2",
    desc: "Spacious and elegant deluxe room featuring a king-size bed, private balcony, and state-of-the-art bathroom utilities.",
    img: "https://images.pexels.com/photos/6585619/pexels-photo-6585619.jpeg",
    images: [
      "https://images.pexels.com/photos/6585619/pexels-photo-6585619.jpeg",
      "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg"
    ],
    rating: 4.6,
    type: "double",
    amenities: ["Wifi", "AC", "TV", "Balcony", "Mini Fridge"],
    availability: true
  },
  {
    id: "4",
    name: "Super Deluxe Room",
    price: "4500",
    bed: "2",
    bath: "2",
    desc: "Luxury redefined. Large suite with walk-in closet, premium entertainment system, bath tub, and complimentary spa coupons.",
    img: "https://images.pexels.com/photos/35355792/pexels-photo-35355792.jpeg",
    images: [
      "https://images.pexels.com/photos/35355792/pexels-photo-35355792.jpeg"
    ],
    rating: 4.9,
    type: "double",
    amenities: ["Wifi", "AC", "TV", "Bath Tub", "Balcony", "Spa access"],
    availability: true
  }
];

const seedCoupons = [
  { id: "WELCOME10", code: "WELCOME10", discount: 10, type: "percent", desc: "10% off for first-time bookers" },
  { id: "SUMMER20", code: "SUMMER20", discount: 20, type: "percent", desc: "Summer seasonal 20% discount" },
  { id: "FLAT500", code: "FLAT500", discount: 500, type: "flat", desc: "Flat 500 INR off on all bookings" }
];

const seedReviews = [
  {
    id: "1",
    roomId: "1",
    userName: "Karan Patel",
    rating: 5,
    comment: "Absolutely amazing room! The view was breathtaking and the service was pristine.",
    date: "2026-07-01",
    approved: true
  },
  {
    id: "2",
    roomId: "2",
    userName: "Aryan Goswami",
    rating: 4,
    comment: "Clean and highly modern, loved the automated controls.",
    date: "2026-07-05",
    approved: true
  }
];

const seedTeam = [
  {
    id: "team-1",
    name: "Aman Singh",
    Designation: "General Manager",
    img: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
    bio: "Oversees hotel operations and guest satisfaction with 10+ years in luxury hospitality."
  },
  {
    id: "team-2",
    name: "Priya Shah",
    Designation: "Front Office Manager",
    img: "https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg",
    bio: "Ensures smooth check-in and concierge service for every guest arrival."
  },
  {
    id: "team-3",
    name: "Rahul Mehra",
    Designation: "Housekeeping Supervisor",
    img: "https://images.pexels.com/photos/769022/pexels-photo-769022.jpeg",
    bio: "Leads the cleanliness team to maintain premium room presentation and hygiene."
  }
];

const seedSettings = {
  contactEmail: "aryan23goswami@gmail.com",
  contactPhone: "+91 9687577089",
  contactAddress: "123 Luxury Boulevard, Palm Jumeirah, Ahmedabad, INDIA",
  contactHours: "Open 24/7 (For reservations)",
  aboutHeading: "Welcome to Hotelier",
  aboutSubheading: "A New Standard of Luxury Living",
  aboutDescription: "For over a decade, Hotelier has redefined high-end lodging. We combine local cultural design elements with cutting-edge smart features to create rooms that feel like home, yet inspire absolute wonder."
};

const normalizeEmail = (email) => (email || "").toString().trim().toLowerCase();

const defaultUsers = [
  { id: "1", name: "user", email: normalizeEmail("user@gmail.com"), role: "user", status: "unblock", wishlist: [], password: "user1234" },
  { id: "admin-1", name: "Admin User", email: normalizeEmail("admin@gmail.com"), role: "admin", status: "unblock", wishlist: [], password: "admin1234" },
  { id: "admin-2", name: "Aryan Goswami", email: normalizeEmail("aryan23goswami@email.com"), role: "admin", status: "unblock", wishlist: [], password: "Aryan#2300" }
];

const ensureLocalUsers = () => {
  let users = [];
  try {
    users = JSON.parse(localStorage.getItem("hl_users") || "[]") || [];
  } catch {
    users = [];
  }
  if (!Array.isArray(users)) {
    users = [];
  }

  users = users.map((u) => ({ ...u, email: normalizeEmail(u.email) }));

  defaultUsers.forEach((defaultUser) => {
    if (!users.some((u) => u.email === defaultUser.email)) {
      users.push(defaultUser);
    }
  });

  localStorage.setItem("hl_users", JSON.stringify(users));
};

// Initialize LocalStorage Data if not exist
const initLocalStorage = () => {
  if (!localStorage.getItem("hl_rooms")) {
    localStorage.setItem("hl_rooms", JSON.stringify(seedRooms));
  }
  if (!localStorage.getItem("hl_coupons")) {
    localStorage.setItem("hl_coupons", JSON.stringify(seedCoupons));
  }
  if (!localStorage.getItem("hl_reviews")) {
    localStorage.setItem("hl_reviews", JSON.stringify(seedReviews));
  }
  if (!localStorage.getItem("hl_bookings")) {
    localStorage.setItem("hl_bookings", JSON.stringify([]));
  }
  ensureLocalUsers();
  if (!localStorage.getItem("hl_team")) {
    localStorage.setItem("hl_team", JSON.stringify(seedTeam));
  }
  if (!localStorage.getItem("hl_settings")) {
    localStorage.setItem("hl_settings", JSON.stringify(seedSettings));
  }
  if (!localStorage.getItem("hl_messages")) {
    localStorage.setItem("hl_messages", JSON.stringify([]));
  }
};
initLocalStorage();

// Helper to simulate network latency in mock mode
const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

// ==========================================
// DB SERVICE LAYER
// ==========================================
export const dbService = {
  // ----------------------------------------
  // ROOMS
  // ----------------------------------------
  async getRooms() {
    if (isConfigured) {
      const querySnapshot = await getDocs(collection(db, "rooms"));
      const rooms = [];
      querySnapshot.forEach((doc) => {
        rooms.push({ id: doc.id, ...doc.data() });
      });
      // Seed if Firestore is empty
      if (rooms.length === 0) {
        for (const room of seedRooms) {
          await setDoc(doc(db, "rooms", room.id), room);
          rooms.push(room);
        }
      }
      return rooms;
    } else {
      await delay();
      return JSON.parse(localStorage.getItem("hl_rooms"));
    }
  },

  async getRoomById(id) {
    if (isConfigured) {
      const docRef = doc(db, "rooms", id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    } else {
      await delay();
      const rooms = JSON.parse(localStorage.getItem("hl_rooms"));
      return rooms.find(r => r.id === id) || null;
    }
  },

  async addRoom(roomData) {
    if (isConfigured) {
      const docRef = await addDoc(collection(db, "rooms"), roomData);
      return { id: docRef.id, ...roomData };
    } else {
      await delay();
      const rooms = JSON.parse(localStorage.getItem("hl_rooms"));
      const newRoom = { id: String(Date.now()), ...roomData };
      rooms.push(newRoom);
      localStorage.setItem("hl_rooms", JSON.stringify(rooms));
      return newRoom;
    }
  },

  async updateRoom(id, roomData) {
    if (isConfigured) {
      const docRef = doc(db, "rooms", id);
      await updateDoc(docRef, roomData);
      return { id, ...roomData };
    } else {
      await delay();
      const rooms = JSON.parse(localStorage.getItem("hl_rooms"));
      const index = rooms.findIndex(r => r.id === id);
      if (index > -1) {
        rooms[index] = { ...rooms[index], ...roomData };
        localStorage.setItem("hl_rooms", JSON.stringify(rooms));
        return rooms[index];
      }
      throw new Error("Room not found");
    }
  },

  async deleteRoom(id) {
    if (isConfigured) {
      await deleteDoc(doc(db, "rooms", id));
    } else {
      await delay();
      let rooms = JSON.parse(localStorage.getItem("hl_rooms"));
      rooms = rooms.filter(r => r.id !== id);
      localStorage.setItem("hl_rooms", JSON.stringify(rooms));
    }
    return id;
  },

  // ----------------------------------------
  // TEAM MEMBERS
  // ----------------------------------------
  async getTeam() {
    if (isConfigured) {
      const querySnapshot = await getDocs(collection(db, "team"));
      const team = [];
      querySnapshot.forEach((docSnap) => {
        team.push({ id: docSnap.id, ...docSnap.data() });
      });
      if (team.length === 0) {
        for (const member of seedTeam) {
          await setDoc(doc(db, "team", member.id), member);
          team.push(member);
        }
      }
      return team;
    } else {
      await delay();
      return JSON.parse(localStorage.getItem("hl_team") || "[]");
    }
  },

  async addTeamMember(memberData) {
    if (isConfigured) {
      const docRef = await addDoc(collection(db, "team"), memberData);
      return { id: docRef.id, ...memberData };
    } else {
      await delay();
      const team = JSON.parse(localStorage.getItem("hl_team") || "[]");
      const newMember = { id: String(Date.now()), ...memberData };
      team.push(newMember);
      localStorage.setItem("hl_team", JSON.stringify(team));
      return newMember;
    }
  },

  async updateTeamMember(id, memberData) {
    if (isConfigured) {
      const docRef = doc(db, "team", id);
      await updateDoc(docRef, memberData);
      return { id, ...memberData };
    } else {
      await delay();
      const team = JSON.parse(localStorage.getItem("hl_team") || "[]");
      const index = team.findIndex((m) => m.id === id);
      if (index > -1) {
        team[index] = { ...team[index], ...memberData };
        localStorage.setItem("hl_team", JSON.stringify(team));
        return team[index];
      }
      throw new Error("Team member not found");
    }
  },

  async deleteTeamMember(id) {
    if (isConfigured) {
      await deleteDoc(doc(db, "team", id));
    } else {
      await delay();
      let team = JSON.parse(localStorage.getItem("hl_team") || "[]");
      team = team.filter((m) => m.id !== id);
      localStorage.setItem("hl_team", JSON.stringify(team));
    }
    return id;
  },

  // ----------------------------------------
  // SITE SETTINGS
  // ----------------------------------------
  async getSettings() {
    if (isConfigured) {
      const docRef = doc(db, "settings", "site");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      await setDoc(docRef, seedSettings);
      return seedSettings;
    } else {
      await delay();
      return JSON.parse(localStorage.getItem("hl_settings")) || seedSettings;
    }
  },

  async saveSettings(settingsData) {
    if (isConfigured) {
      const docRef = doc(db, "settings", "site");
      await setDoc(docRef, settingsData, { merge: true });
      return settingsData;
    } else {
      await delay();
      localStorage.setItem("hl_settings", JSON.stringify(settingsData));
      return settingsData;
    }
  },

  // ----------------------------------------
  // BOOKINGS
  // ----------------------------------------
  async getBookings() {
    if (isConfigured) {
      const querySnapshot = await getDocs(collection(db, "bookings"));
      const bookings = [];
      querySnapshot.forEach((doc) => {
        bookings.push({ id: doc.id, ...doc.data() });
      });
      return bookings;
    } else {
      await delay();
      return JSON.parse(localStorage.getItem("hl_bookings"));
    }
  },

  async getUserBookings(userId) {
    if (isConfigured) {
      const q = query(collection(db, "bookings"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
      const bookings = [];
      querySnapshot.forEach((doc) => {
        bookings.push({ id: doc.id, ...doc.data() });
      });
      return bookings;
    } else {
      await delay();
      const bookings = JSON.parse(localStorage.getItem("hl_bookings"));
      return bookings.filter(b => b.userId === userId);
    }
  },

  async addBooking(bookingData) {
    const booking = {
      ...bookingData,
      status: "pending", // pending, approved, rejected, cancelled
      createdAt: new Date().toISOString()
    };
    if (isConfigured) {
      const docRef = await addDoc(collection(db, "bookings"), booking);
      return { id: docRef.id, ...booking };
    } else {
      await delay();
      const bookings = JSON.parse(localStorage.getItem("hl_bookings"));
      const newBooking = { id: "BK-" + Math.floor(100000 + Math.random() * 900000), ...booking };
      bookings.push(newBooking);
      localStorage.setItem("hl_bookings", JSON.stringify(bookings));
      return newBooking;
    }
  },

  async updateBookingStatus(id, status) {
    if (isConfigured) {
      const docRef = doc(db, "bookings", id);
      await updateDoc(docRef, { status });
      return { id, status };
    } else {
      await delay();
      const bookings = JSON.parse(localStorage.getItem("hl_bookings"));
      const index = bookings.findIndex(b => b.id === id);
      if (index > -1) {
        bookings[index].status = status;
        localStorage.setItem("hl_bookings", JSON.stringify(bookings));
        return bookings[index];
      }
      throw new Error("Booking not found");
    }
  },

  // ----------------------------------------
  // USERS & PROFILE
  // ----------------------------------------
  async getUsers() {
    if (isConfigured) {
      const querySnapshot = await getDocs(collection(db, "users"));
      const users = [];
      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, ...doc.data() });
      });
      return users;
    } else {
      await delay();
      return JSON.parse(localStorage.getItem("hl_users"));
    }
  },

  async getUserById(id) {
    if (isConfigured) {
      const docRef = doc(db, "users", id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
    } else {
      await delay();
      const users = JSON.parse(localStorage.getItem("hl_users"));
      return users.find(u => u.id === id) || null;
    }
  },

  async saveUser(id, userData) {
    if (isConfigured) {
      const docRef = doc(db, "users", id);
      await setDoc(docRef, userData, { merge: true });
      return { id, ...userData };
    } else {
      await delay();
      const users = JSON.parse(localStorage.getItem("hl_users"));
      const index = users.findIndex(u => u.id === id);
      if (index > -1) {
        users[index] = { ...users[index], ...userData };
      } else {
        users.push({ id, status: "unblock", role: "user", wishlist: [], ...userData });
      }
      localStorage.setItem("hl_users", JSON.stringify(users));
      return { id, ...userData };
    }
  },

  async updateUserStatus(id, status) {
    if (isConfigured) {
      const docRef = doc(db, "users", id);
      await updateDoc(docRef, { status });
    } else {
      await delay();
      const users = JSON.parse(localStorage.getItem("hl_users"));
      const index = users.findIndex(u => u.id === id);
      if (index > -1) {
        users[index].status = status;
        localStorage.setItem("hl_users", JSON.stringify(users));
      }
    }
  },

  async deleteUser(id) {
    if (isConfigured) {
      await deleteDoc(doc(db, "users", id));
    } else {
      await delay();
      let users = JSON.parse(localStorage.getItem("hl_users"));
      users = users.filter(u => u.id !== id);
      localStorage.setItem("hl_users", JSON.stringify(users));
    }
  },

  // Wishlist Functions
  async toggleWishlist(userId, roomId) {
    if (isConfigured) {
      const userRef = doc(db, "users", userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        let wishlist = data.wishlist || [];
        if (wishlist.includes(roomId)) {
          wishlist = wishlist.filter(id => id !== roomId);
        } else {
          wishlist.push(roomId);
        }
        await updateDoc(userRef, { wishlist });
        return wishlist;
      }
      return [];
    } else {
      await delay();
      const users = JSON.parse(localStorage.getItem("hl_users"));
      const index = users.findIndex(u => u.id === userId);
      if (index > -1) {
        let wishlist = users[index].wishlist || [];
        if (wishlist.includes(roomId)) {
          wishlist = wishlist.filter(id => id !== roomId);
        } else {
          wishlist.push(roomId);
        }
        users[index].wishlist = wishlist;
        localStorage.setItem("hl_users", JSON.stringify(users));
        return wishlist;
      }
      return [];
    }
  },

  // ----------------------------------------
  // REVIEWS
  // ----------------------------------------
  async getReviews() {
    if (isConfigured) {
      const querySnapshot = await getDocs(collection(db, "reviews"));
      const reviews = [];
      querySnapshot.forEach((doc) => {
        reviews.push({ id: doc.id, ...doc.data() });
      });
      return reviews;
    } else {
      await delay();
      return JSON.parse(localStorage.getItem("hl_reviews"));
    }
  },

  async getReviewsForRoom(roomId) {
    const all = await this.getReviews();
    return all.filter(r => r.roomId === roomId && r.approved);
  },

  async addReview(reviewData) {
    const review = {
      ...reviewData,
      approved: false, // Reviews require admin approval by default
      date: new Date().toISOString().split('T')[0]
    };
    if (isConfigured) {
      const docRef = await addDoc(collection(db, "reviews"), review);
      return { id: docRef.id, ...review };
    } else {
      await delay();
      const reviews = JSON.parse(localStorage.getItem("hl_reviews"));
      const newReview = { id: String(Date.now()), ...review };
      reviews.push(newReview);
      localStorage.setItem("hl_reviews", JSON.stringify(reviews));
      return newReview;
    }
  },

  async approveReview(id) {
    if (isConfigured) {
      const docRef = doc(db, "reviews", id);
      await updateDoc(docRef, { approved: true });
    } else {
      await delay();
      const reviews = JSON.parse(localStorage.getItem("hl_reviews"));
      const index = reviews.findIndex(r => r.id === id);
      if (index > -1) {
        reviews[index].approved = true;
        localStorage.setItem("hl_reviews", JSON.stringify(reviews));
      }
    }
  },

  async deleteReview(id) {
    if (isConfigured) {
      await deleteDoc(doc(db, "reviews", id));
    } else {
      await delay();
      let reviews = JSON.parse(localStorage.getItem("hl_reviews"));
      reviews = reviews.filter(r => r.id !== id);
      localStorage.setItem("hl_reviews", JSON.stringify(reviews));
    }
  },

  // ----------------------------------------
  // COUPONS
  // ----------------------------------------
  async getCoupons() {
    if (isConfigured) {
      const querySnapshot = await getDocs(collection(db, "coupons"));
      const coupons = [];
      querySnapshot.forEach((doc) => {
        coupons.push({ id: doc.id, ...doc.data() });
      });
      return coupons;
    } else {
      await delay();
      return JSON.parse(localStorage.getItem("hl_coupons"));
    }
  },

  async addCoupon(couponData) {
    if (isConfigured) {
      const docRef = await addDoc(collection(db, "coupons"), couponData);
      return { id: docRef.id, ...couponData };
    } else {
      await delay();
      const coupons = JSON.parse(localStorage.getItem("hl_coupons"));
      const newCoupon = { id: couponData.code, ...couponData };
      coupons.push(newCoupon);
      localStorage.setItem("hl_coupons", JSON.stringify(coupons));
      return newCoupon;
    }
  },

  async deleteCoupon(id) {
    if (isConfigured) {
      await deleteDoc(doc(db, "coupons", id));
    } else {
      await delay();
      let coupons = JSON.parse(localStorage.getItem("hl_coupons"));
      coupons = coupons.filter(c => c.id !== id);
      localStorage.setItem("hl_coupons", JSON.stringify(coupons));
    }
  },

  // ----------------------------------------
  // IMAGE UPLOADS
  // ----------------------------------------
  async uploadImage(file) {
    if (isConfigured && file instanceof File) {
      const storageRef = ref(storage, `rooms/${Date.now()}_${file.name}`);
      await uploadBytes(storageRef, file);
      return await getDownloadURL(storageRef);
    } else {
      // Mock File Upload: return a random elegant pexels room image
      await delay(1000);
      const mockImages = [
        "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg",
        "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg",
        "https://images.pexels.com/photos/6585619/pexels-photo-6585619.jpeg",
        "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg",
        "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg"
      ];
      return mockImages[Math.floor(Math.random() * mockImages.length)];
    }
  },

  // ----------------------------------------
  // CONTACT MESSAGES
  // ----------------------------------------
  async getMessages() {
    if (isConfigured) {
      const querySnapshot = await getDocs(collection(db, "messages"));
      const messages = [];
      querySnapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() });
      });
      return messages;
    } else {
      await delay();
      return JSON.parse(localStorage.getItem("hl_messages") || "[]");
    }
  },

  async addMessage(messageData) {
    const message = {
      ...messageData,
      status: "unread", // unread, read
      createdAt: new Date().toISOString()
    };
    if (isConfigured) {
      const docRef = await addDoc(collection(db, "messages"), message);
      return { id: docRef.id, ...message };
    } else {
      await delay();
      const messages = JSON.parse(localStorage.getItem("hl_messages") || "[]");
      const newMessage = { id: "MSG-" + Math.floor(100000 + Math.random() * 900000), ...message };
      messages.push(newMessage);
      localStorage.setItem("hl_messages", JSON.stringify(messages));
      return newMessage;
    }
  },

  async updateMessageStatus(id, status) {
    if (isConfigured) {
      const docRef = doc(db, "messages", id);
      await updateDoc(docRef, { status });
      return { id, status };
    } else {
      await delay();
      const messages = JSON.parse(localStorage.getItem("hl_messages") || "[]");
      const index = messages.findIndex(m => m.id === id);
      if (index > -1) {
        messages[index].status = status;
        localStorage.setItem("hl_messages", JSON.stringify(messages));
        return messages[index];
      }
      throw new Error("Message not found");
    }
  },

  async deleteMessage(id) {
    if (isConfigured) {
      await deleteDoc(doc(db, "messages", id));
    } else {
      await delay();
      let messages = JSON.parse(localStorage.getItem("hl_messages") || "[]");
      messages = messages.filter(m => m.id !== id);
      localStorage.setItem("hl_messages", JSON.stringify(messages));
    }
    return id;
  }
};
