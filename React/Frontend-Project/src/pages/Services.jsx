import { FaCheck, FaSpinner } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../services/api";
import PageWrapper from "../components/PageWrapper";
import { motion } from "framer-motion";

const Services = () => {
  const [yearly, setYearly] = useState(false);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await api.getPlans();
        setPlans(data);
      } catch (err) {
        setError('Failed to fetch plans. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const getDisplayPrice = (priceString) => {
    if (!yearly) return priceString;
    const numMatch = priceString.match(/\d+/);
    if (numMatch) {
      const num = parseInt(numMatch[0]);
      return priceString.replace(numMatch[0], num * 10);
    }
    return priceString;
  };

  return (
    <PageWrapper className="max-w-7xl mx-auto py-12 px-4">

      {/* HEADER with Image */}
      <div className="relative rounded-3xl overflow-hidden mb-16 shadow-2xl h-[350px] flex flex-col items-center justify-center text-center border-b-4 border-blue-600 dark:border-gray-800">
        <div className="absolute inset-0">
          <img src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1469&auto=format&fit=crop" alt="Gym Services" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90"></div>
        </div>
        <div className="relative z-10 px-4 mt-8">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-4">
            Membership <span className="text-blue-500">Plans</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-200">
            Flexible pricing designed for your elite fitness journey.
          </p>

          {/* TOGGLE */}
          <div className="mt-8 flex justify-center items-center gap-4 bg-black/40 py-2 px-6 rounded-full backdrop-blur-sm border border-white/20 mx-auto w-max">
            <span className={`${!yearly ? "font-bold text-white" : "text-gray-400"} transition-colors`}>
              Monthly
            </span>

            <button
              onClick={() => setYearly(!yearly)}
              className="w-14 h-7 bg-blue-600/50 rounded-full relative focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <div
                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
                  yearly ? "translate-x-7 bg-blue-400" : ""
                }`}
              ></div>
            </button>

            <span className={`${yearly ? "font-bold text-white" : "text-gray-400"} transition-colors`}>
              Yearly
            </span>
          </div>
        </div>
      </div>

      {/* CARDS */}
      {loading ? (
        <div className="flex justify-center items-center py-20 text-blue-500">
          <FaSpinner className="animate-spin text-6xl opacity-80" />
        </div>
      ) : error ? (
        <div className="text-center py-20 text-red-500 font-bold text-2xl">{error}</div>
      ) : plans.length === 0 ? (
        <div className="text-center py-20 text-gray-500 text-2xl font-medium">No plans available right now. Check back later!</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }} 
              whileInView={{ opacity: 1, scale: 1, y: 0 }} 
              viewport={{ once: true }} 
              transition={{ delay: i * 0.15 }}
              key={plan.id}
              className={`relative flex flex-col p-10 rounded-3xl shadow-xl transition-all duration-300 hover:-translate-y-3 cursor-pointer
              ${
                plan.tag && plan.tag.includes("Popular")
                  ? "bg-gradient-to-br from-blue-700 to-purple-800 text-white scale-105 shadow-2xl border-2 border-blue-400/50"
                  : "bg-white dark:bg-admin-darkCard border border-gray-100 dark:border-gray-800"
              }`}
            >
              {/* TAG */}
              {plan.tag && (
                <div className={`absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider
                  ${plan.tag.includes("Popular") ? "bg-white text-blue-800" : "bg-blue-600 text-white"}`}>
                  {plan.tag}
                </div>
              )}

              {/* TITLE */}
              <div className="text-center mb-10 mt-2">
                <h2 className={`text-3xl font-bold mb-4 ${
                  plan.tag && plan.tag.includes("Popular") ? "text-white" : "text-gray-900 dark:text-white"
                }`}>{plan.name}</h2>
                <div className="flex justify-center items-baseline">
                  <span className={`text-6xl font-extrabold ${
                    plan.tag && plan.tag.includes("Popular") ? "text-white" : "text-gray-900 dark:text-white"
                  }`}>
                    {getDisplayPrice(plan.price)}
                  </span>
                  <span className={`ml-2 text-lg font-medium ${
                    plan.tag && plan.tag.includes("Popular") ? "text-blue-200" : "text-gray-500 dark:text-gray-400"
                  }`}>
                    /{yearly ? "yr" : "mo"}
                  </span>
                </div>
              </div>

              {/* FEATURES */}
              <ul className="space-y-5 mb-10 flex-grow">
                {plan.features?.map((feat, i) => (
                  <li key={i} className={`flex items-start text-base font-medium ${
                    plan.tag && plan.tag.includes("Popular") ? "text-blue-50" : "text-gray-600 dark:text-gray-300"
                  }`}>
                    <span className={`rounded-full p-1 mr-4 mt-1 flex-shrink-0 ${
                      plan.tag && plan.tag.includes("Popular") ? "bg-white/20 text-white" : "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400"
                    }`}>
                      <FaCheck className="text-xs" />
                    </span>
                    {feat}
                  </li>
                ))}
              </ul>

              {/* BUTTON */}
              <Link
                to="/contact"
                className={`block text-center py-4 rounded-full font-bold text-lg transition shadow-lg
                ${
                  plan.tag && plan.tag.includes("Popular")
                    ? "bg-white text-blue-800 hover:bg-gray-100"
                    : "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:opacity-90 dark:from-blue-700 dark:to-blue-600"
                }`}
              >
                Choose Plan
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {/* EXTRA CTA */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        className="mt-28 mb-10 text-center bg-gray-50 dark:bg-admin-darkCard p-12 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-lg"
      >
        <h2 className="text-4xl font-extrabold mb-4 dark:text-white">
          Not sure which plan is right?
        </h2>
        <p className="text-xl text-gray-500 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Contact our team of fitness experts and we’ll help you choose the best membership for your specific goals.
        </p>

        <Link
          to="/contact"
          className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold text-lg rounded-full hover:bg-gray-800 dark:hover:bg-gray-100 transition shadow-xl"
        >
          Talk to an Expert
        </Link>
      </motion.div>
    </PageWrapper>
  );
};

export default Services;