/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from "react";

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

const translations = {
  en: {
    home: "Home",
    rooms: "Rooms",
    services: "Services",
    aboutUs: "About Us",
    contactUs: "Contact Us",
    faq: "FAQ",
    dashboard: "Dashboard",
    adminPanel: "Admin Panel",
    login: "Login",
    register: "Register",
    logout: "Logout",
    searchPlaceholder: "Where are you going?",
    checkIn: "Check-in Date",
    checkOut: "Check-out Date",
    guests: "Guests",
    roomType: "Room Type",
    searchBtn: "Search Rooms",
    featuredRooms: "Featured Rooms",
    testimonials: "What Our Guests Say",
    popularDestinations: "Popular Destinations",
    footerText: "Your premium luxury lodging partner. Book the finest suites with ease.",
    aboutHeading: "Welcome to Hotelier",
    aboutSubheading: "A New Standard of Luxury Living",
    exploreRooms: "Explore Our Rooms",
    allRooms: "All Rooms",
    singleBed: "Single Bed",
    doubleBed: "Double Bed",
    suite: "Luxury Suite",
    priceRange: "Price Range",
    rating: "Rating",
    amenities: "Amenities",
    bookNow: "Book Now",
    loading: "Loading rooms...",
    profile: "Profile",
    bookings: "Bookings",
    wishlist: "Wishlist",
    adminDashboard: "Admin Analytics",
    coupons: "Manage Coupons",
    activeBanners: "Banners"
  },
  es: {
    home: "Inicio",
    rooms: "Habitaciones",
    services: "Servicios",
    aboutUs: "Sobre Nosotros",
    contactUs: "Contacto",
    faq: "Preguntas Frecuentes",
    dashboard: "Panel de Usuario",
    adminPanel: "Panel de Admin",
    login: "Iniciar Sesión",
    register: "Registrarse",
    logout: "Cerrar Sesión",
    searchPlaceholder: "¿A dónde vas?",
    checkIn: "Fecha de Entrada",
    checkOut: "Fecha de Salida",
    guests: "Huéspedes",
    roomType: "Tipo de Habitación",
    searchBtn: "Buscar Habitaciones",
    featuredRooms: "Habitaciones Destacadas",
    testimonials: "Lo que dicen nuestros huéspedes",
    popularDestinations: "Destinos Populares",
    footerText: "Su socio de hospedaje de lujo premium. Reserve las mejores suites con facilidad.",
    aboutHeading: "Bienvenido a Hotelier",
    aboutSubheading: "Un nuevo estándar de vida de lujo",
    exploreRooms: "Explorar nuestras habitaciones",
    allRooms: "Todas las Habitaciones",
    singleBed: "Cama Individual",
    doubleBed: "Cama Doble",
    suite: "Suite de Lujo",
    priceRange: "Rango de Precios",
    rating: "Calificación",
    amenities: "Servicios",
    bookNow: "Reservar Ahora",
    loading: "Cargando habitaciones...",
    profile: "Perfil",
    bookings: "Reservas",
    wishlist: "Lista de deseos",
    adminDashboard: "Analíticas de Admin",
    coupons: "Gestionar Cupones",
    activeBanners: "Banners"
  },
  fr: {
    home: "Accueil",
    rooms: "Chambres",
    services: "Services",
    aboutUs: "À Propos",
    contactUs: "Contact",
    faq: "FAQ",
    dashboard: "Tableau de Bord",
    adminPanel: "Panneau Admin",
    login: "Connexion",
    register: "Inscription",
    logout: "Déconnexion",
    searchPlaceholder: "Où allez-vous?",
    checkIn: "Date d'arrivée",
    checkOut: "Date de départ",
    guests: "Voyageurs",
    roomType: "Type de Chambre",
    searchBtn: "Rechercher",
    featuredRooms: "Chambres Vedettes",
    testimonials: "Ce que disent nos clients",
    popularDestinations: "Destinations Populaires",
    footerText: "Votre partenaire d'hébergement de luxe premium. Réservez les meilleures suites en toute simplicité.",
    aboutHeading: "Bienvenue à Hotelier",
    aboutSubheading: "Une nouvelle norme de vie de luxe",
    exploreRooms: "Explorer nos chambres",
    allRooms: "Toutes les Chambres",
    singleBed: "Simple Lit",
    doubleBed: "Double Lit",
    suite: "Suite de Luxe",
    priceRange: "Gamme de Prix",
    rating: "Évaluation",
    amenities: "Équipements",
    bookNow: "Réserver",
    loading: "Chargement des chambres...",
    profile: "Profil",
    bookings: "Réservations",
    wishlist: "Favoris",
    adminDashboard: "Analyses Admin",
    coupons: "Gérer les Coupons",
    activeBanners: "Bannières"
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("hl_language") || "en";
  });

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("hl_language", lang);
  };

  const t = (key) => {
    return translations[language]?.[key] || translations["en"]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
