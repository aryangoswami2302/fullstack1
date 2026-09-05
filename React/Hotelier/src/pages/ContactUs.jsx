import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { toast } from "react-toastify";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { dbService } from "../services/db";

const initialSettings = {
  contactEmail: "aryan23Goswami@gmail.com",
  contactPhone: "+91 9687577089",
  contactAddress: "123 Luxury Boulevard, Palm Jumeirah, Ahmedabad, INDIA",
  contactHours: "Open 24/7 (For reservations)"
};

export default function ContactUs() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [settings, setSettings] = useState(initialSettings);

  useEffect(() => {
    async function loadContactSettings() {
      try {
        const settingsData = await dbService.getSettings();
        setSettings({
          contactEmail: settingsData.contactEmail || initialSettings.contactEmail,
          contactPhone: settingsData.contactPhone || initialSettings.contactPhone,
          contactAddress: settingsData.contactAddress || initialSettings.contactAddress,
          contactHours: settingsData.contactHours || initialSettings.contactHours
        });
      } catch (err) {
        console.error("Unable to load contact settings:", err);
      }
    }
    loadContactSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !subject || !message) {
      toast.warning("Please fill in all form inputs.");
      return;
    }
    
    setSubmitting(true);
    try {
      await dbService.addMessage({
        name,
        email,
        subject,
        message
      });
      toast.success("Thank you! Your message was sent successfully.");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-grow flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      {/* Hero section */}
      <div className="relative h-[40vh] flex items-center justify-center bg-slate-900 overflow-hidden">
        <img
          src="https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg"
          alt="Contact Us"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
        <div className="relative z-10 text-center text-white space-y-4">
          <span className="px-3 py-1 bg-primary/20 border border-primary/30 text-primary-light text-xs font-bold uppercase tracking-widest rounded-full">
            Inquiries
          </span>
          <h1 className="text-4xl font-extrabold uppercase tracking-wide">Contact Us</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Column: Contact details */}
          <div className="space-y-8 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-8 rounded-3xl h-fit shadow-sm">
            <h2 className="text-xl font-bold dark:text-white uppercase border-b border-slate-100 dark:border-slate-800 pb-3 tracking-wide">
              Get In Touch
            </h2>
            
            <div className="space-y-6">
              {/* Address */}
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-850 dark:text-white uppercase text-xs tracking-wider">Address</h4>
                  <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                    {settings.contactAddress}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-850 dark:text-white uppercase text-xs tracking-wider">Phone</h4>
                  <p className="text-slate-500 text-xs mt-1">{settings.contactPhone}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-850 dark:text-white uppercase text-xs tracking-wider">Email</h4>
                  <p className="text-slate-500 text-xs mt-1">{settings.contactEmail}</p>
                </div>
              </div>

              {/* Office hours */}
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                  <Clock size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-850 dark:text-white uppercase text-xs tracking-wider">Desk Hours</h4>
                  <p className="text-slate-500 text-xs mt-1">{settings.contactHours}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact form */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
            <h2 className="text-xl font-bold dark:text-white uppercase border-b border-slate-100 dark:border-slate-800 pb-3 tracking-wide mb-6">
              Send Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 text-sm text-slate-950 dark:text-white focus:outline-none"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Your Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 text-sm text-slate-950 dark:text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Subject</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Inquiry about suite availability"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl px-4 py-3 text-sm text-slate-950 dark:text-white focus:outline-none"
                />
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Message</label>
                <textarea
                  rows="5"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Hello, I would like to inquire..."
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl p-4 text-sm text-slate-950 dark:text-white focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-8 py-3.5 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold uppercase tracking-wider text-xs flex items-center justify-center space-x-2 shadow-lg shadow-primary/20 transition cursor-pointer"
              >
                <span>{submitting ? "Sending..." : "Send Message"}</span>
                {!submitting && <Send size={14} />}
              </button>
            </form>
          </div>

        </div>
      </div>

      <Footer />
    </div>
  );
}
