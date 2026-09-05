import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      q: "What are the check-in and check-out times?",
      a: "Our standard check-in time is 2:00 PM and check-out time is 12:00 PM. Early check-in or late check-out is subject to availability and may incur nominal additional fees."
    },
    {
      q: "Is breakfast included in the booking rate?",
      a: "Yes, complimentary buffet breakfast at our gourmet kitchen is included for all guests booking via our premium suite classes."
    },
    {
      q: "What is the cancellation policy?",
      a: "You can cancel your reservation free of charge up to 24 hours prior to your scheduled check-in date. Cancellations made within 24 hours will be charged for the first night's stay."
    },
    {
      q: "How do I apply promotional coupon codes?",
      a: "During checkout, you will see a 'Promo Code' input box on the right sidebar. Enter codes like 'WELCOME10' or 'SUMMER20' and click 'Apply' to instantly deduct savings from your total amount."
    },
    {
      q: "Is there a pickup service from the airport?",
      a: "Yes! We offer airport shuttle services. You can mention your flight details in the 'Special Requests' box during booking, or contact our reception desk to arrange a pickup."
    },
    {
      q: "Can I cancel my booking from the user dashboard?",
      a: "Absolutely. Log into your dashboard, go to the 'Bookings' tab, locate your booking, and click the 'Cancel Booking' button. If cancelled within the eligible window, it will update immediately."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="flex-grow flex flex-col bg-slate-50 dark:bg-slate-950">
      <Navbar />

      {/* Hero section */}
      <div className="relative h-[40vh] flex items-center justify-center bg-slate-900 overflow-hidden">
        <img
          src="https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg"
          alt="FAQ"
          className="absolute inset-0 w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
        <div className="relative z-10 text-center text-white space-y-4">
          <span className="px-3 py-1 bg-primary/20 border border-primary/30 text-primary-light text-xs font-bold uppercase tracking-widest rounded-full">
            Help Center
          </span>
          <h1 className="text-4xl font-extrabold uppercase tracking-wide">Frequently Asked Questions</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex-grow w-full">
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = activeIndex === index;
            return (
              <div
                key={index}
                className="bg-white dark:bg-slate-900 border border-slate-205 dark:border-slate-800 rounded-2xl overflow-hidden transition-all shadow-sm"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex justify-between items-center px-6 py-5 text-left text-slate-850 dark:text-white font-bold text-sm uppercase tracking-wide focus:outline-none"
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={18} className="text-primary" /> : <ChevronDown size={18} />}
                </button>
                
                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-slate-500 dark:text-slate-350 text-xs leading-relaxed border-t border-slate-100 dark:border-slate-850 animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Footer />
    </div>
  );
}
