import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { dbService } from "../services/db";
import { toast } from "react-toastify";
import { 
  User, 
  Briefcase, 
  Heart, 
  Lock, 
  Mail, 
  Phone, 
  MapPin, 
  Trash2, 
  FileText,
  XCircle,
  Printer
} from "lucide-react";

export default function UserDashboard() {
  const { currentUser, updateProfile, updatePassword, toggleWishlist } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Tab State
  const activeTab = searchParams.get("tab") || "profile";
  const setActiveTab = (tab) => setSearchParams({ tab });

  // Profile Edit Form States
  const [displayName, setDisplayName] = useState(currentUser?.displayName || currentUser?.name || "");
  const [photoURL, setPhotoURL] = useState(currentUser?.photoURL || "");
  const [newPassword, setNewPassword] = useState("");
  const [submittingProfile, setSubmittingProfile] = useState(false);

  // Booking states
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Invoice Modal
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    async function loadDashboardData() {
      if (!currentUser) return;
      try {
        const roomsData = await dbService.getRooms();
        const userBookings = await dbService.getUserBookings(currentUser.uid || currentUser.id);
        setRooms(roomsData);
        setBookings(userBookings);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingBookings(false);
      }
    }
    loadDashboardData();
  }, [currentUser]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!displayName.trim()) return;
    setSubmittingProfile(true);
    try {
      await updateProfile(displayName, photoURL);
    } catch {
      toast.error("Failed to update profile.");
    } finally {
      setSubmittingProfile(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.warning("Password must be at least 6 characters.");
      return;
    }
    try {
      await updatePassword(newPassword);
      setNewPassword("");
    } catch {
      toast.error("Failed to reset password.");
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await dbService.updateBookingStatus(bookingId, "cancelled");
      toast.success("Booking cancelled successfully.");
      // Refresh bookings
      const userBookings = await dbService.getUserBookings(currentUser.uid || currentUser.id);
      setBookings(userBookings);
    } catch {
      toast.error("Failed to cancel booking.");
    }
  };

  // Wishlist Rooms
  const wishlistRooms = rooms.filter(r => currentUser?.wishlist?.includes(r.id));

  return (
    <div className="flex-grow flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Dashboard Sidebar Tabs */}
          <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-6 h-fit space-y-2 shadow-sm">
            <div className="pb-4 border-b border-slate-100 dark:border-slate-850 mb-4">
              <h2 className="font-extrabold text-slate-950 dark:text-white uppercase tracking-wider text-sm">My Dashboard</h2>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Role: User</span>
            </div>

            {/* Profile Tab */}
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                activeTab === "profile"
                  ? "bg-primary text-white"
                  : "text-slate-700 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <User size={16} />
              <span>Profile Settings</span>
            </button>

            {/* Bookings Tab */}
            <button
              onClick={() => setActiveTab("bookings")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                activeTab === "bookings"
                  ? "bg-primary text-white"
                  : "text-slate-700 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Briefcase size={16} />
              <span>Bookings ({bookings.length})</span>
            </button>

            {/* Wishlist Tab */}
            <button
              onClick={() => setActiveTab("wishlist")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                activeTab === "wishlist"
                  ? "bg-primary text-white"
                  : "text-slate-700 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Heart size={16} />
              <span>Wishlist ({wishlistRooms.length})</span>
            </button>
          </div>

          {/* Tab Content Display Area */}
          <div className="lg:col-span-3">
            
            {/* ----------------- PROFILE TAB ----------------- */}
            {activeTab === "profile" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
                {/* Details Form */}
                <form onSubmit={handleUpdateProfile} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                  <h3 className="font-bold dark:text-white uppercase tracking-wider text-sm border-b border-slate-100 dark:border-slate-800 pb-3">
                    Personal Information
                  </h3>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="email"
                        disabled
                        value={currentUser?.email || ""}
                        className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl pl-11 pr-4 py-2.5 text-xs text-slate-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Full Name</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="text"
                        required
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl pl-11 pr-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Avatar Image URL</label>
                    <input
                      type="text"
                      value={photoURL}
                      onChange={(e) => setPhotoURL(e.target.value)}
                      placeholder="https://example.com/avatar.jpg"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submittingProfile}
                    className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold uppercase tracking-wider transition"
                  >
                    {submittingProfile ? "Saving Details..." : "Save Details"}
                  </button>
                </form>

                {/* Password reset form */}
                <form onSubmit={handleUpdatePassword} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                  <h3 className="font-bold dark:text-white uppercase tracking-wider text-sm border-b border-slate-100 dark:border-slate-800 pb-3">
                    Security & Password
                  </h3>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="•••••••• (Min 6 characters)"
                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl pl-11 pr-4 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 bg-slate-900 hover:bg-slate-850 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition"
                  >
                    Update Password
                  </button>
                </form>
              </div>
            )}

            {/* ----------------- BOOKINGS TAB ----------------- */}
            {activeTab === "bookings" && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm animate-fadeIn">
                <h3 className="font-bold dark:text-white uppercase tracking-wider text-sm border-b border-slate-100 dark:border-slate-800 pb-3">
                  My Bookings List
                </h3>

                {loadingBookings ? (
                  <div className="text-center py-6 text-slate-500 text-sm">Loading bookings...</div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-10 text-slate-500 text-sm">
                    No reservations booked yet. Explore our rooms to get started!
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-150 dark:border-slate-800 text-slate-450 uppercase font-black tracking-wider">
                          <th className="pb-3">Suite</th>
                          <th className="pb-3">Dates</th>
                          <th className="pb-3">Price</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                        {bookings.map((b) => {
                          const statusColors = {
                            pending: "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400",
                            approved: "bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400",
                            rejected: "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400",
                            cancelled: "bg-slate-100 text-slate-600 dark:bg-slate-800/40 dark:text-slate-400"
                          };

                          return (
                            <tr key={b.id} className="text-slate-700 dark:text-slate-300">
                              <td className="py-4">
                                <div className="font-bold text-slate-900 dark:text-white">{b.roomName}</div>
                                <div className="text-[10px] text-slate-400 font-bold">{b.id}</div>
                              </td>
                              <td className="py-4">
                                <div>{b.checkIn} to</div>
                                <div className="text-[10px] text-slate-400">{b.checkOut} ({b.nights} nights)</div>
                              </td>
                              <td className="py-4 font-bold text-slate-900 dark:text-white">INR {b.totalPrice}</td>
                              <td className="py-4">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusColors[b.status] || ""}`}>
                                  {b.status}
                                </span>
                              </td>
                              <td className="py-4 text-right flex justify-end space-x-2">
                                <button
                                  onClick={() => setSelectedInvoice(b)}
                                  className="p-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-650 dark:text-slate-350"
                                  title="View Invoice"
                                >
                                  <FileText size={14} />
                                </button>
                                
                                {(b.status === "pending" || b.status === "approved") && (
                                  <button
                                    onClick={() => handleCancelBooking(b.id)}
                                    className="p-2 border border-red-200 dark:border-red-950/20 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg text-red-600"
                                    title="Cancel Reservation"
                                  >
                                    <XCircle size={14} />
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ----------------- WISHLIST TAB ----------------- */}
            {activeTab === "wishlist" && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm animate-fadeIn">
                <h3 className="font-bold dark:text-white uppercase tracking-wider text-sm border-b border-slate-100 dark:border-slate-800 pb-3">
                  My Wishlisted Suites
                </h3>

                {wishlistRooms.length === 0 ? (
                  <div className="text-center py-10 text-slate-500 text-sm">
                    Your wishlist is currently empty. Start favoriting rooms in lists!
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {wishlistRooms.map((room) => (
                      <div key={room.id} className="border border-slate-200/50 dark:border-slate-800 rounded-2xl overflow-hidden group flex flex-col justify-between bg-slate-50 dark:bg-slate-950">
                        <div className="h-44 relative">
                          <img src={room.img} alt={room.name} className="w-full h-full object-cover" />
                          <button
                            onClick={() => toggleWishlist(room.id)}
                            className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-slate-950/80 rounded-full text-red-500 shadow-sm"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <div className="p-4 flex-grow flex flex-col justify-between">
                          <div>
                            <h4 className="font-bold text-slate-850 dark:text-white text-sm truncate">{room.name}</h4>
                            <span className="text-xs font-bold text-primary mt-1 block">INR {room.price}/night</span>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <button
                              onClick={() => navigate(`/rooms/${room.id}`)}
                              className="flex-1 text-center py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-850 dark:hover:bg-slate-700 text-white rounded-xl text-[10px] font-bold uppercase transition"
                            >
                              Details
                            </button>
                            <button
                              onClick={() => navigate(`/booking/${room.id}`)}
                              className="flex-1 text-center py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-[10px] font-bold uppercase transition"
                            >
                              Book Now
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Invoice Modal Overlay */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl relative animate-scaleIn print:p-0 print:border-none print:shadow-none">
            
            {/* Header info */}
            <div className="flex justify-between items-start">
              <div>
                <span className="text-lg font-extrabold tracking-widest text-primary uppercase">HOTELIER</span>
                <span className="block text-[10px] text-slate-400 uppercase mt-0.5">Booking Receipt</span>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-slate-850 dark:text-white uppercase">Invoice Ref</span>
                <span className="block text-[10px] text-slate-400">{selectedInvoice.id}</span>
              </div>
            </div>

            <hr className="border-slate-150 dark:border-slate-800" />

            {/* Receipt metadata */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-slate-400 font-bold uppercase text-[9px] block mb-0.5">Guest details</span>
                <p className="font-bold text-slate-850 dark:text-white">{selectedInvoice.userName}</p>
                <p className="text-slate-500 mt-0.5">{selectedInvoice.userEmail}</p>
                <p className="text-slate-500">{selectedInvoice.userPhone}</p>
              </div>
              <div>
                <span className="text-slate-400 font-bold uppercase text-[9px] block mb-0.5">Reservation</span>
                <p className="font-bold text-slate-850 dark:text-white">{selectedInvoice.roomName}</p>
                <p className="text-slate-550 mt-0.5">Check-in: {selectedInvoice.checkIn}</p>
                <p className="text-slate-550">Check-out: {selectedInvoice.checkOut}</p>
              </div>
            </div>

            {/* Pricing breakdown */}
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-650 dark:text-slate-350">
                <span>Room charge ({selectedInvoice.nights} nights)</span>
                <span>INR {selectedInvoice.basePrice}</span>
              </div>
              {selectedInvoice.discountAmount > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-400 font-semibold">
                  <span>Applied Promo ({selectedInvoice.couponCode})</span>
                  <span>- INR {selectedInvoice.discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-650 dark:text-slate-350">
                <span>Tax & Service Fees (12%)</span>
                <span>INR {selectedInvoice.tax?.toFixed(0)}</span>
              </div>
              <hr className="border-slate-200 dark:border-slate-850 my-2" />
              <div className="flex justify-between font-black text-sm text-slate-850 dark:text-white">
                <span>Total Charge</span>
                <span>INR {selectedInvoice.totalPrice?.toFixed(0)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 print:hidden">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                <Printer size={14} />
                <span>Print</span>
              </button>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-850 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition"
              >
                Close
              </button>
            </div>
            
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
