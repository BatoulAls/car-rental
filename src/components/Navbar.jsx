import { Link } from "react-router-dom";
import Logo from "../images/logo/logo.png";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';

function Navbar() {
  const [nav, setNav] = useState(false);

  const openNav = () => {
    setNav(!nav);
  };

  return (
    <>
      <nav>
        {/* mobile */}
        <div className={`mobile-navbar ${nav ? "open-nav" : ""}`}>
          <div onClick={openNav} className="mobile-navbar__close">
            <FontAwesomeIcon icon={faXmark} />
          </div>
          <ul className="mobile-navbar__links">
            <li><Link onClick={openNav} to="/">Home</Link></li>
            <li><Link onClick={openNav} to="/about">About</Link></li>
            <li><Link onClick={openNav}  to="/all-cars">All Cars</Link></li>
            <li><Link onClick={openNav} to="/Vendors">All Vendors</Link></li>
            <li><Link onClick={openNav} to="/team">Our Team</Link></li>
            <li><Link onClick={openNav} to="/contact">Contact</Link></li>
          </ul>
        </div>

        {/* desktop */}
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
            <Link className="navbar__buttons__sign-in" to="/">Sign In</Link>
            <Link className="navbar__buttons__register" to="/">Register</Link>
          </div>

          {/* mobile hamburger */}
          <div className="mobile-hamb" onClick={openNav}>
            <FontAwesomeIcon icon={faBars} />
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
