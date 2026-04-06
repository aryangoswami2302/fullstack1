import { FaCheckCircle, FaDumbbell, FaUsers, FaHeartbeat } from "react-icons/fa";
import PageWrapper from "../components/PageWrapper";
import { motion } from "framer-motion";

const About = () => {
  return (
    <PageWrapper className="max-w-7xl mx-auto py-12 px-4">
      {/* HEADER with Image */}
      <div className="relative rounded-3xl overflow-hidden mb-20 shadow-2xl h-[400px] flex items-center justify-center text-center border-b-4 border-blue-600 dark:border-gray-800">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1469&auto=format&fit=crop" alt="Gym About" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90"></div>
        </div>
        <div className="relative z-10 px-4">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight">
            About <span className="text-blue-500">GYM Pro</span>
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-xl md:text-2xl text-gray-200">
            More than just a gym. We build strength, discipline, and a powerful mindset that transcends the workout floor.
          </p>
        </div>
      </div>

      {/* MISSION SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-28">
        <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6">
            Our Mission & Vision
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            At GYM Pro, we empower individuals to achieve their absolute physical peak. 
            Whether you're lifting your first weight or pushing past your physical limits, we provide the 
            right environment, elite guidance, and unyielding motivation.
          </p>

          <ul className="space-y-5">
            {[
              "Inspiring, high-energy atmosphere",
              "Biomechanical and modern equipment",
              "World-class expert trainers",
              "Friendly, competitive community",
            ].map((item, idx) => (
              <li
                key={idx}
                className="flex items-center text-gray-800 dark:text-gray-200 font-bold text-lg"
              >
                <FaCheckCircle className="text-blue-500 mr-4 text-2xl" />
                {item}
              </li>
            ))}
          </ul>
        </motion.div>

        {/* STATS CARD */}
        <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="grid grid-cols-2 gap-6">
          <div className="bg-white dark:bg-admin-darkCard p-8 rounded-3xl shadow-xl hover:-translate-y-2 transition border border-gray-100 dark:border-gray-800">
            <FaUsers className="text-blue-500 text-4xl mb-4" />
            <h3 className="text-4xl font-extrabold text-gray-900 dark:text-white">5K+</h3>
            <p className="text-gray-500 font-medium mt-1">Active Members</p>
          </div>

          <div className="bg-white dark:bg-admin-darkCard p-8 rounded-3xl shadow-xl hover:-translate-y-2 transition border border-gray-100 dark:border-gray-800">
            <FaDumbbell className="text-purple-500 text-4xl mb-4" />
            <h3 className="text-4xl font-extrabold text-gray-900 dark:text-white">200+</h3>
            <p className="text-gray-500 font-medium mt-1">Premium Machines</p>
          </div>

          <div className="bg-white dark:bg-admin-darkCard p-8 rounded-3xl shadow-xl hover:-translate-y-2 transition border border-gray-100 dark:border-gray-800">
            <FaHeartbeat className="text-red-500 text-4xl mb-4" />
            <h3 className="text-4xl font-extrabold text-gray-900 dark:text-white">15+</h3>
            <p className="text-gray-500 font-medium mt-1">Years Experience</p>
          </div>

          <div className="bg-white dark:bg-admin-darkCard p-8 rounded-3xl shadow-xl hover:-translate-y-2 transition border border-gray-100 dark:border-gray-800">
            <FaUsers className="text-green-500 text-4xl mb-4" />
            <h3 className="text-4xl font-extrabold text-gray-900 dark:text-white">40+</h3>
            <p className="text-gray-500 font-medium mt-1">Elite Trainers</p>
          </div>
        </motion.div>
      </div>

      {/* VALUES SECTION */}
      <div className="mb-24">
        <h2 className="text-4xl font-extrabold text-center mb-12 dark:text-white tracking-tight">
          The GYM Pro Standard
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Professional Excellence",
              desc: "Certified experts to guide your journey and prevent injury.",
              image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1470&auto=format&fit=crop"
            },
            {
              title: "Modern Arsenal",
              desc: "Latest performance-tested machines for ultimate gains.",
              image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1470&auto=format&fit=crop"
            },
            {
              title: "Inclusive Environment",
              desc: "From beginners to IFBB pros, everybody belongs here.",
              image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1470&auto=format&fit=crop"
            },
          ].map((item, i) => (
            <motion.div
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              key={i}
              className="bg-white dark:bg-admin-darkCard rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition border border-gray-100 dark:border-gray-800"
            >
              <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-3 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA SECTION */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
        className="relative rounded-3xl overflow-hidden text-center shadow-2xl"
      >
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop" className="w-full h-full object-cover" alt="CTA Background" />
          <div className="absolute inset-0 bg-blue-900/90 mix-blend-multiply"></div>
        </div>
        <div className="relative z-10 p-16 md:p-24">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-white tracking-tight">
            Ready to Transform Your Body?
          </h2>
          <p className="max-w-2xl mx-auto mb-10 text-xl text-blue-100">
            Join GYM Pro today. Take the first step toward a healthier, stronger, and more resilient life.
          </p>
          <button className="bg-white text-blue-900 px-10 py-4 rounded-full font-bold text-xl hover:scale-105 hover:bg-gray-100 transition shadow-xl">
            Join The Revolution 🚀
          </button>
        </div>
      </motion.div>
    </PageWrapper>
  );
};

export default About;