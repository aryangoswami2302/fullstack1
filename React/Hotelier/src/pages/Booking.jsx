import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { dbService } from "../services/db";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { 
  Calendar, 
  Users, 
  MapPin, 
  CreditCard, 
  CheckCircle, 
  Tag, 
  Percent, 
  AlertTriangle,
  ArrowRight,
  Printer
} from "lucide-react";

export default function Booking() {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Read URL params
  const checkIn = searchParams.get("checkIn") || "";
  const checkOut = searchParams.get("checkOut") || "";
  const guests = searchParams.get("guests") || "1";

  // Form Fields
  const [fullName, setFullName] = useState(currentUser?.displayName || currentUser?.name || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [phone, setPhone] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  // Coupon States
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Price calculations
  const [nights, setNights] = useState(1);
  const [basePrice, setBasePrice] = useState(0);
  const [tax, setTax] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    async function loadRoom() {
      try {
        const roomData = await dbService.getRoomById(roomId);
        if (!roomData) {
          toast.error("Selected room could not be found.");
          navigate("/rooms");
          return;
        }
        setRoom(roomData);

        // Calculate nights
        if (checkIn && checkOut) {
          const start = new Date(checkIn);
          const end = new Date(checkOut);
          const diffTime = Math.abs(end - start);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          setNights(diffDays || 1);
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load booking details.");
      } finally {
        setLoading(false);
      }
    }
    loadRoom();
  }, [roomId, checkIn, checkOut, navigate]);

  useEffect(() => {
    if (!room) return;

    const base = Number(room.price) * nights;
    let discount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.type === "percent") {
        discount = (base * appliedCoupon.discount) / 100;
      } else {
        discount = appliedCoupon.discount;
      }
    }

    const calculatedTax = (base - discount) * 0.12; // 12% standard luxury service GST
    const total = base - discount + calculatedTax;

    setBasePrice(base);
    setDiscountAmount(discount);
    setTax(calculatedTax);
    setTotalPrice(total);
  }, [room, nights, appliedCoupon]);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    try {
      const coupons = await dbService.getCoupons();
      const match = coupons.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase());
      if (match) {
        setAppliedCoupon(match);
        toast.success(`Coupon "${match.code}" applied! You saved INR ${match.type === "percent" ? `${match.discount}%` : `Flat ${match.discount}`}`);
      } else {
        toast.error("Invalid coupon code.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error validating coupon.");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponCode("");
    toast.info("Coupon code removed.");
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!phone) {
      toast.warning("Please enter your contact phone number.");
      return;
    }

    setSubmitting(true);
    try {
      const bookingPayload = {
        roomId,
        roomName: room.name,
        roomImg: room.img,
        userId: currentUser.uid || currentUser.id,
        userName: fullName,
        userEmail: email,
        userPhone: phone,
        checkIn,
        checkOut,
        guests,
        nights,
        pricePerNight: room.price,
        basePrice,
        discountAmount,
        couponCode: appliedCoupon?.code || "",
        tax,
        totalPrice,
        specialRequests,
        status: "pending" // starts as pending, approved by admin
      };

      const result = await dbService.addBooking(bookingPayload);
      setBookingSuccess(result);
      toast.success("Booking placed successfully!");
      
      // Simulate confirmation email log
      console.log(`[EMAIL SEND SIMULATION] Sending booking confirmation to ${email} for Booking Ref: ${result.id}`);
    } catch (err) {
      console.error(err);
      toast.error("Failed to process booking. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Booking Success Screen
  if (bookingSuccess) {
    return (
      <div className="flex-grow flex flex-col bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-16 flex-grow flex flex-col justify-center items-center">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-xl text-center w-full space-y-8 animate-fadeIn">
            
            <div className="mx-auto w-20 h-20 bg-green-100 dark:bg-green-950/20 text-green-600 dark:text-green-500 rounded-full flex items-center justify-center">
              <CheckCircle size={48} className="fill-current" />
            </div>

            <div>
              <span className="px-3 py-1 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 text-xs font-bold uppercase rounded-full">
                Booking Successful
              </span>
              <h1 className="text-3xl font-extrabold mt-4 uppercase dark:text-white">Reservation Confirmed</h1>
              <p className="text-slate-500 text-sm mt-2">
                Your luxury suite has been reserved. A confirmation email was sent to <span className="font-bold">{bookingSuccess.userEmail}</span>.
              </p>
            </div>

            {/* Receipt Summary */}
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-800 rounded-2xl p-6 text-left space-y-4">
              <div className="flex justify-between text-xs text-slate-400 font-bold uppercase">
                <span>Booking ID</span>
                <span className="text-slate-850 dark:text-white font-black">{bookingSuccess.id}</span>
              </div>
              <hr className="border-slate-200 dark:border-slate-800" />
              <div className="space-y-1">
                <h3 className="font-bold text-slate-850 dark:text-white uppercase text-sm">{bookingSuccess.roomName}</h3>
                <div className="text-xs text-slate-550 flex space-x-4">
                  <span>{bookingSuccess.nights} Night(s)</span>
                  <span>•</span>
                  <span>{bookingSuccess.guests} Guest(s)</span>
                </div>
              </div>
              <hr className="border-slate-200 dark:border-slate-800" />
              <div className="grid grid-cols-2 gap-y-2 text-sm text-slate-600 dark:text-slate-350">
                <span>Check-in</span>
                <span className="text-right font-semibold text-slate-900 dark:text-white">{bookingSuccess.checkIn}</span>
                <span>Check-out</span>
                <span className="text-right font-semibold text-slate-900 dark:text-white">{bookingSuccess.checkOut}</span>
              </div>
              <hr className="border-slate-200 dark:border-slate-800" />
              <div className="flex justify-between items-baseline pt-2">
                <span className="text-xs text-slate-400 font-bold uppercase">Total Charged</span>
                <span className="text-xl font-black text-slate-900 dark:text-white">INR {bookingSuccess.totalPrice.toFixed(0)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button 
                onClick={() => window.print()}
                className="flex-1 py-3.5 border border-slate-300 dark:border-slate-700 rounded-2xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                <Printer size={16} />
                <span>Print Invoice</span>
              </button>
              
              <Link 
                to="/dashboard"
                className="flex-1 py-3.5 bg-primary hover:bg-primary-dark text-white rounded-2xl font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-md shadow-primary/20"
              >
                <span>Go to Dashboard</span>
                <ArrowRight size={16} />
              </Link>
            </div>

          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex-grow flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
        
        {/* Title */}
        <div className="mb-10 text-center lg:text-left">
          <h1 className="text-3xl font-extrabold tracking-wide dark:text-white uppercase leading-none">Confirm Booking</h1>
          <p className="text-sm text-slate-500 mt-2">Verify details and fill out checkout details to reserve your suite.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Checkout Forms */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Traveler info form */}
            <form onSubmit={handleConfirmBooking} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              <h2 className="text-lg font-bold dark:text-white uppercase border-b border-slate-100 dark:border-slate-800 pb-3 tracking-wide">
                Traveler Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Full name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-550">Contact Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                {/* Email address */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-550">Contact Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                {/* Phone number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-550">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +91 98765 43210"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                {/* Special requests */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-550">Special Requests</label>
                  <textarea
                    rows="3"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="e.g. Early check-in, dietary restrictions, airport shuttle arrangements"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl p-4 text-sm text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Secure Payment Notice */}
              <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200/50 dark:border-slate-850 rounded-2xl flex items-center space-x-3 text-xs text-slate-500">
                <CreditCard className="text-primary flex-shrink-0" size={18} />
                <span>By continuing, you agree that your payment will be securely processed at the front desk upon check-in.</span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-primary hover:bg-primary-dark disabled:bg-slate-400 text-white rounded-2xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/20 transition cursor-pointer"
              >
                {submitting ? "Processing Reservation..." : "Confirm & Pay at Hotel"}
              </button>
            </form>
          </div>

          {/* Right Summary Sidebar */}
          <div className="space-y-6">
            
            {/* Booking Details Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold dark:text-white uppercase tracking-wider text-sm border-b border-slate-100 dark:border-slate-800 pb-3">
                Room Summary
              </h3>
              
              <div className="flex gap-4">
                <img src={room.img} alt={room.name} className="w-20 h-20 object-cover rounded-xl" />
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm">{room.name}</h4>
                  <div className="flex items-center text-xs text-slate-450 font-semibold">
                    <MapPin size={12} className="mr-1" />
                    <span>Luxury Wing</span>
                  </div>
                </div>
              </div>

              <hr className="border-slate-100 dark:border-slate-800" />

              {/* Checkin / Checkout summary */}
              <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-600 dark:text-slate-350">
                <div>
                  <span className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Check-in</span>
                  <span className="text-slate-900 dark:text-white">{checkIn || "Not Selected"}</span>
                </div>
                <div>
                  <span className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Check-out</span>
                  <span className="text-slate-900 dark:text-white">{checkOut || "Not Selected"}</span>
                </div>
                <div>
                  <span className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Nights</span>
                  <span className="text-slate-900 dark:text-white">{nights} Night(s)</span>
                </div>
                <div>
                  <span className="block text-slate-400 font-bold uppercase text-[10px] mb-1">Guests</span>
                  <span className="text-slate-900 dark:text-white">{guests} Guest(s)</span>
                </div>
              </div>
            </div>

            {/* Coupons Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold dark:text-white uppercase tracking-wider text-sm flex items-center gap-1.5">
                <Tag size={16} className="text-primary" />
                Promo Code
              </h3>

              {!appliedCoupon ? (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-grow bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-850 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold uppercase tracking-wide transition"
                  >
                    Apply
                  </button>
                </form>
              ) : (
                <div className="p-3.5 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Percent size={14} className="text-green-600 dark:text-green-400" />
                    <div>
                      <span className="text-xs font-bold text-green-700 dark:text-green-400 uppercase">
                        {appliedCoupon.code}
                      </span>
                      <span className="block text-[10px] text-slate-400">Coupon applied successfully!</span>
                    </div>
                  </div>
                  <button 
                    onClick={handleRemoveCoupon} 
                    className="text-[10px] text-red-500 hover:underline font-bold uppercase"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            {/* Pricing Summary Card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="font-bold dark:text-white uppercase tracking-wider text-sm">Price Details</h3>
              
              <div className="space-y-2 text-sm text-slate-600 dark:text-slate-350">
                <div className="flex justify-between">
                  <span>Base Fare ({nights} nights)</span>
                  <span>INR {basePrice}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400 font-semibold">
                    <span>Discount</span>
                    <span>- INR {discountAmount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Luxury Tax & Fees (12%)</span>
                  <span>INR {tax.toFixed(0)}</span>
                </div>
              </div>

              <hr className="border-slate-100 dark:border-slate-800" />

              <div className="flex justify-between items-baseline">
                <span className="font-bold dark:text-white text-sm">Total Price</span>
                <span className="text-2xl font-black text-slate-950 dark:text-white">
                  INR {totalPrice.toFixed(0)}
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>

      <Footer />
    </div>
  );
}
