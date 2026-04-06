import { useState } from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';
import PageWrapper from '../components/PageWrapper';
import { motion } from 'framer-motion';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('Sending...');
    
    // Simulate API call
    setTimeout(() => {
      setStatus('Success! Your message has been sent. We will get back to you shortly.');
      setFormData({ name: '', email: '', message: '' });
    }, 1500);
  };

  return (
    <PageWrapper className="max-w-7xl mx-auto py-12 px-4">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Get in <span className="text-blue-600">Touch</span>
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
          Have questions? Ready to begin? Contact our elite team of experts today.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white dark:bg-admin-darkCard rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden min-h-[600px]">
        {/* Contact Info (Left Side - Image Background) */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
          className="relative p-12 text-white flex flex-col justify-between"
        >
          <div className="absolute inset-0">
            <img src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1470&auto=format&fit=crop" className="w-full h-full object-cover grayscale brightness-50" alt="Contact Gym" />
            <div className="absolute inset-0 bg-blue-900/80 mix-blend-multiply"></div>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-4xl font-extrabold mb-6">Contact Information</h2>
            <p className="text-blue-100 mb-12 text-lg leading-relaxed max-w-md">
              Fill out the form or give us a call. Our support team is available 24/7 to ignite your fitness journey.
            </p>

            <div className="space-y-8">
              <div className="flex items-center group">
                <div className="flex items-center justify-center w-14 h-14 bg-white/10 backdrop-blur-sm rounded-full group-hover:bg-white/20 transition-colors mr-6 border border-white/20">
                  <FaPhoneAlt className="text-xl" />
                </div>
                <div>
                  <p className="text-sm text-blue-200 uppercase tracking-wider font-bold mb-1">Call Us Directly</p>
                  <p className="text-xl font-semibold">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="flex items-center group">
                <div className="flex items-center justify-center w-14 h-14 bg-white/10 backdrop-blur-sm rounded-full group-hover:bg-white/20 transition-colors mr-6 border border-white/20">
                  <FaEnvelope className="text-xl" />
                </div>
                <div>
                  <p className="text-sm text-blue-200 uppercase tracking-wider font-bold mb-1">Email Our Team</p>
                  <p className="text-xl font-semibold">support@gympro.com</p>
                </div>
              </div>

              <div className="flex items-center group">
                <div className="flex items-center justify-center w-14 h-14 bg-white/10 backdrop-blur-sm rounded-full group-hover:bg-white/20 transition-colors mr-6 border border-white/20">
                  <FaMapMarkerAlt className="text-xl" />
                </div>
                <div>
                  <p className="text-sm text-blue-200 uppercase tracking-wider font-bold mb-1">Visit Facility</p>
                  <p className="text-xl font-semibold">123 Fitness Avenue, NY 10001</p>
                </div>
              </div>
            </div>
          </div>
          <div className="relative z-10 mt-12 pt-8 border-t border-white/20 opacity-70 text-sm font-medium">
            &copy; 2026 GYM Pro, All rights reserved.
          </div>
        </motion.div>

        {/* Contact Form (Right Side) */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="p-10 lg:p-14 flex flex-col justify-center"
        >
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">Send us a Message</h2>
          
          {status && (
            <div className={`mb-8 p-5 rounded-xl font-medium border ${
              status.includes('Success') 
                ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800/50' 
                : 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800/50'
            }`}>
              {status}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300 mb-2">Your Name</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800/50 dark:text-white transition-all text-lg"
                placeholder="John Doe"
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800/50 dark:text-white transition-all text-lg"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-bold uppercase tracking-wide text-gray-700 dark:text-gray-300 mb-2">Message</label>
              <textarea
                required
                rows="5"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-5 py-4 bg-gray-50 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800/50 dark:text-white transition-all text-lg resize-none"
                placeholder="How can we help you crush your goals?"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={status === 'Sending...'}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-lg py-4 px-6 rounded-xl transition-transform hover:scale-[1.02] active:scale-[0.98] flex justify-center items-center disabled:opacity-70 disabled:hover:scale-100 shadow-xl"
            >
              {status === 'Sending...' ? 'Sending Transmission...' : <><FaPaperPlane className="mr-3" /> Transmit Message</>}
            </button>
          </form>
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default Contact;
