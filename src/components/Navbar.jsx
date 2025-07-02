import { Link, useNavigate } from "react-router-dom";
import Logo from "../images/logo/logo.png";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark, faUser, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const [nav, setNav] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const openNav = () => {
    setNav(!nav);
  };

  const handleLogout = () => {
    logout();           
    navigate('/'); 
  };

  return (
    <>
      <nav>
        {/* Mobile */}
        <div className={`mobile-navbar ${nav ? "open-nav" : ""}`}>
          <div onClick={openNav} className="mobile-navbar__close">
            <FontAwesomeIcon icon={faXmark} />
          </div>
          <ul className="mobile-navbar__links">
            <li><Link onClick={openNav} to="/">Home</Link></li>
            <li><Link onClick={openNav} to="/about">About</Link></li>
            <li><Link onClick={openNav} to="/all-cars">All Cars</Link></li>
            <li><Link onClick={openNav} to="/Vendors">All Vendors</Link></li>
            <li><Link onClick={openNav} to="/team">Our Team</Link></li>
            <li><Link onClick={openNav} to="/contact">Contact</Link></li>

            {isAuthenticated ? (
              <>
                <li>
                  <Link onClick={openNav} to="/UserProfile" className="mobile-profile-link">
                    Profile
                  </Link>
                </li>
                <li>
                  <button onClick={() => { handleLogout(); openNav(); }} className="mobile-logout-button">
                    <FontAwesomeIcon icon={faRightFromBracket} /> Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link onClick={openNav} to="/login">Sign In</Link></li>
                <li><Link onClick={openNav} to="/register">Register</Link></li>
              </>
            )}
          </ul>
        </div>

        {/* Desktop */}
        <div className="navbar">
          <div className="navbar__img">
            <Link to="/" onClick={() => window.scrollTo(0, 0)}>
              <img src={Logo} alt="logo-img" />
            </Link>
          </div>

          <ul className="navbar__links">
            <li><Link className="home-link" to="/">Home</Link></li>
            <li><Link className="about-link" to="/about">About</Link></li>
            <li><Link className="models-link" to="/all-cars">All Cars</Link></li>
            <li><Link className="testi-link" to="/Vendors">All Vendors</Link></li>
            <li><Link className="team-link" to="/team">Our Team</Link></li>
            <li><Link className="contact-link" to="/contact">Contact</Link></li>
          </ul>

          <div className="navbar__buttons">
            {!isAuthenticated ? (
              <>
                <Link className="navbar__buttons__sign-in" to="/login">Sign In</Link>
                <Link className="navbar__buttons__register" to="/register">Register</Link>
              </>
            ) : (
              <>
                <Link className="navbar__buttons__profile" to="/UserProfile" title="Profile">
                  <FontAwesomeIcon icon={faUser} />
                </Link>
                <button className="navbar__buttons__logout" onClick={handleLogout} title="Logout" style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#ff4d30",
                  fontSize: "18px"
                }}>
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
    </>
  );
}

export default Navbar;
