import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { dbService } from "../services/db";
import { useLanguage } from "../context/LanguageContext";
import { 
  Search, 
  Calendar, 
  Users, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Coffee, 
  Wind, 
  Tv, 
  Wifi, 
  Award,
  ChevronRight
} from "lucide-react";

export default function Home() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search Bar States
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("1");
  const [roomType, setRoomType] = useState("all");

  useEffect(() => {
    async function loadRooms() {
      try {
        const data = await dbService.getRooms();
        setFeaturedRooms(data.slice(0, 3)); // show first 3 rooms
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadRooms();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(
      `/rooms?destination=${encodeURIComponent(destination)}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}&roomType=${roomType}`
    );
  };

  const destinations = [
    { name: "Dubai, UAE", img: "https://images.pexels.com/photos/3767673/pexels-photo-3767673.jpeg", rooms: 42 },
    { name: "Maldives", img: "https://images.pexels.com/photos/1483053/pexels-photo-1483053.jpeg", rooms: 28 },
    { name: "Paris, France", img: "https://images.pexels.com/photos/1488315/pexels-photo-1488315.jpeg", rooms: 35 },
    { name: "Bali, Indonesia", img: "https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg", rooms: 19 },
  ];

  return (
    <div className="flex-grow flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        {/* Background Image Slider / Zoom Visual */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg"
            alt="Luxury Hotel Hero"
            className="w-full h-full object-cover brightness-[0.4] scale-105 transition-all duration-[10000ms] ease-out hover:scale-100"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8 text-white space-y-6">
          <span className="px-5 py-2 rounded-full bg-primary/20 border border-primary/30 text-primary-light text-sm font-semibold tracking-widest uppercase">
            Luxury Living & Comfort
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-wide uppercase leading-tight font-sans">
            Discover Your Perfect <br />
            <span className="bg-gradient-to-r from-primary-light to-primary bg-clip-text text-transparent">
              Sanctuary
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-200 font-medium max-w-2xl mx-auto leading-relaxed">
            Experience premium lodging options, world-class amenities, and warm hospitality at our curated hotels.
          </p>
        </div>
      </div>

      {/* Interactive Search Bar Widget (Float overlapping hero) */}
      <div className="relative z-20 max-w-6xl mx-auto px-4 -mt-24 w-full">
        <form
          onSubmit={handleSearch}
          className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
        >
          {/* Destination */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <MapPin size={14} className="text-primary" />
              Destination
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="e.g. Dubai, Paris"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none text-slate-950 dark:text-white"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              Room type
            </label>
            <select
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-950 dark:text-white focus:outline-none"
            >
              <option value="all">All rooms</option>
              <option value="single">Single</option>
              <option value="double">Double</option>
              <option value="suite">Suite</option>
            </select>
          </div>

          {/* Check-In */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Calendar size={14} className="text-primary" />
              Check In
            </label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none text-slate-950 dark:text-white"
            />
          </div>

          {/* Check-Out */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Calendar size={14} className="text-primary" />
              Check Out
            </label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none text-slate-950 dark:text-white"
            />
          </div>

          {/* Guests */}
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
              <option value="4">4+ Guests</option>
            </select>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transition-all duration-200 cursor-pointer"
            >
              <Search size={16} />
              <span>{t("searchBtn")}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Popular Services Highlights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center max-w-xl mx-auto space-y-3 mb-16">
          <span className="text-primary font-bold uppercase text-sm tracking-widest">Why Choose Us</span>
          <h2 className="text-3xl font-extrabold uppercase dark:text-white">Our Premium Services</h2>
          <p className="text-slate-500 text-sm">We provide state of the art amenities, highly customized room plans, and local experiences.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: "24/7 Room Service", icon: <Award size={28} />, desc: "Gourmet dining and quick amenities brought right to your door." },
            { title: "Wellness & Spa", icon: <Coffee size={28} />, desc: "Unwind and rejuvenate with steam rooms, massages, and pool side views." },
            { title: "Smart Living", icon: <Tv size={28} />, desc: "Automated controls, fast Wi-Fi, and smart assistant enabled rooms." },
            { title: "Safe & Protected", icon: <ShieldCheck size={28} />, desc: "Fully secure booking system, sanitised keys, and premium security." }
          ].map((srv, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-3xl p-6 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-5">
                {srv.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{srv.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{srv.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Rooms Grid */}
      <div className="bg-slate-100 dark:bg-slate-950 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <span className="text-primary font-bold uppercase text-sm tracking-widest">Selected Suites</span>
              <h2 className="text-3xl font-extrabold uppercase dark:text-white mt-2">{t("featuredRooms")}</h2>
            </div>
            <Link
              to="/rooms"
              className="text-primary font-bold text-sm tracking-wider flex items-center gap-1 hover:text-primary-dark group mt-4 md:mt-0"
            >
              <span>VIEW ALL ROOMS</span>
              <ChevronRight size={16} className="group-hover:translate-x-1 transition" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-full text-center py-8">{t("loading")}</div>
            ) : (
              featuredRooms.map((room) => (
                <div key={room.id} className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl overflow-hidden hover:shadow-2xl transition duration-300 group flex flex-col justify-between">
                  <div className="relative overflow-hidden h-64">
                    <img
                      src={room.img}
                      alt={room.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-4 right-4 px-3 py-1 bg-slate-900/80 backdrop-blur-md rounded-full text-white text-xs font-bold uppercase">
                      INR {room.price}/night
                    </div>
                  </div>
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-bold dark:text-white">{room.name}</h3>
                        <span className="flex items-center text-amber-500 text-sm font-semibold">
                          <Star size={14} className="fill-current mr-1" />
                          {room.rating || 4.7}
                        </span>
                      </div>
                      <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed mb-4">{room.desc}</p>
                    </div>

                    <div>
                      <div className="flex space-x-4 mb-6">
                        <span className="text-xs font-bold text-slate-400 uppercase">{room.bed} Bed(s)</span>
                        <span className="text-xs font-bold text-slate-400 uppercase">{room.bath} Bath(s)</span>
                      </div>
                      <Link
                        to={`/rooms/${room.id}`}
                        className="block text-center w-full py-3 bg-slate-900 hover:bg-slate-850 dark:bg-slate-850 dark:hover:bg-slate-800 text-white rounded-2xl font-bold uppercase tracking-wider text-xs transition"
                      >
                        More details
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Popular Destinations Showcase */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center max-w-xl mx-auto space-y-3 mb-16">
          <span className="text-primary font-bold uppercase text-sm tracking-widest">{t("popularDestinations")}</span>
          <h2 className="text-3xl font-extrabold uppercase dark:text-white">Worldwide Lodging Spots</h2>
          <p className="text-slate-500 text-sm">Explore our curated locations offering luxury hospitality and unique local designs.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {destinations.map((dest, idx) => (
            <div
              key={idx}
              onClick={() => navigate(`/rooms?destination=${encodeURIComponent(dest.name)}`)}
              className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <img
                src={dest.img}
                alt={dest.name}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-xl font-bold tracking-wide uppercase">{dest.name}</h3>
                <span className="text-xs font-semibold text-slate-300">{dest.rooms} Luxury Suites</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-slate-100 dark:bg-slate-950 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto space-y-3 mb-16">
            <span className="text-primary font-bold uppercase text-sm tracking-widest">Testimonials</span>
            <h2 className="text-3xl font-extrabold uppercase dark:text-white">{t("testimonials")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Manthan S.", role: "Frequent Traveler", review: "The service here exceeds 5 stars. The Executive Suite was incredibly spacious, highly sanitised, and the smart assistant amenities worked flawlessly.", rating: 5 },
              { name: "Karan P.", role: "Family Vacation", review: "Excellent choice for families! The booking system was very straightforward. Standard coupons gave us a good deal, and staff went out of their way to assist.", rating: 5 },
              { name: "Neha G.", role: "Business Traveler", review: "Perfect location, super-fast Wi-Fi, and a state of the art workspace desk. Check-out was completely digital and quick. Will stay here again.", rating: 4 }
            ].map((usr, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
                <div className="flex text-amber-500 mb-4">
                  {[...Array(usr.rating)].map((_, i) => <Star key={i} size={16} className="fill-current" />)}
                </div>
                <p className="text-slate-650 dark:text-slate-350 text-sm leading-relaxed mb-6 italic">"{usr.review}"</p>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{usr.name}</h4>
                  <span className="text-xs text-slate-400 font-semibold">{usr.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
