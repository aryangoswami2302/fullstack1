import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Star, Shield, Award, Users, Heart } from "lucide-react";
import { dbService } from "../services/db";

const fallbackTeam = [
  { name: "Karan Patel", role: "General Manager", img: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg" },
  { name: "Aryan Goswami", role: "Front Office Supervisor", img: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg" },
  { name: "Bhavin Panchal", role: "Executive Chef", img: "https://images.pexels.com/photos/887853/pexels-photo-887853.jpeg" },
  { name: "Aman Solanki", role: "Housekeeping Supervisor", img: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg" }
];

export default function AboutUs() {
  const [settings, setSettings] = useState(null);
  const [team, setTeam] = useState(fallbackTeam);

  useEffect(() => {
    async function loadAboutContent() {
      try {
        const settingsData = await dbService.getSettings();
        setSettings(settingsData);
      } catch (err) {
        console.error("Failed to load site settings:", err);
      }
      try {
        const teamData = await dbService.getTeam();
        if (Array.isArray(teamData) && teamData.length > 0) {
          setTeam(teamData.map((member) => ({
            ...member,
            role: member.Designation || member.role || "Team Member"
          })));
        }
      } catch (err) {
        console.error("Failed to load team data:", err);
      }
    }
    loadAboutContent();
  }, []);

  return (
    <div className="flex-grow flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      {/* Hero section */}
      <div className="relative h-[40vh] flex items-center justify-center bg-slate-900 overflow-hidden">
        <img
          src="https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg"
          alt="About Us"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
        <div className="relative z-10 text-center text-white space-y-4">
          <span className="px-3 py-1 bg-primary/20 border border-primary/30 text-primary-light text-xs font-bold uppercase tracking-widest rounded-full">
            Our Story
          </span>
          <h1 className="text-4xl font-extrabold uppercase tracking-wide">{settings?.aboutHeading || "About Hotelier"}</h1>
        </div>
      </div>

      {/* Narrative grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-primary font-bold uppercase text-xs tracking-widest">Est. 2012</span>
            <h2 className="text-3xl font-extrabold uppercase dark:text-white leading-tight">
              {settings?.aboutSubheading || "A Legacy of Premium Hospitality & Comfort"}
            </h2>
            <p className="text-slate-550 text-sm leading-relaxed">
              {settings?.aboutDescription || "For over a decade, Hotelier has redefined high-end lodging. We combine local cultural design elements with cutting-edge smart features to create rooms that feel like home, yet inspire absolute wonder."}
            </p>
            <p className="text-slate-550 text-sm leading-relaxed">
              Whether you are traveling for a global corporate summit or checking in for a relaxing beachside retreat with family, our dedicated team is at your service 24/7 to ensure an unforgettable stay.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg" alt="Hotel room" className="rounded-3xl shadow-md" />
            <img src="https://images.pexels.com/photos/6585619/pexels-photo-6585619.jpeg" alt="Spa room" className="rounded-3xl shadow-md mt-6" />
          </div>
        </div>

        {/* Core values */}
        <div className="space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-primary font-bold uppercase text-xs tracking-widest">Our Foundation</span>
            <h2 className="text-3xl font-extrabold uppercase dark:text-white">Core Pillars</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Excellence", icon: <Award size={24} />, desc: "We strive to exceed standards, delivering premium comfort in every single corner." },
              { title: "Care & Warmth", icon: <Heart size={24} />, desc: "Hospitality is in our blood. We welcome guests as friends and treat them as family." },
              { title: "Smart Security", icon: <Shield size={24} />, desc: "Enjoy keyless room entry, safe booking methods, and absolute database confidentiality." },
              { title: "Togetherness", icon: <Users size={24} />, desc: "A unified, highly collaborative team makes world-class hotel management look simple." }
            ].map((pillar, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-6 rounded-3xl space-y-4 hover:shadow-lg transition">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  {pillar.icon}
                </div>
                <h3 className="font-bold text-slate-850 dark:text-white">{pillar.title}</h3>
                <p className="text-slate-500 text-xs leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team profiles */}
        <div className="space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-primary font-bold uppercase text-xs tracking-widest">The Professionals</span>
            <h2 className="text-3xl font-extrabold uppercase dark:text-white">Meet Our Leaders</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((t, idx) => (
              <div key={idx} className="group bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300">
                <div className="h-64 overflow-hidden relative">
                  <img src={t.img} alt={t.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-550" />
                </div>
                <div className="p-6 text-center">
                  <h4 className="font-bold text-slate-850 dark:text-white uppercase tracking-wider text-sm">{t.name}</h4>
                  <span className="text-xs text-primary font-semibold block mt-1">{t.role}</span>
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
