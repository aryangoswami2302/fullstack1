import { FaDumbbell, FaHeartbeat, FaUsers } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <PageWrapper>
      {/* Hero Section */}
      <section className="relative bg-blue-600 dark:bg-admin-darkBg text-white rounded-3xl overflow-hidden mb-16 shadow-2xl border-b-4 border-blue-800 dark:border-gray-900">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop" className="w-full h-full object-cover opacity-20 mix-blend-overlay" alt="Gym Background" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-blue-600/50 dark:from-black dark:to-transparent opacity-90"></div>
        </div>
        <div className="relative z-10 px-6 py-24 sm:px-12 sm:py-32 lg:px-20 text-center lg:text-left flex flex-col lg:flex-row items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}
            className="lg:w-1/2"
          >
            <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
              Transform Your Body, <br />
              <span className="text-blue-300 dark:text-blue-500">Transform Your Life</span>
            </h1>
            <p className="mt-4 text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto lg:mx-0 mb-10">
              Join the most advanced gym in the city. Experience world-class equipment, elite trainers, and a community dedicated to your ultimate success.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/services" className="bg-white text-blue-800 hover:bg-gray-100 font-bold py-4 px-10 rounded-full transition-transform hover:scale-105 shadow-xl text-lg">
                View Memberships
              </Link>
              <Link to="/contact" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-800 font-bold py-4 px-10 rounded-full transition-all hover:scale-105 backdrop-blur-sm shadow-xl text-lg">
                Contact Us
              </Link>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block lg:w-5/12 p-4 relative"
          >
            <div className="absolute inset-0 bg-blue-400 rounded-3xl transform rotate-3 opacity-20 dark:opacity-10"></div>
            <img src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1470&auto=format&fit=crop" alt="Premium Gym Equipment" className="relative z-10 rounded-3xl shadow-2xl object-cover h-[500px] w-full border-4 border-white/20" />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 mb-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">Why Choose GYM Pro?</h2>
          <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">Everything you need to reach your fitness goals efficiently and safely.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: FaDumbbell, color: "blue", title: "Premium Equipment", desc: "State-of-the-art machines and free weights to ensure the best possible workout experience." },
            { icon: FaHeartbeat, color: "red", title: "Expert Trainers", desc: "Our certified trainers will guide you, push your limits, and keep you safe from injuries." },
            { icon: FaUsers, color: "green", title: "Active Community", desc: "Join group classes and community events to stay motivated and meet like-minded people." }
          ].map((feature, i) => (
             <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.15 }}
                key={i} 
                className="card text-center hover:-translate-y-2 transform transition-all duration-300 border-t-4 border-transparent hover:border-blue-500"
             >
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-${feature.color}-100 dark:bg-${feature.color}-900/40 text-${feature.color}-600 dark:text-${feature.color}-400 mb-6 shadow-inner`}>
                <feature.icon className="text-3xl" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-lg">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-12 mb-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">Our Facilities & Workouts</h2>
          <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">Take a look inside the best workouts we offer in our massive facility.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { src: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1470&auto=format&fit=crop", title: "Heavy Free Weights" },
            { src: "/images/cardio_workout.png", title: "World-Class Cardio" },
            { src: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1470&auto=format&fit=crop", title: "High Energy Classes" }
          ].map((item, i) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.15 }}
              key={i} 
              className="relative group rounded-3xl overflow-hidden shadow-2xl h-96 cursor-pointer"
            >
              <img src={item.src} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex items-end p-8">
                <h3 className="text-white text-3xl font-bold transform transition-transform duration-300 group-hover:-translate-y-2">{item.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </PageWrapper>
  );
};

export default Home;
