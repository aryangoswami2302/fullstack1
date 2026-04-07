import { NavLink } from 'react-router-dom';
import { FiMonitor, FiShoppingBag } from 'react-icons/fi';

const Navbar = () => {
  return (
    <nav className="navbar glass-navbar">
      <div className="navbar-brand">
        <h1>WEBSITE</h1>
      </div>
      <div className="navbar-links">
        <NavLink 
          to="/" 
          end
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          <FiShoppingBag className="nav-icon" /> Storefront
        </NavLink>
        <NavLink 
          to="/admin" 
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          <FiMonitor className="nav-icon" /> Dashboard
        </NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
