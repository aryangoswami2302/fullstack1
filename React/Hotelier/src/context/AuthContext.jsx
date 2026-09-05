/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  onAuthStateChanged,
  updateProfile as fbUpdateProfile,
  updatePassword as fbUpdatePassword
} from "firebase/auth";
import { auth, isConfigured } from "../firebase/config";
import { dbService } from "../services/db";
import { toast } from "react-toastify";

const AuthContext = createContext();

const normalizeEmail = (email) => (email || "").toString().trim().toLowerCase();

const adminFallback = {
  id: "admin-2",
  name: "Aryan Goswami",
  email: normalizeEmail("aryan23goswami@gmail.com"),
  role: "admin",
  status: "unblock",
  wishlist: [],
  password: "Aryan#2300"
};

const isAdminEmail = (email) => {
  const normalized = normalizeEmail(email);
  return [
    "admin@gmail.com",
    "aryan23goswami@gmail.com",
    "aryan23goswami@email.com"
  ].includes(normalized);
};

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadLocalUsers = useCallback(() => {
    let users = [];
    const normalizedFallbackEmail = normalizeEmail(adminFallback.email);
    try {
      users = JSON.parse(localStorage.getItem("hl_users") || "[]") || [];
      users = users.map((u) => ({ ...u, email: normalizeEmail(u.email) }));
    } catch {
      users = [];
    }
    if (!Array.isArray(users)) {
      users = [];
    }
    if (!users.some((u) => u.email === normalizeEmail("user@gmail.com"))) {
      users.push({ id: "1", name: "user", email: normalizeEmail("user@gmail.com"), role: "user", status: "unblock", wishlist: [], password: "user1234" });
    }
    if (!users.some((u) => u.email === normalizeEmail("admin@gmail.com"))) {
      users.push({ id: "admin-1", name: "Admin User", email: normalizeEmail("admin@gmail.com"), role: "admin", status: "unblock", wishlist: [], password: "admin1234" });
    }
    if (!users.some((u) => u.email === normalizedFallbackEmail)) {
      users.push({ ...adminFallback, email: normalizedFallbackEmail });
    }
    localStorage.setItem("hl_users", JSON.stringify(users));
    return users;
  }, []);

  // Load user details from Firestore or local simulation
  const fetchUserDetails = useCallback(async (uid, email, defaultName = "Guest") => {
    try {
      let userDetails = await dbService.getUserById(uid);
      if (!userDetails) {
        // Create new user profile if not exists
        const role = (email && (email.endsWith("@hotelier-admin.com") || isAdminEmail(email))) ? "admin" : "user";
        userDetails = {
          id: uid,
          name: defaultName,
          email: email,
          role: role,
          status: "unblock",
          wishlist: []
        };
        await dbService.saveUser(uid, userDetails);
      }
      return userDetails;
    } catch (error) {
      console.error("Error fetching user details", error);
      return null;
    }
  }, []);

  useEffect(() => {
    if (isConfigured) {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const details = await fetchUserDetails(user.uid, user.email, user.displayName);
          if (details?.status === "block") {
            toast.error("Your account has been blocked by admin.");
            await signOut(auth);
            setCurrentUser(null);
          } else {
            setCurrentUser({ ...user, ...details });
          }
        } else {
          setCurrentUser(null);
        }
        setLoading(false);
      });
      return unsubscribe;
    } else {
      // Mock session restoration
      const session = localStorage.getItem("hl_session");
      if (session) {
        const mockUser = JSON.parse(session);
        dbService.getUserById(mockUser.id).then(details => {
          if (details && details.status === "block") {
            toast.error("Your account has been blocked by admin.");
            localStorage.removeItem("hl_session");
            setCurrentUser(null);
          } else {
            setCurrentUser(details || mockUser);
          }
          setLoading(false);
        });
      } else {
        loadLocalUsers();
        setCurrentUser(null);
        setLoading(false);
      }
    }
  }, [fetchUserDetails, loadLocalUsers]);

  const login = async (email, password) => {
    setLoading(true);
    if (isConfigured) {
      try {
        const credential = await signInWithEmailAndPassword(auth, email, password);
        const details = await fetchUserDetails(credential.user.uid, email);
        if (details && details.status === "block") {
          await signOut(auth);
          throw new Error("Your account has been blocked by admin.");
        }
        return credential.user;
      } finally {
        setLoading(false);
      }
    } else {
      // Simulated Email/Password Authentication
      await new Promise(r => setTimeout(r, 600));
      const normalizedEmail = normalizeEmail(email);
      const users = loadLocalUsers();
      // Check for matching email and password
      let matched = users.find(u => u.email === normalizedEmail);
      if (matched) {
        if (matched.status === "block") {
          setLoading(false);
          throw new Error("Your account has been blocked by admin.");
        }
        // Check password - either exact match or minimum 4 characters for flexibility
        const passwordValid = matched.password ? (password === matched.password) : (password.length >= 4);
        if (passwordValid) {
          const userSession = {
            uid: matched.id,
            id: matched.id,
            email: matched.email,
            displayName: matched.name,
            ...matched
          };
          localStorage.setItem("hl_session", JSON.stringify(userSession));
          setCurrentUser(userSession);
          setLoading(false);
          return userSession;
        } else {
          setLoading(false);
          throw new Error("Invalid password");
        }
      } else {
        setLoading(false);
        throw new Error("User not found");
      }
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    if (isConfigured) {
      try {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await fbUpdateProfile(credential.user, { displayName: name });
        const userDetails = {
          id: credential.user.uid,
          name,
          email,
          role: isAdminEmail(email) ? "admin" : "user",
          status: "unblock",
          wishlist: []
        };
        await dbService.saveUser(credential.user.uid, userDetails);
        return credential.user;
      } finally {
        setLoading(false);
      }
    } else {
      await new Promise(r => setTimeout(r, 600));
      const emailNormalized = normalizeEmail(email);
      const storedUsers = JSON.parse(localStorage.getItem("hl_users") || "[]") || [];
      const users = storedUsers.map(u => ({ ...u, email: normalizeEmail(u.email) }));
      if (users.some(u => u.email === emailNormalized)) {
        setLoading(false);
        throw new Error("Email already in use");
      }
      const newId = String(Date.now());
      const newUser = {
        id: newId,
        name,
        email: emailNormalized,
        role: (emailNormalized === "admin@gmail.com" || emailNormalized === "aryan23goswami@gmail.com" || emailNormalized === "aryan23goswami@email.com") ? "admin" : "user",
        status: "unblock",
        wishlist: [],
        password: password
      };
      users.push(newUser);
      localStorage.setItem("hl_users", JSON.stringify(users));
      
      const sessionUser = { uid: newId, id: newId, displayName: name, email: emailNormalized, ...newUser };
      localStorage.setItem("hl_session", JSON.stringify(sessionUser));
      setCurrentUser(sessionUser);
      setLoading(false);
      return sessionUser;
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    if (isConfigured) {
      try {
        const provider = new GoogleAuthProvider();
        const credential = await signInWithPopup(auth, provider);
        const details = await fetchUserDetails(credential.user.uid, credential.user.email, credential.user.displayName);
        if (details && details.status === "block") {
          await signOut(auth);
          throw new Error("Your account has been blocked.");
        }
        return credential.user;
      } finally {
        setLoading(false);
      }
    } else {
      // Mock Google Login
      await new Promise(r => setTimeout(r, 500));
      const googleUser = {
        id: "g-" + Math.floor(Math.random() * 100000),
        name: "Google Explorer",
        email: "google.user@gmail.com",
        role: "user",
        status: "unblock",
        wishlist: []
      };
      const storedUsers = JSON.parse(localStorage.getItem("hl_users") || "[]") || [];
      const users = storedUsers.map((u) => ({ ...u, email: normalizeEmail(u.email) }));
      if (!users.some((u) => u.email === normalizeEmail(googleUser.email))) {
        users.push({ ...googleUser, email: normalizeEmail(googleUser.email) });
        localStorage.setItem("hl_users", JSON.stringify(users));
      }
      const sessionUser = { uid: googleUser.id, ...googleUser };
      localStorage.setItem("hl_session", JSON.stringify(sessionUser));
      setCurrentUser(sessionUser);
      setLoading(false);
      return sessionUser;
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      if (isConfigured) {
        await signOut(auth);
      }
      // Always remove local session data in mock mode or as a fallback
      try {
        localStorage.removeItem("hl_session");
      } catch {
        // ignore localStorage errors
      }
      setCurrentUser(null);
      toast.success("Successfully logged out");
    } catch (err) {
      console.error("Logout error:", err);
      toast.error("Logout failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (name, photoURL) => {
    if (!currentUser) return;
    if (isConfigured) {
      await fbUpdateProfile(auth.currentUser, { displayName: name, photoURL });
      const updatedDetails = { name };
      await dbService.saveUser(currentUser.uid, updatedDetails);
      setCurrentUser(prev => ({ ...prev, displayName: name, photoURL, name }));
    } else {
      const updatedDetails = { name };
      await dbService.saveUser(currentUser.id, updatedDetails);
      setCurrentUser(prev => {
        const updated = { ...prev, displayName: name, name };
        localStorage.setItem("hl_session", JSON.stringify(updated));
        return updated;
      });
    }
    toast.success("Profile updated successfully");
  };

  const updatePassword = async (newPassword) => {
    if (isConfigured) {
      await fbUpdatePassword(auth.currentUser, newPassword);
    } else {
      await new Promise(r => setTimeout(r, 400));
    }
    toast.success("Password updated successfully");
  };

  const toggleWishlist = async (roomId) => {
    if (!currentUser) {
      toast.warning("Please login to wishlist rooms.");
      return;
    }
    try {
      const updatedWishlist = await dbService.toggleWishlist(currentUser.uid || currentUser.id, roomId);
      setCurrentUser(prev => {
        const updated = { ...prev, wishlist: updatedWishlist };
        if (!isConfigured) {
          localStorage.setItem("hl_session", JSON.stringify(updated));
        }
        return updated;
      });
      toast.success(currentUser.wishlist?.includes(roomId) ? "Removed from wishlist" : "Added to wishlist");
    } catch (e) {
      console.error(e);
      toast.error("Failed to update wishlist");
    }
  };

  return (
    <AuthContext.Provider value={{ currentUser, loading, login, register, loginWithGoogle, logout, updateProfile, updatePassword, toggleWishlist }}>
      {children}
    </AuthContext.Provider>
  );
};
