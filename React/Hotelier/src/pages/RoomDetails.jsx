import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { dbService } from "../services/db";
import { useAuth } from "../context/AuthContext";
import { RoomDetailSkeleton } from "../components/Skeleton";
import { toast } from "react-toastify";
import { 
  Star, 
  Heart, 
  Calendar, 
  Users, 
  MapPin, 
  Wifi, 
  Tv, 
  Coffee, 
  Wind, 
  UtensilsCrossed, 
  Bath, 
  BedDouble, 
  ArrowLeft,
  ChevronRight,
  MessageSquare
} from "lucide-react";

export default function RoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, toggleWishlist } = useAuth();
  
  const [room, setRoom] = useState(null);
  const [similarRooms, setSimilarRooms] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Review Form States
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  // Booking Widget States
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("1");

  useEffect(() => {
    async function loadRoomDetails() {
      setLoading(true);
      try {
        const roomData = await dbService.getRoomById(id);
        if (!roomData) {
          toast.error("Room not found");
          navigate("/rooms");
          return;
        }
        setRoom(roomData);

        // Fetch similar rooms
        const allRooms = await dbService.getRooms();
        const filtered = allRooms.filter(r => r.id !== id && r.type === roomData.type);
        setSimilarRooms(filtered.slice(0, 3));

        // Fetch reviews
        const reviewsData = await dbService.getReviewsForRoom(id);
        setReviews(reviewsData);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load details");
      } finally {
        setLoading(false);
      }
    }
    loadRoomDetails();
  }, [id, navigate]);

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (!checkIn || !checkOut) {
      toast.warning("Please select Check-in and Check-out dates.");
      return;
    }
    if (new Date(checkIn) >= new Date(checkOut)) {
      toast.warning("Check-out date must be after check-in date.");
      return;
    }
    // Redirect to checkout with details
    navigate(`/booking/${id}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      toast.warning("Please login to submit a review.");
      return;
    }
    if (!comment.trim()) {
      toast.warning("Please enter a comment.");
      return;
    }

    setReviewSubmitting(true);
    try {
      const reviewPayload = {
        roomId: id,
        userId: currentUser.uid || currentUser.id,
        userName: currentUser.displayName || currentUser.name,
        rating,
        comment
      };
      await dbService.addReview(reviewPayload);
      toast.success("Review submitted! Admin approval is pending.");
      setComment("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit review.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-grow flex flex-col">
        <Navbar />
        <RoomDetailSkeleton />
        <Footer />
      </div>
    );
  }

  const images = room.images || [room.img];
  const isFavorited = currentUser?.wishlist?.includes(room.id);

  // Icon mapper for amenities
  const getAmenityIcon = (name) => {
    const list = {
      Wifi: <Wifi size={16} />,
      AC: <Wind size={16} />,
      TV: <Tv size={16} />,
      "Mini Bar": <Coffee size={16} />,
      "Room Service": <UtensilsCrossed size={16} />,
      "Gym Access": <Star size={16} />,
      Balcony: <MapPin size={16} />,
      "Bath Tub": <Bath size={16} />
    };
    return list[name] || <Star size={16} />;
  };

  return (
    <div className="flex-grow flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-grow">
        
        {/* Back Link */}
        <Link to="/rooms" className="inline-flex items-center space-x-2 text-sm text-slate-500 hover:text-primary transition font-semibold uppercase mb-6">
          <ArrowLeft size={16} />
          <span>Back to Rooms</span>
        </Link>

        {/* Header Details */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-wide dark:text-white uppercase leading-none">{room.name}</h1>
            <div className="flex items-center space-x-4 mt-3 text-sm text-slate-500 font-medium">
              <span className="flex items-center text-amber-500">
                <Star size={16} className="fill-current mr-1" />
                {room.rating || 4.7} ({reviews.length} Reviews)
              </span>
              <span>•</span>
              <span className="capitalize">{room.type} Suite</span>
            </div>
          </div>
          <button 
            onClick={() => toggleWishlist(room.id)}
            className="flex items-center space-x-2 px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 transition text-sm font-semibold uppercase text-slate-600 dark:text-slate-300"
          >
            <Heart size={16} className={isFavorited ? "fill-red-500 text-red-500" : ""} />
            <span>{isFavorited ? "Saved" : "Save Room"}</span>
          </button>
        </div>

        {/* Gallery Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 h-[50vh]">
          {/* Main big image */}
          <div className="md:col-span-2 rounded-3xl overflow-hidden shadow-sm relative h-full">
            <img src={images[0]} alt={room.name} className="w-full h-full object-cover" />
          </div>
          {/* Small images column */}
          <div className="hidden md:grid grid-rows-2 gap-4 h-full">
            <div className="rounded-3xl overflow-hidden shadow-sm h-full">
              <img src={images[1] || images[0]} alt={room.name} className="w-full h-full object-cover" />
            </div>
            <div className="rounded-3xl overflow-hidden shadow-sm h-full">
              <img src={images[2] || images[0]} alt={room.name} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Grid Layout: Info and Booking */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-10">
            {/* Specs bar */}
            <div className="flex gap-8 border-b border-slate-200 dark:border-slate-800 pb-6 text-slate-700 dark:text-slate-350">
              <div className="flex items-center space-x-2">
                <BedDouble size={20} className="text-primary" />
                <span className="font-semibold">{room.bed} Bed(s)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Bath size={20} className="text-primary" />
                <span className="font-semibold">{room.bath} Bath(s)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users size={20} className="text-primary" />
                <span className="font-semibold">Max 4 Guests</span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold dark:text-white uppercase tracking-wide">Room Description</h2>
              <p className="text-slate-600 dark:text-slate-350 text-sm leading-relaxed">{room.desc}</p>
            </div>

            {/* Amenities Grid */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold dark:text-white uppercase tracking-wide">Included Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {room.amenities?.map((amn) => (
                  <div key={amn} className="flex items-center space-x-3 p-3 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-xl">
                    <div className="text-primary">{getAmenityIcon(amn)}</div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{amn}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="space-y-8">
              <div className="flex items-center justify-between border-t border-slate-200/60 dark:border-slate-800 pt-8">
                <h2 className="text-xl font-bold dark:text-white uppercase tracking-wide">Guest Reviews</h2>
                <span className="text-sm font-semibold text-slate-500 uppercase">
                  {reviews.length} Approved Reviews
                </span>
              </div>

              {/* Individual reviews list */}
              {reviews.length === 0 ? (
                <div className="p-6 bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-2xl text-center text-slate-500 text-sm">
                  No reviews approved yet. Be the first to review!
                </div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((rev) => (
                    <div key={rev.id} className="p-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-slate-800 dark:text-white">{rev.userName}</h4>
                          <span className="text-[10px] text-slate-400 font-bold">{rev.date}</span>
                        </div>
                        <div className="flex text-amber-500">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} size={14} className="fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-600 dark:text-slate-350 text-sm leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Add review form */}
              {currentUser ? (
                <form onSubmit={handleReviewSubmit} className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-white flex items-center gap-1.5">
                    <MessageSquare size={16} className="text-primary" />
                    Write a Review
                  </h3>

                  {/* Rating Selector */}
                  <div className="flex items-center space-x-3">
                    <span className="text-xs text-slate-500 font-bold uppercase">Rating:</span>
                    <div className="flex space-x-1.5">
                      {[1, 2, 3, 4, 5].map((stars) => (
                        <button
                          key={stars}
                          type="button"
                          onClick={() => setRating(stars)}
                          className="text-amber-500 hover:scale-110 transition"
                        >
                          <Star size={20} className={rating >= stars ? "fill-amber-500" : "text-slate-300"} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comments Box */}
                  <textarea
                    rows="3"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us about your luxury experience..."
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 text-sm text-slate-950 dark:text-white"
                  />

                  {/* Submit Review */}
                  <button
                    type="submit"
                    disabled={reviewSubmitting}
                    className="px-6 py-2.5 bg-slate-900 hover:bg-slate-850 dark:bg-slate-800 dark:hover:bg-slate-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition"
                  >
                    {reviewSubmitting ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              ) : (
                <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-xl text-center text-sm font-semibold text-slate-650">
                  Please{" "}
                  <Link to="/auth" className="text-primary hover:underline">
                    login
                  </Link>{" "}
                  to write a review.
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Sticky Booking Widget */}
          <div className="h-fit lg:sticky lg:top-28">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-md">
              <div className="flex justify-between items-baseline border-b border-slate-100 dark:border-slate-800 pb-4">
                <span className="text-xs text-slate-400 font-bold uppercase">Pricing</span>
                <div>
                  <span className="text-2xl font-black text-slate-950 dark:text-white">INR {room.price}</span>
                  <span className="text-slate-400 text-xs font-semibold"> / night</span>
                </div>
              </div>

              <form onSubmit={handleBookingSubmit} className="space-y-4">
                {/* Check In Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Calendar size={14} className="text-primary" />
                    Check In
                  </label>
                  <input
                    type="date"
                    required
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none text-slate-950 dark:text-white"
                  />
                </div>

                {/* Check Out Date */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Calendar size={14} className="text-primary" />
                    Check Out
                  </label>
                  <input
                    type="date"
                    required
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none text-slate-950 dark:text-white"
                  />
                </div>

                {/* Guest selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Users size={14} className="text-primary" />
                    Guests
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none text-slate-950 dark:text-white"
                  >
                    <option value="1">1 Guest</option>
                    <option value="2">2 Guests</option>
                    <option value="3">3 Guests</option>
                    <option value="4">4 Guests</option>
                  </select>
                </div>

                {/* Checkout button */}
                <button
                  type="submit"
                  className="w-full py-4 bg-primary hover:bg-primary-dark text-white rounded-2xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-primary/20 transition cursor-pointer"
                >
                  Book this Suite
                </button>
              </form>

              <div className="text-center text-xs text-slate-400 font-semibold uppercase">
                Free cancellation up to 24h in advance
              </div>
            </div>
          </div>

        </div>

        {/* Similar Rooms Recommendations Section */}
        {similarRooms.length > 0 && (
          <div className="border-t border-slate-200 dark:border-slate-800 mt-20 pt-16">
            <h2 className="text-2xl font-extrabold tracking-wide dark:text-white uppercase mb-8">
              Similar Suites You Might Love
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {similarRooms.map((smRoom) => (
                <div key={smRoom.id} className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850 rounded-3xl overflow-hidden hover:shadow-lg transition flex flex-col justify-between">
                  <div className="h-48 relative overflow-hidden">
                    <img src={smRoom.img} alt={smRoom.name} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 px-2.5 py-0.5 bg-slate-900/80 backdrop-blur-md rounded-full text-white text-[10px] font-bold uppercase">
                      INR {smRoom.price}/night
                    </div>
                  </div>
                  <div className="p-4 flex-grow flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white truncate">{smRoom.name}</h4>
                      <p className="text-slate-500 text-xs line-clamp-2 mt-1 leading-relaxed">{smRoom.desc}</p>
                    </div>
                    <Link
                      to={`/rooms/${smRoom.id}`}
                      className="block text-center w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-white rounded-xl font-bold uppercase tracking-wider text-[10px] transition mt-4"
                    >
                      View Suite
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      <Footer />
    </div>
  );
}
