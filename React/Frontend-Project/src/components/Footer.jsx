import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 border-t border-gray-800 text-gray-300 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-1">
            <h1 className="text-2xl font-bold text-white tracking-tight mb-4">
              GYM <span className="text-blue-500">Pro</span>
            </h1>
            <p className="text-sm text-gray-400 mb-6">
              Transforming lives through fitness, expert guidance, and an unbeatable community.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors"><FaFacebook size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors"><FaTwitter size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors"><FaInstagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-red-500 transition-colors"><FaYoutube size={20} /></a>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-sm hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/services" className="text-sm hover:text-white transition-colors">Services & Plans</Link></li>
              <li><Link to="/contact" className="text-sm hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Members</h3>
            <ul className="space-y-2">
              <li><Link to="/login" className="text-sm hover:text-white transition-colors">Member Login</Link></li>
              <li><Link to="/services" className="text-sm hover:text-white transition-colors">Join Now</Link></li>
              <li><a href="#" className="text-sm hover:text-white transition-colors">FAQ</a></li>
              <li><a href="#" className="text-sm hover:text-white transition-colors">Support</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-sm hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm hover:text-white transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} GYM Pro Management. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
