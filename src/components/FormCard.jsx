import React from 'react';
import '../styles/Register.css';

const FormCard = ({ title, subtitle, footerText, footerLinkText, footerLinkHref, children, isVisible }) => {
  return (
    <div
      className={`register-card-reg ${isVisible ? 'is-visible' : ''}`} 
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(50px) scale(0.9)'
      }}
    >
      <div className="header-reg">
        <h2 className="title-reg">{title}</h2>
        <div className="title-underline-reg"></div>
        <p className="subtitle-reg">{subtitle}</p>
      </div>

      <div className="form-container-reg">
        {children} 
      </div>

      <div className="footer-reg">
        <p>
          {footerText} <a href={footerLinkHref} className="link-reg">{footerLinkText}</a>
        </p>
      </div>
    </div>
  );
};

export default FormCard;