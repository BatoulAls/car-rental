import { Link, useNavigate } from "react-router-dom";
import Logo from "../images/logo/logo.png";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark, faUser, faRightFromBracket, faCar } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from "../context/AuthContext";

function Navbar({ role = "customer" }) {
  const [nav, setNav] = useState(false);
  const { isAuthenticated, logout, loading } = useAuth(); 
  const navigate = useNavigate();

  const openNav = () => setNav(!nav);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const customerLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/all-cars", label: "All Cars" },
    { to: "/Companies", label: "All Vendors" },
    { to: "/team", label: "Our Team" },
    { to: "/contact", label: "Contact" },
  ];

  const vendorLinks = [
    { to: "/vendors/MyCars", label: "My Cars", icon: faCar },
  ];

  const navLinks = role === "vendor" ? vendorLinks : customerLinks;

  if (loading) return null; 

  return (
    <nav>
      {/* Mobile Navbar */}
      <div className={`mobile-navbar ${nav ? "open-nav" : ""}`}>
        <div onClick={openNav} className="mobile-navbar__close">
          <FontAwesomeIcon icon={faXmark} />
        </div>
        <ul className="mobile-navbar__links">
          {navLinks.map((link, index) => (
            <li key={index}>
              <Link onClick={openNav} to={link.to}>
                {link.icon && <FontAwesomeIcon icon={link.icon} />} {link.label}
              </Link>
            </li>
          ))}

          {isAuthenticated && (
            <>
              {role === "customer" && (
                <li>
                  <Link onClick={openNav} to="/UserProfile" className="mobile-profile-link">Profile</Link>
                </li>
              )}
              <li>
                <button onClick={() => { handleLogout(); openNav(); }}>
                  <FontAwesomeIcon icon={faRightFromBracket} /> Logout
                </button>
              </li>
            </>
          )}

          {!isAuthenticated && role === "customer" && (
            <>
              <li><Link onClick={openNav} to="/login">Sign In</Link></li>
              <li><Link onClick={openNav} to="/register">Register</Link></li>
            </>
          )}
        </ul>
      </div>

      {/* Desktop Navbar */}
      <div className="navbar">
        <div className="navbar__img">
          <Link to={role === "vendor" ? "/vendors/MyCars" : "/"}>
            <img src={Logo} alt="logo-img" />
          </Link>
        </div>

        <ul className="navbar__links">
          {navLinks.map((link, index) => (
            <li key={index}>
              <Link to={link.to}>{link.label}</Link>
            </li>
          ))}
        </ul>

        <div className="navbar__buttons">
          {!isAuthenticated ? (
            <>
              <Link className="navbar__buttons__sign-in" to="/login">Sign In</Link>
              <Link className="navbar__buttons__register" to="/register">Register</Link>
            </>
          ) : (
            <>
              {role === "customer" && (
                <Link className="navbar__buttons__profile" to="/UserProfile">
                  <FontAwesomeIcon icon={faUser} />
                </Link>
              )}
              <button className="navbar__buttons__logout" onClick={handleLogout}>
                <FontAwesomeIcon icon={faRightFromBracket} />
              </button>
            </>
          )}
        </div>

        <div className="mobile-hamb" onClick={openNav}>
          <FontAwesomeIcon icon={faBars} />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
