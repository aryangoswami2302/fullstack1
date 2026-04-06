import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import { toggleTheme } from '../store/themeSlice';
import { FaSignOutAlt, FaMoon, FaSun, FaUserCircle, FaBars, FaTimes } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' },
  ];

  const dashboardLink = user?.role === 'admin' ? '/admin-dashboard' : '/member-dashboard';

  return (
    <nav className="bg-white dark:bg-admin-darkCard shadow-sm sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-gray-800 dark:text-white tracking-tight flex items-center">
              GYM <span className="text-blue-600 ml-1">Pro</span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex flex-1 justify-center space-x-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  location.pathname === link.path
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {user && (
              <Link
                to={dashboardLink}
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  location.pathname === dashboardLink
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                Dashboard
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link
                to="/admin-plans"
                className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                  location.pathname === '/admin-plans'
                    ? 'text-blue-600 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                Manage Plans
              </Link>
            )}
          </div>
          
          {/* Right Section (Auth & Theme) */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors focus:outline-none"
              aria-label="Toggle Dark Mode"
            >
              {mode === 'dark' ? <FaSun className="text-yellow-400" /> : <FaMoon />}
            </button>

            {user ? (
              <>
                <div className="flex items-center space-x-2 mr-2 border-r border-gray-200 dark:border-gray-700 pr-4">
                  <FaUserCircle className="text-gray-500 dark:text-gray-400 text-xl" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      {user.email.split('@')[0]}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-semibold">
                      {user.role}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40 px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none"
                >
                  <FaSignOutAlt />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden space-x-4">
            <button
              onClick={() => dispatch(toggleTheme())}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 transition-colors"
            >
              {mode === 'dark' ? <FaSun className="text-yellow-400" /> : <FaMoon />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-admin-darkCard px-2 pt-2 pb-3 space-y-1 sm:px-3 shadow-inner">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                location.pathname === link.path
                  ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              {link.name}
            </Link>
          ))}
          
          {user ? (
            <>
              <Link
                to={dashboardLink}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === dashboardLink
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                Dashboard
              </Link>
              {user.role === 'admin' && (
                <Link
                  to="/admin-plans"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === '/admin-plans'
                      ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  Manage Plans
                </Link>
              )}
              <button
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="w-full text-left mt-2 px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block mt-4 text-center w-full px-5 py-3 rounded-md text-base font-bold bg-blue-600 text-white hover:bg-blue-700"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
