import { NavLink } from "react-router-dom";
import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";
import { AuthContext } from "./AuthContext";

function Navbar() {
  const { toggleTheme } = useContext(ThemeContext);
  const { user, login, logout } = useContext(AuthContext);

  const activeStyle = {
    fontWeight: "bold",
    color: "yellow",
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <span className="navbar-brand text-warning">React Lab 🚀</span>

      <div className="navbar-nav">
        <NavLink to="/" className="nav-link" style={({ isActive }) => isActive ? activeStyle : null}>
          Home
        </NavLink>

        <NavLink to="/about" className="nav-link" style={({ isActive }) => isActive ? activeStyle : null}>
          About
        </NavLink>

        <NavLink to="/contact" className="nav-link" style={({ isActive }) => isActive ? activeStyle : null}>
          Contact
        </NavLink>

        <NavLink to="/counter" className="nav-link" style={({ isActive }) => isActive ? activeStyle : null}>
          Counter
        </NavLink>

        <NavLink to="/users" className="nav-link" style={({ isActive }) => isActive ? activeStyle : null}>
          Users
        </NavLink>

        <NavLink to="/ref" className="nav-link" style={({ isActive }) => isActive ? activeStyle : null}>
          useRef
        </NavLink>

        <NavLink to="/todo" className="nav-link" style={({ isActive }) => isActive ? activeStyle : null}>
          Todo
        </NavLink>
      </div>

      {/* Right Side Buttons */}
      <div className="ms-auto d-flex align-items-center">

        {/* Theme Toggle */}
        <button className="btn btn-warning mx-2" onClick={toggleTheme}>
          Theme
        </button>

        {/* Auth */}
        {user ? (
          <>
            <span className="text-light mx-2">Welcome, {user.name}</span>
            <button className="btn btn-danger" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <button className="btn btn-success" onClick={login}>
            Login
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;