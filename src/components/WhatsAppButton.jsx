
import React, { useState } from 'react'; 
import { MessageCircle } from 'lucide-react'; 

/**
 * 
 *
 * @param {object} props 
 * @param {string} props.phoneNumber 
 * @param {string} [props.message="Hi! I'm interested in your services."] 
 * @param {string} [props.linkText="Contact via WhatsApp"] 
 * @param {string} [props.className="contact-btn whatsapp-btn"] 
 * @param {Function} [props.onClick]
 */
const WhatsAppButton = ({
  phoneNumber,
  message = "Hi! I'm interested in your services. Can you provide more details?",
  linkText = "Contact via WhatsApp",
  className = "contact-btn whatsapp-btn",
  onClick,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const whatsappLink = phoneNumber
    ? `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    : `https://wa.me/+1234567890?text=${encodeURIComponent(message)}`; 

  const handleLinkClick = (event) => {
   
    event.stopPropagation();
    
    if (onClick) {
      onClick(event);
    }
  
    if (!phoneNumber) {
      console.warn("WhatsAppButton: Phone number is not provided. Using default fallback.");
    }
  };

  return (
    <div className="contact-options">
      <a
        href={whatsappLink}
        className={`${className} ${isFocused ? "focused" : ""}`}
        onClick={handleLinkClick}
        onMouseEnter={() => setIsFocused(true)}
        onMouseLeave={() => setIsFocused(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Chat on WhatsApp with ${phoneNumber || 'the vendor'}`}
       
        title={!phoneNumber ? "Phone number not available. Using a default number." : `Chat on WhatsApp with ${phoneNumber}`}
      >
        
        <span>{linkText}</span>
      </a>
    </div>
  );
};

export default WhatsAppButton;