import React from 'react';
import '../styles/BannerStyles/Banner.css';


function Banner() {
  return (
    <section className="hero-banner1">
      <div className="hero-container-banner1">
        <div className="hero-content-banner1">
          <div className="hero-text-banner1">
            <h2 className="hero-title-banner1">Save a lot with our cheap car rental!</h2>
            <p className="hero-subtitle-banner1">
              Book a car by getting in touch with us
              (963) 456-7869 <span className="highlight-banner1">24/7</span> Support.
            </p>
          </div>
        </div>
      </div>
      <div className="hero-decoration-banner1"></div>
    </section>
  );
}

export default Banner;
