import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { dbService } from "../services/db";
import { useAuth } from "../context/AuthContext";
import { RoomCardSkeleton } from "../components/Skeleton";
import { Star, Heart, SlidersHorizontal, Eye, Check } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function RoomList() {
  const { t } = useLanguage();
  const { currentUser, toggleWishlist } = useAuth();
  const [searchParams] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [priceRange, setPriceRange] = useState(6000);
  const [minRating, setMinRating] = useState(0);
  const [typeFilter, setTypeFilter] = useState(searchParams.get("roomType") || "all");
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  // Read search bar values
  const urlDestination = searchParams.get("destination") || "";
  const urlCheckIn = searchParams.get("checkIn") || "";
  const urlCheckOut = searchParams.get("checkOut") || "";

  useEffect(() => {
    async function loadData() {
      try {
        const roomsData = await dbService.getRooms();
        const bookingsData = await dbService.getBookings();
        setRooms(roomsData);
        setBookings(bookingsData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    let result = [...rooms];

    // 1. Destination Filter
    if (urlDestination) {
      const destLower = urlDestination.toLowerCase();
      result = result.filter(
        r => r.name.toLowerCase().includes(destLower) || r.desc.toLowerCase().includes(destLower)
      );
    }

    // 2. Room Type Filter
    if (typeFilter !== "all") {
      result = result.filter(r => r.type === typeFilter);
    }

    // 3. Price Filter
    result = result.filter(r => Number(r.price) <= priceRange);

    // 4. Rating Filter
    if (minRating > 0) {
      result = result.filter(r => (r.rating || 4.5) >= minRating);
    }

    // 5. Amenities Filter
    if (selectedAmenities.length > 0) {
      result = result.filter(r =>
        selectedAmenities.every(amenity => r.amenities?.includes(amenity))
      );
    }

    // 6. Real-time Date Availability Check
    if (urlCheckIn && urlCheckOut) {
      const startInput = new Date(urlCheckIn).getTime();
      const endInput = new Date(urlCheckOut).getTime();

      if (startInput && endInput && startInput < endInput) {
        result = result.filter(room => {
          // Check if this room has any overlapping approved/pending bookings
          const overlapping = bookings.find(b => {
            if (b.roomId !== room.id) return false;
            if (b.status === "rejected" || b.status === "cancelled") return false;

            const bStart = new Date(b.checkIn).getTime();
            const bEnd = new Date(b.checkOut).getTime();

            // Check overlap condition: (StartA < EndB) and (EndA > StartB)
            return startInput < bEnd && endInput > bStart;
          });
          return !overlapping; // Available if no overlap
        });
      }
    }

    setFilteredRooms(result);
  }, [rooms, bookings, urlDestination, urlCheckIn, urlCheckOut, priceRange, minRating, typeFilter, selectedAmenities]);

  const toggleAmenity = (amenity) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const amenitiesList = ["Wifi", "AC", "TV", "Mini Bar", "Room Service", "Gym Access", "Balcony", "Bath Tub"];

  return (
    <div className="flex-grow flex flex-col">
      <Navbar />

      <div className="bg-slate-100 dark:bg-slate-950 py-12 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Title */}
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-extrabold tracking-wide dark:text-white uppercase">
              {t("exploreRooms")}
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              Showing {filteredRooms.length} luxury rooms matching your criteria.
              {urlCheckIn && urlCheckOut && ` (Checked for availability: ${urlCheckIn} to ${urlCheckOut})`}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Left Filter Sidebar */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 h-fit lg:sticky lg:top-28 space-y-8 shadow-sm">
              <div className="flex items-center space-x-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                <SlidersHorizontal size={18} className="text-primary" />
                <h2 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-sm">Filters</h2>
              </div>

              {/* Room Type */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">{t("roomType")}</h3>
                <div className="space-y-2">
                  {["all", "suite", "double", "single"].map((t) => (
                    <label key={t} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="typeFilter"
                        checked={typeFilter === t}
                        onChange={() => setTypeFilter(t)}
                        className="w-4 h-4 text-primary bg-slate-100 border-slate-300 dark:bg-slate-950 dark:border-slate-800 focus:ring-primary"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-350 capitalize">{t}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-500">
                  <span>{t("priceRange")}</span>
                  <span className="text-primary font-bold">INR {priceRange}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="10000"
                  step="200"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Minimum Rating */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">{t("rating")}</h3>
                <div className="flex space-x-2">
                  {[0, 3, 4, 4.5].map((rate) => (
                    <button
                      key={rate}
                      onClick={() => setMinRating(rate)}
                      className={`flex-grow py-2 rounded-xl text-xs font-bold transition ${
                        minRating === rate
                          ? "bg-primary text-white"
                          : "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-350"
                      }`}
                    >
                      {rate === 0 ? "Any" : `${rate}+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amenities checkboxes */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">{t("amenities")}</h3>
                <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto pr-2">
                  {amenitiesList.map((amenity) => (
                    <label key={amenity} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedAmenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                        className="w-4 h-4 rounded text-primary bg-slate-100 border-slate-300 dark:bg-slate-950 dark:border-slate-800 focus:ring-primary"
                      />
                      <span className="text-sm text-slate-700 dark:text-slate-350">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Room Cards Grid */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[...Array(4)].map((_, i) => (
                    <RoomCardSkeleton key={i} />
                  ))}
                </div>
              ) : filteredRooms.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 border border-slate-250 dark:border-slate-800 rounded-3xl p-12 text-center text-slate-500">
                  <h3 className="text-xl font-bold dark:text-white uppercase mb-2">No Rooms Found</h3>
                  <p className="text-sm">Try broadening your search or modifying filters.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
                  {filteredRooms.map((room) => {
                    const isFavorited = currentUser?.wishlist?.includes(room.id);
                    return (
                      <div key={room.id} className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl overflow-hidden hover:shadow-2xl transition duration-300 group flex flex-col justify-between">
                        
                        {/* Image Showcase */}
                        <div className="relative h-64 overflow-hidden">
                          <img
                            src={room.img}
                            alt={room.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                          />
                          {/* Price Tag */}
                          <div className="absolute top-4 left-4 px-3 py-1 bg-slate-900/80 backdrop-blur-md rounded-full text-white text-xs font-bold uppercase shadow-sm">
                            INR {room.price}/night
                          </div>

                          {/* Wishlist Button */}
                          <button
                            onClick={() => toggleWishlist(room.id)}
                            className="absolute top-4 right-4 p-2.5 rounded-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-md text-slate-600 dark:text-slate-350 hover:text-red-500 dark:hover:text-red-500 transition shadow-sm"
                          >
                            <Heart size={18} className={isFavorited ? "fill-red-500 text-red-500" : ""} />
                          </button>
                        </div>

                        {/* Card Info */}
                        <div className="p-6 flex-grow flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="text-xl font-bold dark:text-white group-hover:text-primary transition-colors">
                                {room.name}
                              </h3>
                              <span className="flex items-center text-amber-500 text-sm font-semibold">
                                <Star size={14} className="fill-current mr-1" />
                                {room.rating || 4.7}
                              </span>
                            </div>
                            <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed mb-4">{room.desc}</p>
                          </div>

                          <div>
                            {/* Amenities Icons */}
                            <div className="flex flex-wrap gap-1.5 mb-6">
                              {room.amenities?.slice(0, 4).map((amn, i) => (
                                <span key={i} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold">
                                  {amn}
                                </span>
                              ))}
                              {room.amenities?.length > 4 && (
                                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold">
                                  +{room.amenities.length - 4}
                                </span>
                              )}
                            </div>

                            <hr className="border-slate-100 dark:border-slate-800 my-4" />

                            <div className="flex gap-3">
                              <Link
                                to={`/rooms/${room.id}`}
                                className="flex-1 text-center py-3 bg-slate-900 dark:bg-slate-800 hover:bg-slate-850 dark:hover:bg-slate-700 text-white rounded-2xl font-bold uppercase tracking-wider text-xs transition"
                              >
                                View Details
                              </Link>
                              
                              <Link
                                to={`/booking/${room.id}`}
                                className="flex-1 text-center py-3 bg-primary hover:bg-primary-dark text-white rounded-2xl font-bold uppercase tracking-wider text-xs transition shadow-md shadow-primary/20"
                              >
                                {t("bookNow")}
                              </Link>
                            </div>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
