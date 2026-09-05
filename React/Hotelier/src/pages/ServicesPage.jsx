import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { 
  Tv, 
  Coffee, 
  Wind, 
  UtensilsCrossed, 
  ShieldCheck, 
  Smile,
  Compass,
  Truck
} from "lucide-react";

export default function ServicesPage() {
  const services = [
    {
      name: "Room Service",
      icon: <UtensilsCrossed size={28} />,
      desc: "We provide 24/7 room service to ensure your comfort and convenience during your stay. Our dedicated kitchen staff prepares premium gourmet dishes delivered straight to your suite."
    },
    {
      name: "Spa and Wellness",
      icon: <Smile size={28} />,
      desc: "Indulge in our spa and wellness services designed to rejuvenate your mind, body, and soul. From deep-tissue massages to organic facials, experience complete bliss."
    },
    {
      name: "Concierge Services",
      icon: <Compass size={28} />,
      desc: "Our premium concierge desk is here to arrange local experiences, VIP tickets, and make reservations at top-rated Michelin restaurants across the city."
    },
    {
      name: "Fitness Center",
      icon: <ShieldCheck size={28} />,
      desc: "Stay fit during your travel. Work out with state of the art treadmills, elliptical trainers, and free weights, accompanied by private trainers on-demand."
    },
    {
      name: "Laundry Service",
      icon: <Wind size={28} />,
      desc: "Get your business suits and designer dresses cleaned and ironed with quick turnaround times. We offer eco-friendly dry cleaning and express deliveries."
    },
    {
      name: "Airport Shuttle",
      icon: <Truck size={28} />,
      desc: "Arrive in style and leave without stress. Reserve our premium chauffeured luxury sedans or spacious minivans for reliable airport commutes."
    }
  ];

  return (
    <div className="flex-grow flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      {/* Hero section */}
      <div className="relative h-[40vh] flex items-center justify-center bg-slate-900 overflow-hidden">
        <img
          src="https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg"
          alt="Services"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
        <div className="relative z-10 text-center text-white space-y-4">
          <span className="px-3 py-1 bg-primary/20 border border-primary/30 text-primary-light text-xs font-bold uppercase tracking-widest rounded-full">
            Elite Amenities
          </span>
          <h1 className="text-4xl font-extrabold uppercase tracking-wide">Our Premium Services</h1>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((srv, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-8 hover:shadow-xl transition-all duration-300 space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                {srv.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-850 dark:text-white uppercase tracking-wider">{srv.name}</h3>
              <p className="text-slate-500 text-xs leading-relaxed">{srv.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
