import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { 
  Sun, 
  Moon, 
  Globe, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Heart, 
  Grid, 
  UserCheck 
} from "lucide-react";

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const { language, changeLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    // Close dropdown immediately to avoid focus/blur race
    setUserDropdownOpen(false);
    try {
      await logout();
    } catch (err) {
      // logout already shows toast on failure; still navigate
      console.error("Logout failed:", err);
    }
    navigate("/");
  };

  const navLinks = [
    { name: t("home"), path: "/" },
    { name: t("rooms"), path: "/rooms" },
    { name: t("services"), path: "/services" },
    { name: t("aboutUs"), path: "/about" },
    { name: t("contactUs"), path: "/contact" },
    { name: t("faq"), path: "/faq" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 transition-all duration-300 bg-white dark:bg-slate-900 shadow-sm border-b border-slate-200/50 dark:border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-2xl font-extrabold tracking-widest bg-gradient-to-r from-primary-dark via-primary to-primary-light bg-clip-text text-transparent uppercase">
                Hotelier
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-semibold tracking-wide transition-colors duration-200 uppercase ${
                  isActive(link.path)
                    ? "text-primary border-b-2 border-primary pb-1"
                    : "text-slate-700 dark:text-slate-100 hover:text-primary dark:hover:text-primary-light"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Tools (Theme, Language, User) */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle theme"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center space-x-1"
              >
                <Globe size={20} />
                <span className="text-xs font-bold uppercase">{language}</span>
              </button>
              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg py-1 animate-fadeIn">
                  {["en", "es", "fr"].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => changeLanguage(lang)}
                      className="w-full text-left px-4 py-2 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 uppercase"
                    >
                      {lang === "en" ? "English" : lang === "es" ? "Español" : "Français"}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Account / Profile */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 p-1.5 rounded-full border border-slate-300 dark:border-slate-700 hover:shadow-md transition"
                >
                  <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : <User size={16} />}
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 max-w-[100px] truncate">
                    {currentUser.displayName || currentUser.name}
                  </span>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-2 animate-fadeIn z-50">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                        {currentUser.displayName || currentUser.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                    </div>

                    {/* Role-based panels */}
                    {currentUser.role === "admin" ? (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <Grid size={16} />
                        <span>{t("adminPanel")}</span>
                      </Link>
                    ) : (
                      <>
                        <Link
                          to="/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <UserCheck size={16} />
                          <span>{t("dashboard")}</span>
                        </Link>
                        <Link
                          to="/dashboard?tab=wishlist"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          <Heart size={16} />
                          <span>{t("wishlist")}</span>
                        </Link>
                      </>
                    )}

                    <hr className="my-1 border-slate-100 dark:border-slate-800" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                    >
                      <LogOut size={16} />
                      <span>{t("logout")}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className="px-6 py-2.5 rounded-full bg-primary hover:bg-primary-dark text-white text-sm font-semibold tracking-wider transition duration-200 uppercase shadow-md shadow-primary/20"
              >
                {t("login")}
              </Link>
            )}
          </div>

          {/* Mobile hamburger menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-2 shadow-inner">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-base font-semibold transition ${
                isActive(link.path)
                  ? "bg-primary/10 text-primary"
                  : "text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              {link.name}
            </Link>
          ))}

          <hr className="my-2 border-slate-200 dark:border-slate-800" />

          {/* Language Switcher in Mobile */}
          <div className="flex items-center justify-between px-3 py-2">
            <div className="flex items-center space-x-2 text-slate-800 dark:text-slate-100 font-semibold">
              <Globe size={18} />
              <span>Language:</span>
            </div>
            <div className="flex space-x-2">
              {["en", "es", "fr"].map((lang) => (
                <button
                  key={lang}
                  onClick={() => changeLanguage(lang)}
                  className={`px-3 py-1 rounded text-xs font-bold uppercase transition ${
                    language === lang
                      ? "bg-primary text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          {/* User Account / Profile Mobile */}
          <div className="pt-2 px-3">
            {currentUser ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-3 py-2">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                    {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : <User size={18} />}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 dark:text-white leading-none">
                      {currentUser.displayName || currentUser.name}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">{currentUser.email}</p>
                  </div>
                </div>

                {currentUser.role === "admin" ? (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-center w-full py-2.5 rounded-lg bg-slate-150 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-white font-semibold transition"
                  >
                    {t("adminPanel")}
                  </Link>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-center py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-white font-semibold transition"
                    >
                      {t("dashboard")}
                    </Link>
                    <Link
                      to="/dashboard?tab=wishlist"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-center py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-white font-semibold transition"
                    >
                      {t("wishlist")}
                    </Link>
                  </div>
                )}

                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 rounded-lg border border-red-200 dark:border-red-950/20 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/10 font-bold transition"
                >
                  {t("logout")}
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-center w-full py-3 rounded-lg bg-primary hover:bg-primary-dark text-white font-bold tracking-wide uppercase transition shadow-md shadow-primary/20"
              >
                {t("login")}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
