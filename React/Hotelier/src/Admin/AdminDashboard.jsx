/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { dbService } from "../services/db";
import { toast } from "react-toastify";
import { 
  BarChart as RechartsBarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import { 
  Grid, 
  BedDouble, 
  Briefcase, 
  Users, 
  MessageSquare, 
  Tag, 
  BarChart3, 
  UserX, 
  Plus, 
  Edit, 
  Trash2, 
  Check, 
  X,
  Search,
  Upload,
  Percent
} from "lucide-react";

export default function AdminDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Tab State
  const activeTab = searchParams.get("tab") || "analytics";
  const setActiveTab = (tab) => setSearchParams({ tab });

  // Data States
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [messages, setMessages] = useState([]);
  const [team, setTeam] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  // Search/Filters
  const [bookingSearch, setBookingSearch] = useState("");
  const [userSearch, setUserSearch] = useState("");

  // Modals / Add Room Form States
  const [showAddRoomModal, setShowAddRoomModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  
  // Room form payload
  const [roomForm, setRoomForm] = useState({
    name: "", price: "", bed: "1", bath: "1", desc: "", type: "single", amenities: ["Wifi", "AC", "TV"], img: "", availability: true
  });

  const [teamForm, setTeamForm] = useState({
    name: "", Designation: "", img: "", bio: "", phone: "", email: "", salary: "", attendance: "absent", attendanceDate: ""
  });

  const [siteForm, setSiteForm] = useState({
    contactEmail: "",
    contactPhone: "",
    contactAddress: "",
    contactHours: "",
    aboutHeading: "",
    aboutSubheading: "",
    aboutDescription: ""
  });

  // Coupon form payload
  const [couponForm, setCouponForm] = useState({
    code: "", discount: "", type: "percent", desc: ""
  });

  const amenitiesOptions = ["Wifi", "AC", "TV", "Mini Bar", "Room Service", "Gym Access", "Balcony", "Bath Tub"];

  useEffect(() => {
    async function loadAdminData() {
      try {
        const roomsData = await dbService.getRooms();
        const bookingsData = await dbService.getBookings();
        const usersData = await dbService.getUsers();
        const reviewsData = await dbService.getReviews();
        const couponsData = await dbService.getCoupons();
        const messagesData = await dbService.getMessages();
        const teamData = await dbService.getTeam();
        const settingsData = await dbService.getSettings();
        
        setRooms(roomsData);
        setBookings(bookingsData);
        setUsers(usersData);
        setReviews(reviewsData);
        setCoupons(couponsData);
        setMessages(messagesData);
        setTeam(teamData);
        setSettings(settingsData);
        setSiteForm({
          contactEmail: settingsData.contactEmail || "",
          contactPhone: settingsData.contactPhone || "",
          contactAddress: settingsData.contactAddress || "",
          contactHours: settingsData.contactHours || "",
          aboutHeading: settingsData.aboutHeading || "",
          aboutSubheading: settingsData.aboutSubheading || "",
          aboutDescription: settingsData.aboutDescription || ""
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load administration database records.");
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, [activeTab]);

  // --- Statistics Calculation ---
  const totalRoomsCount = rooms.length;
  const totalUsersCount = users.filter(u => u.role !== "admin").length;
  const totalBookingsCount = bookings.length;
  const totalRevenue = bookings
    .filter(b => b.status === "approved" || b.status === "pending")
    .reduce((sum, b) => sum + Number(b.totalPrice), 0);
  
  // Occupancy Rate: Approved active bookings overlapping current date vs total rooms
  const occupancyRate = totalRoomsCount > 0 
    ? Math.round((bookings.filter(b => b.status === "approved").length / totalRoomsCount) * 100) 
    : 0;

  // Recharts Mock Analytics Data
  const monthlyRevenueData = [
    { name: "Jan", revenue: totalRevenue * 0.15 || 12000 },
    { name: "Feb", revenue: totalRevenue * 0.18 || 15000 },
    { name: "Mar", revenue: totalRevenue * 0.22 || 19000 },
    { name: "Apr", revenue: totalRevenue * 0.25 || 22000 },
    { name: "May", revenue: totalRevenue * 0.32 || 28000 },
    { name: "Jun", revenue: totalRevenue * 0.40 || 35000 },
    { name: "Jul", revenue: totalRevenue || 50000 }
  ];

  const occupancyRateData = [
    { name: "Suite", rate: 75 },
    { name: "Double", rate: 58 },
    { name: "Single", rate: 42 }
  ];

  // --- Action Handlers ---
  // Room Actions
  const handleRoomFormSubmit = async (e) => {
    e.preventDefault();
    if (!roomForm.name || !roomForm.price) {
      toast.warning("Room Name and Price are required.");
      return;
    }

    try {
      if (editingRoom) {
        await dbService.updateRoom(editingRoom.id, roomForm);
        toast.success("Room updated successfully!");
        setEditingRoom(null);
      } else {
        await dbService.addRoom(roomForm);
        toast.success("New Room added successfully!");
      }
      setShowAddRoomModal(false);
      resetRoomForm();
      const updatedRooms = await dbService.getRooms();
      setRooms(updatedRooms);
    } catch (err) {
      console.error(err);
      toast.error("Failed to save room details.");
    }
  };

  const handleEditRoom = (roomObj) => {
    setEditingRoom(roomObj);
    setRoomForm({ ...roomObj });
    setShowAddRoomModal(true);
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    try {
      await dbService.deleteRoom(roomId);
      toast.success("Room deleted successfully.");
      setRooms(rooms.filter(r => r.id !== roomId));
    } catch (err) {
      toast.error("Failed to delete room.");
    }
  };

  const handleRoomImageUploadSim = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    toast.info("Uploading image asset...");
    try {
      const url = await dbService.uploadImage(file);
      setRoomForm(prev => ({ ...prev, img: url }));
      toast.success("Asset uploaded successfully!");
    } catch (err) {
      toast.error("Upload failed.");
    }
  };

  const openTeamModal = (member = null) => {
    setEditingTeam(member);
    setTeamForm(member ? {
      name: member.name || "", Designation: member.Designation || "", img: member.img || "", bio: member.bio || "",
      phone: member.phone || "", email: member.email || "", salary: member.salary || "",
      attendance: member.attendance || "absent", attendanceDate: member.attendanceDate || ""
    } : { name: "", Designation: "", img: "", bio: "", phone: "", email: "", salary: "", attendance: "absent", attendanceDate: "" });
    setShowTeamModal(true);
  };

  const handleTeamFormSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...teamForm };
    try {
      if (editingTeam) {
        await dbService.updateTeamMember(editingTeam.id, payload);
        toast.success("Team member updated successfully.");
      } else {
        await dbService.addTeamMember(payload);
        toast.success("Team member added successfully.");
      }
      const updatedTeam = await dbService.getTeam();
      setTeam(updatedTeam);
      setShowTeamModal(false);
      setEditingTeam(null);
      setTeamForm({ name: "", Designation: "", img: "", bio: "", phone: "", email: "", salary: "", attendance: "absent", attendanceDate: "" });
    } catch (err) {
      console.error(err);
      toast.error("Could not save team member.");
    }
  };

  const handleDeleteTeamMember = async (id) => {
    if (!window.confirm("Delete this team member?")) return;
    try {
      await dbService.deleteTeamMember(id);
      setTeam(team.filter((member) => member.id !== id));
      toast.success("Team member removed.");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete team member.");
    }
  };

  const handleAttendanceUpdate = async (member, attendance) => {
    try {
      const updatedMember = {
        ...member,
        attendance,
        attendanceDate: new Date().toISOString().slice(0, 10)
      };
      await dbService.updateTeamMember(member.id, updatedMember);
      setTeam(team.map((item) => item.id === member.id ? updatedMember : item));
      toast.success(`${member.name} marked ${attendance}.`);
    } catch (err) {
      console.error(err);
      toast.error("Could not update attendance.");
    }
  };

  const handleSettingsSave = async (e) => {
    e.preventDefault();
    try {
      const saved = await dbService.saveSettings(siteForm);
      setSettings(saved);
      toast.success("Site settings saved.");
    } catch (err) {
      console.error(err);
      toast.error("Unable to save site settings.");
    }
  };

  const resetRoomForm = () => {
    setRoomForm({
      name: "", price: "", bed: "1", bath: "1", desc: "", type: "single", amenities: ["Wifi", "AC", "TV"], img: "", availability: true
    });
  };

  // Booking Actions
  const handleBookingAction = async (id, status) => {
    try {
      await dbService.updateBookingStatus(id, status);
      toast.success(`Booking status updated to ${status}.`);
      setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
    } catch (err) {
      toast.error("Action failed.");
    }
  };

  // User Actions
  const handleToggleUserBlock = async (userObj) => {
    const nextStatus = userObj.status === "block" ? "unblock" : "block";
    try {
      await dbService.updateUserStatus(userObj.id, nextStatus);
      toast.success(`User successfully ${nextStatus}ed.`);
      setUsers(users.map(u => u.id === userObj.id ? { ...u, status: nextStatus } : u));
    } catch (err) {
      toast.error("Action failed.");
    }
  };

  const handleDeleteUser = async (uid) => {
    if (!window.confirm("Delete this user account permanently?")) return;
    try {
      await dbService.deleteUser(uid);
      toast.success("User deleted.");
      setUsers(users.filter(u => u.id !== uid));
    } catch (err) {
      toast.error("Failed to delete user.");
    }
  };

  // Review Actions
  const handleApproveReview = async (rid) => {
    try {
      await dbService.approveReview(rid);
      toast.success("Review approved successfully.");
      setReviews(reviews.map(r => r.id === rid ? { ...r, approved: true } : r));
    } catch (err) {
      toast.error("Failed to approve review.");
    }
  };

  const handleDeleteReview = async (rid) => {
    if (!window.confirm("Delete this review comments?")) return;
    try {
      await dbService.deleteReview(rid);
      toast.success("Review deleted.");
      setReviews(reviews.filter(r => r.id !== rid));
    } catch (err) {
      toast.error("Failed to delete review.");
    }
  };

  // Coupon Actions
  const handleAddCoupon = async (e) => {
    e.preventDefault();
    if (!couponForm.code || !couponForm.discount) return;
    try {
      const payload = {
        code: couponForm.code.toUpperCase(),
        discount: Number(couponForm.discount),
        type: couponForm.type,
        desc: couponForm.desc || `${couponForm.discount} discount code`
      };
      await dbService.addCoupon(payload);
      toast.success("Coupon code created!");
      setCouponForm({ code: "", discount: "", type: "percent", desc: "" });
      const updatedCoupons = await dbService.getCoupons();
      setCoupons(updatedCoupons);
    } catch (err) {
      toast.error("Failed to add coupon.");
    }
  };

  const handleDeleteCoupon = async (cid) => {
    try {
      await dbService.deleteCoupon(cid);
      toast.success("Coupon deleted.");
      setCoupons(coupons.filter(c => c.id !== cid));
    } catch (err) {
      toast.error("Failed to delete coupon.");
    }
  };

  // Toggle amenities in roomForm
  const toggleRoomFormAmenity = (name) => {
    const list = roomForm.amenities;
    if (list.includes(name)) {
      setRoomForm(prev => ({ ...prev, amenities: list.filter(a => a !== name) }));
    } else {
      setRoomForm(prev => ({ ...prev, amenities: [...list, name] }));
    }
  };

  // Filters
  const filteredBookings = bookings.filter(
    b => b.id.toLowerCase().includes(bookingSearch.toLowerCase()) || b.userName.toLowerCase().includes(bookingSearch.toLowerCase())
  );

  const filteredUsers = users.filter(
    u => u.role !== "admin" && (u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Admin Sidebar Navigation */}
          <div className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-3xl p-6 h-fit space-y-2 shadow-sm">
            <div className="pb-4 border-b border-slate-100 dark:border-slate-850 mb-4">
              <h2 className="font-extrabold text-slate-950 dark:text-white uppercase tracking-wider text-sm">Control Panel</h2>
              <span className="text-[10px] text-primary font-bold uppercase">Role: Super Admin</span>
            </div>

            {[
              { tab: "analytics", label: "Dashboard Analytics", icon: <BarChart3 size={16} /> },
              { tab: "rooms", label: "Suite Rooms Manage", icon: <BedDouble size={16} /> },
              { tab: "bookings", label: "Manage Reservations", icon: <Briefcase size={16} /> },
              { tab: "users", label: "Customer Control", icon: <Users size={16} /> },
              { tab: "team", label: "Hotel Staff", icon: <Users size={16} /> },
              { tab: "messages", label: "Contact Messages", icon: <MessageSquare size={16} /> },
              { tab: "reviews", label: "Review Moderation", icon: <MessageSquare size={16} /> },
              { tab: "coupons", label: "Promo Coupons", icon: <Tag size={16} /> },
              { tab: "settings", label: "Site Settings", icon: <Grid size={16} /> }
            ].map((btn) => (
              <button
                key={btn.tab}
                onClick={() => setActiveTab(btn.tab)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                  activeTab === btn.tab
                    ? "bg-primary text-white"
                    : "text-slate-700 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {btn.icon}
                <span>{btn.label}</span>
              </button>
            ))}
          </div>

          {/* Admin Main Window Panels */}
          <div className="lg:col-span-3">
            
            {/* ----------------- 1. ANALYTICS PANEL ----------------- */}
            {activeTab === "analytics" && (
              <div className="space-y-8 animate-fadeIn">
                
                {/* Stats Blocks */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Total Suites", val: totalRoomsCount, color: "text-blue-500", icon: <BedDouble size={20} /> },
                    { label: "Total Guests", val: totalUsersCount, color: "text-indigo-500", icon: <Users size={20} /> },
                    { label: "Bookings Paid", val: totalBookingsCount, color: "text-emerald-500", icon: <Briefcase size={20} /> },
                    { label: "Total Revenue", val: `INR ${totalRevenue.toFixed(0)}`, color: "text-amber-500", icon: <Percent size={20} /> }
                  ].map((stat, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 p-6 rounded-3xl shadow-sm flex flex-col justify-between">
                      <div className="flex justify-between items-center text-slate-400">
                        <span className="text-[10px] font-bold uppercase tracking-wider">{stat.label}</span>
                        <div className={`${stat.color} bg-slate-50 dark:bg-slate-950 p-2 rounded-xl`}>{stat.icon}</div>
                      </div>
                      <h4 className="text-xl font-black dark:text-white mt-4">{stat.val}</h4>
                    </div>
                  ))}
                </div>

                {/* Occupancy and Analytics visual grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Revenue Growth Line Chart */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Monthly Revenue Growth</h3>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={monthlyRevenueData}>
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                          <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                          <Tooltip />
                          <Line type="monotone" dataKey="revenue" stroke="#c59562" strokeWidth={3} dot={{ r: 4 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Occupancy Rate Bar Chart */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Occupancy Rate by Room Type (%)</h3>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsBarChart data={occupancyRateData}>
                          <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} tickLine={false} />
                          <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                          <Tooltip />
                          <Bar dataKey="rate" fill="#a87948" radius={[8, 8, 0, 0]} />
                        </RechartsBarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* ----------------- 2. ROOMS MANAGEMENT ----------------- */}
            {activeTab === "rooms" && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm animate-fadeIn">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h3 className="font-bold dark:text-white uppercase tracking-wider text-sm">Suite List</h3>
                  <button
                    onClick={() => {
                      resetRoomForm();
                      setEditingRoom(null);
                      setShowAddRoomModal(true);
                    }}
                    className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5 transition"
                  >
                    <Plus size={14} />
                    <span>Add Room</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {rooms.map((r) => (
                    <div key={r.id} className="border border-slate-200/60 dark:border-slate-800 rounded-2xl overflow-hidden flex bg-slate-50 dark:bg-slate-950">
                      <img src={r.img} alt={r.name} className="w-24 h-full object-cover flex-shrink-0" />
                      <div className="p-4 flex-grow flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-slate-850 dark:text-white text-xs uppercase truncate">{r.name}</h4>
                          <span className="text-[10px] text-primary font-bold block mt-0.5">INR {r.price} / night</span>
                          <span className="text-[9px] text-slate-400 block">{r.bed} Bed(s) • {r.bath} Bath(s)</span>
                        </div>
                        <div className="flex space-x-2 mt-4 self-end">
                          <button
                            onClick={() => handleEditRoom(r)}
                            className="p-2 bg-white dark:bg-slate-850 hover:bg-slate-100 rounded-lg text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800"
                          >
                            <Edit size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteRoom(r.id)}
                            className="p-2 bg-white dark:bg-slate-850 hover:bg-red-50 rounded-lg text-red-600 border border-slate-200 dark:border-slate-850"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ----------------- 3. RESERVATIONS MANAGEMENT ----------------- */}
            {activeTab === "bookings" && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm animate-fadeIn">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h3 className="font-bold dark:text-white uppercase tracking-wider text-sm">Customer Bookings</h3>
                  {/* Search bar */}
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-450" size={14} />
                    <input
                      type="text"
                      placeholder="Search Customer/ID"
                      value={bookingSearch}
                      onChange={(e) => setBookingSearch(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-150 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                        <th className="pb-3">Ref / Client</th>
                        <th className="pb-3">Room</th>
                        <th className="pb-3">Dates</th>
                        <th className="pb-3">Net Price</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Approval Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                      {filteredBookings.map((b) => (
                        <tr key={b.id} className="text-slate-700 dark:text-slate-350">
                          <td className="py-4">
                            <span className="font-bold text-slate-900 dark:text-white uppercase">{b.userName}</span>
                            <span className="block text-[9px] text-slate-400 mt-0.5">{b.id}</span>
                          </td>
                          <td className="py-4 font-bold text-slate-850 dark:text-slate-200">{b.roomName}</td>
                          <td className="py-4">
                            <span>{b.checkIn} to</span>
                            <span className="block text-[9px] text-slate-400 mt-0.5">{b.checkOut}</span>
                          </td>
                          <td className="py-4 font-bold">INR {b.totalPrice}</td>
                          <td className="py-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                              b.status === "approved" ? "bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400" :
                              b.status === "rejected" ? "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400" :
                              b.status === "cancelled" ? "bg-slate-100 text-slate-650" :
                              "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400"
                            }`}>
                              {b.status}
                            </span>
                          </td>
                          <td className="py-4 text-right flex justify-end space-x-1.5">
                            {b.status === "pending" && (
                              <>
                                <button
                                  onClick={() => handleBookingAction(b.id, "approved")}
                                  className="p-1.5 bg-green-550/10 text-green-600 rounded-lg border border-green-500/20 hover:bg-green-550 hover:text-white transition"
                                  title="Approve"
                                >
                                  <Check size={12} />
                                </button>
                                <button
                                  onClick={() => handleBookingAction(b.id, "rejected")}
                                  className="p-1.5 bg-red-550/10 text-red-650 rounded-lg border border-red-500/20 hover:bg-red-550 hover:text-white transition"
                                  title="Reject"
                                >
                                  <X size={12} />
                                </button>
                              </>
                            )}
                            {(b.status === "approved" || b.status === "pending") && (
                              <button
                                onClick={() => handleBookingAction(b.id, "cancelled")}
                                className="p-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-500 hover:text-red-500"
                                title="Force Cancel"
                              >
                                <XCircle size={12} />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ----------------- 4. CUSTOMERS MANAGEMENT ----------------- */}
            {activeTab === "users" && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm animate-fadeIn">
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h3 className="font-bold dark:text-white uppercase tracking-wider text-sm">Customer Database</h3>
                  <div className="relative w-48">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-450" size={14} />
                    <input
                      type="text"
                      placeholder="Search Client"
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl pl-9 pr-4 py-2 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-150 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                        <th className="pb-3">Client</th>
                        <th className="pb-3">Email</th>
                        <th className="pb-3">Account Status</th>
                        <th className="pb-3 text-right">Moderation Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                      {filteredUsers.map((u) => (
                        <tr key={u.id} className="text-slate-700 dark:text-slate-350">
                          <td className="py-4 font-bold text-slate-900 dark:text-white">{u.name}</td>
                          <td className="py-4">{u.email}</td>
                          <td className="py-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                              u.status === "block" ? "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400" : "bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400"
                            }`}>
                              {u.status}
                            </span>
                          </td>
                          <td className="py-4 text-right flex justify-end space-x-1.5">
                            <button
                              onClick={() => handleToggleUserBlock(u)}
                              className={`p-1.5 border rounded-lg transition ${
                                u.status === "block" 
                                  ? "border-green-200 dark:border-green-950 text-green-600 hover:bg-green-50"
                                  : "border-amber-200 dark:border-amber-950 text-amber-600 hover:bg-amber-50"
                              }`}
                              title={u.status === "block" ? "Unblock User" : "Block User"}
                            >
                              <UserX size={12} />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(u.id)}
                              className="p-1.5 border border-red-200 dark:border-red-950 text-red-650 hover:bg-red-50 rounded-lg transition"
                              title="Delete Account"
                            >
                              <Trash2 size={12} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ----------------- 5. HOTEL STAFF MANAGEMENT ----------------- */}
            {activeTab === "team" && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm animate-fadeIn">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <h3 className="font-bold dark:text-white uppercase tracking-wider text-sm">Hotel Staff Directory</h3>
                    <p className="text-xs text-slate-500 mt-1">Manage employee contact details, salary, and today's attendance.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openTeamModal()}
                    className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition"
                  >
                    <Plus size={14} /> Add staff
                  </button>
                </div>

                {team.length === 0 ? (
                  <div className="text-center py-12 text-slate-500 text-sm">No staff members yet. Add your first hotel employee.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-150 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                          <th className="pb-3">Staff member</th>
                          <th className="pb-3">Contact</th>
                          <th className="pb-3">Salary</th>
                          <th className="pb-3">Attendance</th>
                          <th className="pb-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
                        {team.map((member) => (
                          <tr key={member.id} className="text-slate-700 dark:text-slate-300">
                            <td className="py-4">
                              <div className="flex items-center gap-3 min-w-44">
                                {member.img ? <img src={member.img} alt={member.name} className="w-9 h-9 rounded-full object-cover" /> : <div className="w-9 h-9 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold">{member.name?.charAt(0)}</div>}
                                <div><p className="font-bold text-slate-900 dark:text-white">{member.name}</p><p className="text-[10px] text-slate-500">{member.Designation || "Hotel staff"}</p></div>
                              </div>
                            </td>
                            <td className="py-4"><p>{member.phone || "—"}</p><p className="text-[10px] text-slate-500">{member.email || "No email"}</p></td>
                            <td className="py-4 font-semibold">{member.salary ? `INR ${Number(member.salary).toLocaleString()}` : "—"}</td>
                            <td className="py-4">
                              <span className={`px-2.5 py-1 rounded-full text-[9px] font-bold uppercase ${member.attendance === "present" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>{member.attendance || "absent"}</span>
                              <p className="text-[9px] text-slate-400 mt-1">{member.attendanceDate || "Not marked"}</p>
                            </td>
                            <td className="py-4"><div className="flex justify-end gap-1.5">
                              <button type="button" onClick={() => handleAttendanceUpdate(member, member.attendance === "present" ? "absent" : "present")} className="px-2 py-1 border border-green-200 text-green-700 rounded-lg text-[9px] font-bold uppercase">Mark {member.attendance === "present" ? "absent" : "present"}</button>
                              <button type="button" onClick={() => openTeamModal(member)} className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg"><Edit size={13} /></button>
                              <button type="button" onClick={() => handleDeleteTeamMember(member.id)} className="p-2 border border-red-200 text-red-600 rounded-lg"><Trash2 size={13} /></button>
                            </div></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* ----------------- 6. CONTACT MESSAGES MANAGEMENT ----------------- */}
            {activeTab === "messages" && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm animate-fadeIn">
                <h3 className="font-bold dark:text-white uppercase tracking-wider text-sm border-b border-slate-100 dark:border-slate-800 pb-3">
                  Contact Form Messages ({messages.length})
                </h3>

                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 text-sm">
                      <MessageSquare size={32} className="mx-auto mb-4 opacity-30" />
                      <p>No contact messages received yet.</p>
                    </div>
                  ) : (
                    messages.map((msg, idx) => (
                      <div 
                        key={msg.id} 
                        className={`p-6 border rounded-2xl transition ${
                          msg.status === "read" 
                            ? "border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950" 
                            : "border-primary/30 bg-primary/5 dark:bg-primary/10"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-sm">{msg.name}</h4>
                            <p className="text-xs text-slate-500">{msg.email}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                              msg.status === "read" 
                                ? "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300" 
                                : "bg-primary text-white"
                            }`}>
                              {msg.status === "unread" ? "🔔 New" : "Read"}
                            </span>
                          </div>
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                            {msg.subject}
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                            {msg.message}
                          </p>
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-slate-800">
                          <span className="text-[10px] text-slate-500">
                            {new Date(msg.createdAt).toLocaleDateString()} {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <div className="flex items-center space-x-2">
                            {msg.status === "unread" && (
                              <button
                                onClick={async () => {
                                  try {
                                    await dbService.updateMessageStatus(msg.id, "read");
                                    const updatedMessages = await dbService.getMessages();
                                    setMessages(updatedMessages);
                                    toast.success("Message marked as read.");
                                  } catch (err) {
                                    console.error(err);
                                    toast.error("Failed to update message status.");
                                  }
                                }}
                                className="px-3 py-1.5 bg-primary text-white rounded-lg text-[10px] font-bold uppercase hover:bg-primary-dark transition"
                              >
                                Mark as Read
                              </button>
                            )}
                            <button
                              onClick={async () => {
                                if (window.confirm("Are you sure you want to delete this message?")) {
                                  try {
                                    await dbService.deleteMessage(msg.id);
                                    const updatedMessages = await dbService.getMessages();
                                    setMessages(updatedMessages);
                                    toast.success("Message deleted successfully.");
                                  } catch (err) {
                                    console.error(err);
                                    toast.error("Failed to delete message.");
                                  }
                                }
                              }}
                              className="p-2 border border-red-200 dark:border-red-950 text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ----------------- 6. REVIEW MODERATION ----------------- */}
            {activeTab === "reviews" && (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm animate-fadeIn">
                <h3 className="font-bold dark:text-white uppercase tracking-wider text-sm border-b border-slate-100 dark:border-slate-800 pb-3">
                  Pending & Approved Reviews
                </h3>

                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <div className="text-center py-6 text-slate-500 text-xs">No customer reviews submitted.</div>
                  ) : (
                    reviews.map((rev) => (
                      <div key={rev.id} className="p-5 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-2xl flex flex-col md:flex-row justify-between gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-3">
                            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase">{rev.userName}</h4>
                            <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase ${
                              rev.approved ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                            }`}>
                              {rev.approved ? "Approved" : "Pending Approval"}
                            </span>
                          </div>
                          <p className="text-slate-600 dark:text-slate-350 text-xs leading-relaxed">"{rev.comment}"</p>
                        </div>
                        <div className="flex items-center space-x-2 self-end md:self-center">
                          {!rev.approved && (
                            <button
                              onClick={() => handleApproveReview(rev.id)}
                              className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-[10px] font-bold uppercase transition"
                            >
                              Approve
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteReview(rev.id)}
                            className="p-2 border border-red-200 dark:border-red-950 text-red-650 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* ----------------- 6. COUPON MANAGEMENT ----------------- */}
            {activeTab === "coupons" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fadeIn">
                
                {/* Form to create coupon */}
                <form onSubmit={handleAddCoupon} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm h-fit">
                  <h3 className="font-bold dark:text-white uppercase tracking-wider text-sm border-b border-slate-100 dark:border-slate-800 pb-3">
                    Add Coupon Code
                  </h3>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Coupon Code</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. EXTRA15"
                      value={couponForm.code}
                      onChange={(e) => setCouponForm(prev => ({ ...prev, code: e.target.value }))}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Discount Amount</label>
                    <input
                      type="number"
                      required
                      placeholder="15"
                      value={couponForm.discount}
                      onChange={(e) => setCouponForm(prev => ({ ...prev, discount: e.target.value }))}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Discount Type</label>
                    <select
                      value={couponForm.type}
                      onChange={(e) => setCouponForm(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-xs focus:outline-none text-slate-950 dark:text-white"
                    >
                      <option value="percent">Percentage (%)</option>
                      <option value="flat">Flat Cash Value (INR)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Description</label>
                    <input
                      type="text"
                      placeholder="15% discount for members"
                      value={couponForm.desc}
                      onChange={(e) => setCouponForm(prev => ({ ...prev, desc: e.target.value }))}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold uppercase tracking-wider transition"
                  >
                    Create Coupon
                  </button>
                </form>

                {/* Coupon listings */}
                <div className="md:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
                  <h3 className="font-bold dark:text-white uppercase tracking-wider text-sm border-b border-slate-100 dark:border-slate-800 pb-3">
                    Active Coupons
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {coupons.map((c) => (
                      <div key={c.id} className="p-4 border border-dashed border-slate-300 dark:border-slate-850 rounded-2xl flex justify-between items-center bg-slate-50 dark:bg-slate-950">
                        <div>
                          <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-xs font-black uppercase tracking-wider">
                            {c.code}
                          </span>
                          <span className="block text-[10px] text-slate-500 mt-2 font-semibold">
                            {c.desc} ({c.type === "percent" ? `${c.discount}% Off` : `INR ${c.discount} Flat`})
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteCoupon(c.id)}
                          className="p-1.5 border border-red-200 dark:border-red-950 text-red-650 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

          </div>
        </div>
      </div>

      {/* --- ADD / EDIT ROOM MODAL OVERLAY --- */}
      {showAddRoomModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full max-h-[85vh] overflow-y-auto space-y-6 shadow-2xl relative animate-scaleIn">
            
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-805 pb-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-850 dark:text-white">
                {editingRoom ? `Edit Room: ${editingRoom.name}` : "Add New Room"}
              </h3>
              <button 
                onClick={() => setShowAddRoomModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRoomFormSubmit} className="space-y-4">
              
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Suite Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Executive Royal Suite"
                  value={roomForm.name}
                  onChange={(e) => setRoomForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                />
              </div>

              {/* Price & Type */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Price Per Night (INR)</label>
                  <input
                    type="number"
                    required
                    placeholder="4500"
                    value={roomForm.price}
                    onChange={(e) => setRoomForm(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Room Type</label>
                  <select
                    value={roomForm.type}
                    onChange={(e) => setRoomForm(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none text-slate-900 dark:text-white"
                  >
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                    <option value="suite">Suite</option>
                  </select>
                </div>
              </div>

              {/* Beds & Baths */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Beds count</label>
                  <select
                    value={roomForm.bed}
                    onChange={(e) => setRoomForm(prev => ({ ...prev, bed: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none text-slate-900 dark:text-white"
                  >
                    <option value="1">1 Bed</option>
                    <option value="2">2 Beds</option>
                    <option value="3">3 Beds</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Baths count</label>
                  <select
                    value={roomForm.bath}
                    onChange={(e) => setRoomForm(prev => ({ ...prev, bath: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none text-slate-900 dark:text-white"
                  >
                    <option value="1">1 Bath</option>
                    <option value="2">2 Baths</option>
                    <option value="3">3 Baths</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Description</label>
                <textarea
                  rows="3"
                  placeholder="Describe the rooms details..."
                  value={roomForm.desc}
                  onChange={(e) => setRoomForm(prev => ({ ...prev, desc: e.target.value }))}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl p-4 text-xs focus:outline-none"
                />
              </div>

              {/* Amenities List */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">Amenities</label>
                <div className="grid grid-cols-3 gap-2">
                  {amenitiesOptions.map((amn) => {
                    const isChecked = roomForm.amenities.includes(amn);
                    return (
                      <button
                        key={amn}
                        type="button"
                        onClick={() => toggleRoomFormAmenity(amn)}
                        className={`py-2 rounded-xl text-[10px] font-bold uppercase transition border ${
                          isChecked 
                            ? "bg-primary text-white border-primary" 
                            : "bg-slate-50 dark:bg-slate-950 text-slate-500 border-slate-200 dark:border-slate-800"
                        }`}
                      >
                        {amn}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Image upload simulation */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Suite Photo Asset</label>
                <div className="flex gap-4 items-center">
                  <input
                    type="text"
                    placeholder="Or enter Image URL"
                    value={roomForm.img}
                    onChange={(e) => setRoomForm(prev => ({ ...prev, img: e.target.value }))}
                    className="flex-grow bg-slate-50 dark:bg-slate-950 border border-slate-205 dark:border-slate-800 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                  />
                  <div className="relative">
                    <input
                      type="file"
                      id="roomImgFile"
                      onChange={handleRoomImageUploadSim}
                      className="hidden"
                      accept="image/*"
                    />
                    <label
                      htmlFor="roomImgFile"
                      className="px-4 py-2.5 bg-slate-900 hover:bg-slate-850 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold uppercase flex items-center space-x-1 cursor-pointer"
                    >
                      <Upload size={14} />
                      <span>Upload</span>
                    </label>
                  </div>
                </div>
                {roomForm.img && (
                  <img src={roomForm.img} alt="Preview" className="w-16 h-16 object-cover rounded-xl mt-2 border border-slate-200 dark:border-slate-800" />
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold uppercase tracking-widest transition shadow-lg shadow-primary/20 cursor-pointer"
              >
                {editingRoom ? "Update Suite" : "Add Suite"}
              </button>

            </form>

          </div>
        </div>
      )}

      {showTeamModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl relative animate-scaleIn">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-850 dark:text-white">
                  {editingTeam ? `Edit Staff: ${editingTeam.name}` : "Add New Staff Member"}
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Store employment details privately in the staff directory.</p>
              </div>
              <button onClick={() => setShowTeamModal(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleTeamFormSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Full Name</label>
                <input
                  type="text"
                  required
                  value={teamForm.name}
                  onChange={(e) => setTeamForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Designation</label>
                <input
                  type="text"
                  required
                  value={teamForm.Designation}
                  onChange={(e) => setTeamForm(prev => ({ ...prev, Designation: e.target.value }))}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Photo URL</label>
                <input
                  type="url"
                  value={teamForm.img}
                  onChange={(e) => setTeamForm(prev => ({ ...prev, img: e.target.value }))}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Mobile number</label>
                  <input type="tel" required value={teamForm.phone} onChange={(e) => setTeamForm(prev => ({ ...prev, phone: e.target.value }))} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-xs focus:outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Email address</label>
                  <input type="email" required value={teamForm.email} onChange={(e) => setTeamForm(prev => ({ ...prev, email: e.target.value }))} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-xs focus:outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Monthly salary (INR)</label>
                  <input type="number" min="0" required value={teamForm.salary} onChange={(e) => setTeamForm(prev => ({ ...prev, salary: e.target.value }))} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-xs focus:outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Attendance</label>
                  <select value={teamForm.attendance} onChange={(e) => setTeamForm(prev => ({ ...prev, attendance: e.target.value, attendanceDate: new Date().toISOString().slice(0, 10) }))} className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-xs focus:outline-none">
                    <option value="present">Present</option><option value="absent">Absent</option><option value="leave">On leave</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Short Bio</label>
                <textarea
                  rows="4"
                  value={teamForm.bio}
                  onChange={(e) => setTeamForm(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-xs focus:outline-none"
                />
              </div>
              <button type="submit" className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-bold uppercase tracking-widest transition">
                {editingTeam ? "Save Staff Changes" : "Add Staff Member"}
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
