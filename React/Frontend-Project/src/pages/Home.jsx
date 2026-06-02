import { useState } from 'react';
import { 
  FaDumbbell, 
  FaHeartbeat, 
  FaUsers, 
  FaCalculator, 
  FaFireAlt, 
  FaRunning, 
  FaAppleAlt, 
  FaWeight, 
  FaRulerVertical, 
  FaInfoCircle 
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
  const [weight, setWeight] = useState(70);
  const [height, setHeight] = useState(170);
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState('male');
  const [activityLevel, setActivityLevel] = useState('1.55');
  const [result, setResult] = useState(null);
  const [activeGoal, setActiveGoal] = useState('maintain');

  const calculateMetrics = (e) => {
    e.preventDefault();
    const heightInMeters = height / 100;
    const bmi = parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
    
    let category = '';
    let categoryColor = '';
    let description = '';
    if (bmi < 18.5) {
      category = 'Underweight';
      categoryColor = 'text-blue-500 dark:text-blue-400';
      description = 'You are in the underweight range. Consider focusing on nutrient-dense meals and strength training to build muscle mass.';
    } else if (bmi < 25) {
      category = 'Normal Weight';
      categoryColor = 'text-emerald-500 dark:text-emerald-400';
      description = 'Great job! You have a healthy weight. Keep up your active lifestyle and balanced diet to maintain it.';
    } else if (bmi < 30) {
      category = 'Overweight';
      categoryColor = 'text-amber-500 dark:text-amber-400';
      description = 'You are in the overweight range. Focus on moderate cardio, strength training, and a slight calorie deficit.';
    } else {
      category = 'Obese';
      categoryColor = 'text-red-500 dark:text-red-400';
      description = 'You are in the obese range. We recommend counseling with a nutritionist and gradual lifestyle shifts.';
    }

    let bmr = 0;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }
    bmr = Math.round(bmr);
    const tdee = Math.round(bmr * parseFloat(activityLevel));

    const caloriesLose = Math.max(1200, tdee - 500);
    const caloriesMaintain = tdee;
    const caloriesGain = tdee + 300;

    setResult({
      bmi,
      category,
      categoryColor,
      description,
      bmr,
      tdee,
      goals: {
        lose: {
          title: 'Weight Loss (-500 kcal)',
          calories: caloriesLose,
          protein: Math.round((caloriesLose * 0.30) / 4),
          carbs: Math.round((caloriesLose * 0.45) / 4),
          fats: Math.round((caloriesLose * 0.25) / 9),
        },
        maintain: {
          title: 'Weight Maintenance',
          calories: caloriesMaintain,
          protein: Math.round((caloriesMaintain * 0.25) / 4),
          carbs: Math.round((caloriesMaintain * 0.50) / 4),
          fats: Math.round((caloriesMaintain * 0.25) / 9),
        },
        gain: {
          title: 'Muscle Gain (+300 kcal)',
          calories: caloriesGain,
          protein: Math.round((caloriesGain * 0.25) / 4),
          carbs: Math.round((caloriesGain * 0.50) / 4),
          fats: Math.round((caloriesGain * 0.25) / 9),
        }
      }
    });
  };

  const getNeedleTransform = (bmi) => {
    let angle = 0;
    if (bmi < 18.5) {
      const ratio = Math.max(0, (bmi - 10) / 8.5);
      angle = -90 + ratio * 45;
    } else if (bmi < 25) {
      const ratio = (bmi - 18.5) / 6.5;
      angle = -45 + ratio * 45;
    } else if (bmi < 30) {
      const ratio = (bmi - 25) / 5;
      angle = ratio * 45;
    } else {
      const ratio = Math.min(1, (bmi - 30) / 10);
      angle = 45 + ratio * 45;
    }
    return `rotate(${angle}deg)`;
  };

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

      {/* NEW: Interactive Fitness Hub (BMI & Calorie Calculator) */}
      <section className="py-12 mb-16 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full filter blur-3xl opacity-60 pointer-events-none"></div>
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-indigo-500/10 rounded-full filter blur-3xl opacity-60 pointer-events-none"></div>

        <div className="text-center mb-16 relative z-10">
          <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wider uppercase mb-3 inline-block">
            Fitness Analytics
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight flex items-center justify-center gap-3">
            <FaCalculator className="text-blue-600" /> Interactive Fitness Hub
          </h2>
          <p className="mt-4 text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Calculate your BMI, estimate daily caloric needs, and get customized macronutrient targets instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
          
          {/* Left Column: Input Form */}
          <div className="lg:col-span-5 bg-white dark:bg-admin-darkCard p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 transition-colors duration-300">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <FaCalculator className="text-blue-500" /> Enter Your Stats
            </h3>
            
            <form onSubmit={calculateMetrics} className="space-y-6">
              
              {/* Gender Selector */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Gender</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setGender('male')}
                    className={`py-3 px-4 rounded-xl font-bold text-sm transition-all focus:outline-none flex justify-center items-center gap-2 ${
                      gender === 'male' 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                        : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Male
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('female')}
                    className={`py-3 px-4 rounded-xl font-bold text-sm transition-all focus:outline-none flex justify-center items-center gap-2 ${
                      gender === 'female' 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                        : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Female
                  </button>
                </div>
              </div>

              {/* Height & Weight inputs */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                    <FaRulerVertical className="text-blue-500" /> Height (cm)
                  </label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950/60 border border-gray-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white font-bold"
                    min="100"
                    max="250"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                    <FaWeight className="text-blue-500" /> Weight (kg)
                  </label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950/60 border border-gray-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white font-bold"
                    min="30"
                    max="200"
                    required
                  />
                </div>
              </div>

              {/* Age & Activity Level */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-950/60 border border-gray-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white font-bold"
                    min="10"
                    max="100"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1.5">
                    <FaRunning className="text-blue-500" /> Activity Level
                  </label>
                  <select
                    value={activityLevel}
                    onChange={(e) => setActivityLevel(e.target.value)}
                    className="w-full px-3 py-3 bg-gray-50 dark:bg-slate-950/60 border border-gray-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-gray-300 font-bold"
                  >
                    <option value="1.2">Sedentary (No Exercise)</option>
                    <option value="1.375">Lightly Active (1-3 days/wk)</option>
                    <option value="1.55">Moderately Active (3-5 days/wk)</option>
                    <option value="1.725">Very Active (6-7 days/wk)</option>
                    <option value="1.9">Extra Active (Hard physical job)</option>
                  </select>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold tracking-wide shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 transition-all duration-300 transform active:scale-[0.98] flex justify-center items-center gap-2"
              >
                <FaCalculator className="text-lg" /> Calculate Fitness Metrics
              </button>
            </form>
          </div>

          {/* Right Column: Visual Dashboard Results */}
          <div className="lg:col-span-7 h-full flex flex-col justify-stretch">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="bg-white dark:bg-admin-darkCard p-8 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-800 flex-grow flex flex-col justify-between"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-6">
                    {/* SVG Speedometer Gauge */}
                    <div className="text-center">
                      <div className="relative inline-block">
                        <svg viewBox="0 0 200 110" className="w-56 h-32 mx-auto">
                          {/* Outer Track Arc */}
                          <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="#e2e8f0" strokeWidth="12" strokeLinecap="round" className="dark:stroke-slate-800" />
                          
                          {/* Underweight Segment (Blue) */}
                          <path d="M 20 100 A 80 80 0 0 1 60 40" fill="none" stroke="#3b82f6" strokeWidth="12" />
                          
                          {/* Normal Weight Segment (Green) */}
                          <path d="M 60 40 A 80 80 0 0 1 100 20" fill="none" stroke="#10b981" strokeWidth="12" />
                          
                          {/* Overweight Segment (Yellow) */}
                          <path d="M 100 20 A 80 80 0 0 1 140 40" fill="none" stroke="#f59e0b" strokeWidth="12" />
                          
                          {/* Obese Segment (Red) */}
                          <path d="M 140 40 A 80 80 0 0 1 180 100" fill="none" stroke="#ef4444" strokeWidth="12" />
                          
                          {/* Indicator Center Pin */}
                          <circle cx="100" cy="100" r="8" fill="#4f46e5" className="dark:fill-blue-500" />

                          {/* needle indicator pointing out */}
                          <g transform="translate(100,100)">
                            <line
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="-75"
                              stroke="#4f46e5"
                              strokeWidth="5"
                              strokeLinecap="round"
                              className="dark:stroke-blue-500"
                              style={{
                                transform: getNeedleTransform(result.bmi),
                                transformOrigin: '0px 0px',
                                transition: 'transform 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                              }}
                            />
                          </g>
                        </svg>

                        {/* Centered BMI Value Overlay */}
                        <div className="absolute bottom-0 inset-x-0 text-center">
                          <span className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">{result.bmi}</span>
                          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Your BMI</p>
                        </div>
                      </div>

                      <div className="mt-4">
                        <span className={`text-2xl font-black ${result.categoryColor}`}>{result.category}</span>
                      </div>
                    </div>

                    {/* Description Text */}
                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 dark:bg-slate-950/40 rounded-2xl border border-gray-100 dark:border-slate-800/80 flex items-start gap-3">
                        <FaInfoCircle className="text-blue-500 text-xl mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">Health Indicator</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">{result.description}</p>
                        </div>
                      </div>

                      {/* BMR and TDEE Grid */}
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-2xl border border-blue-100/50 dark:border-blue-900/30 text-center">
                          <span className="inline-flex p-2 rounded-xl bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 mb-2">
                            <FaFireAlt className="text-lg" />
                          </span>
                          <h4 className="text-xs text-gray-400 font-bold uppercase tracking-wider">BMR Rate</h4>
                          <span className="text-xl font-extrabold text-blue-900 dark:text-blue-300">{result.bmr} kcal</span>
                        </div>
                        <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-2xl border border-indigo-100/50 dark:border-indigo-900/30 text-center">
                          <span className="inline-flex p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 mb-2">
                            <FaRunning className="text-lg" />
                          </span>
                          <h4 className="text-xs text-gray-400 font-bold uppercase tracking-wider">Active TDEE</h4>
                          <span className="text-xl font-extrabold text-indigo-900 dark:text-indigo-300">{result.tdee} kcal</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Caloric Goal Selector Tab */}
                  <div className="border-t border-gray-100 dark:border-slate-800/80 pt-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-black text-gray-800 dark:text-gray-200 uppercase tracking-widest flex items-center gap-1.5">
                        <FaAppleAlt className="text-red-500" /> Target Nutrition Goals
                      </h4>
                    </div>

                    <div className="grid grid-cols-3 bg-gray-100 dark:bg-slate-950/80 p-1.5 rounded-2xl mb-6">
                      {['lose', 'maintain', 'gain'].map((goal) => (
                        <button
                          key={goal}
                          onClick={() => setActiveGoal(goal)}
                          className={`py-2 px-3 rounded-xl font-bold text-xs uppercase transition-all tracking-wider ${
                            activeGoal === goal
                              ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-sm'
                              : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
                          }`}
                        >
                          {goal === 'lose' ? 'Loss' : goal === 'maintain' ? 'Maintain' : 'Gain'}
                        </button>
                      ))}
                    </div>

                    {/* Selected Goal Metrics */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-2xl border border-blue-100/30 dark:border-blue-900/30">
                        <div>
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{result.goals[activeGoal].title}</p>
                          <h5 className="text-3xl font-black text-gray-900 dark:text-white mt-1">
                            {result.goals[activeGoal].calories} <span className="text-sm font-medium text-gray-400">kcal / day</span>
                          </h5>
                        </div>
                        <span className="text-xs font-semibold px-3 py-1 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full uppercase">
                          Target Calories
                        </span>
                      </div>

                      {/* Macros progress */}
                      <div className="grid grid-cols-3 gap-4">
                        {/* Protein */}
                        <div>
                          <div className="flex justify-between items-center text-xs font-bold mb-1">
                            <span className="text-purple-600 dark:text-purple-400">Protein</span>
                            <span className="text-gray-600 dark:text-gray-400">{result.goals[activeGoal].protein}g</span>
                          </div>
                          <div className="w-full bg-gray-100 dark:bg-slate-950/80 h-2.5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(result.goals[activeGoal].protein * 4 / result.goals[activeGoal].calories) * 100}%` }}
                              transition={{ duration: 0.8 }}
                              className="bg-purple-500 h-full rounded-full"
                            />
                          </div>
                        </div>

                        {/* Carbs */}
                        <div>
                          <div className="flex justify-between items-center text-xs font-bold mb-1">
                            <span className="text-blue-600 dark:text-blue-400">Carbs</span>
                            <span className="text-gray-600 dark:text-gray-400">{result.goals[activeGoal].carbs}g</span>
                          </div>
                          <div className="w-full bg-gray-100 dark:bg-slate-950/80 h-2.5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(result.goals[activeGoal].carbs * 4 / result.goals[activeGoal].calories) * 100}%` }}
                              transition={{ duration: 0.8 }}
                              className="bg-blue-500 h-full rounded-full"
                            />
                          </div>
                        </div>

                        {/* Fats */}
                        <div>
                          <div className="flex justify-between items-center text-xs font-bold mb-1">
                            <span className="text-amber-600 dark:text-amber-400">Fats</span>
                            <span className="text-gray-600 dark:text-gray-400">{result.goals[activeGoal].fats}g</span>
                          </div>
                          <div className="w-full bg-gray-100 dark:bg-slate-950/80 h-2.5 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${(result.goals[activeGoal].fats * 9 / result.goals[activeGoal].calories) * 100}%` }}
                              transition={{ duration: 0.8 }}
                              className="bg-amber-500 h-full rounded-full"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-slate-900/30 dark:to-slate-900/50 p-8 rounded-3xl shadow-inner border border-gray-100 dark:border-slate-800/80 text-center flex flex-col items-center justify-center h-full min-h-[400px]"
                >
                  <div className="w-20 h-20 rounded-full bg-white dark:bg-slate-800 shadow-md flex items-center justify-center text-blue-500 mb-6 border border-gray-100 dark:border-gray-700 animate-bounce">
                    <FaCalculator className="text-4xl" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">Ready to Calculate</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm max-w-sm">
                    Enter your gender, height, weight, age, and activity parameters on the left to see your comprehensive body metrics dashboard.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
