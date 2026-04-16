import React, { useState } from 'react';
import { FaWhatsapp, FaTimes } from 'react-icons/fa';
import '../styles/WhatsAppBubble.css';

const WhatsAppBubble = () => {
  const [showLabel, setShowLabel] = useState(true);
  const phoneNumber = '719774069'; // Replace with your actual WhatsApp number
  const message = 'Hello! I am interested in your parking shades. Can you provide more information?';

  const whatsappLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <>
      {showLabel && (
        <div className="whatsapp-label">
          <span className="label-text">Click here to contact us</span>
          <button 
            className="label-close"
            onClick={() => setShowLabel(false)}
            aria-label="Close label"
          >
            <FaTimes size={12} />
          </button>
        </div>
      )}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-bubble"
        title="Chat with us on WhatsApp"
        onMouseEnter={() => setShowLabel(true)}
      >
        <FaWhatsapp size={40} />
      </a>
    </>
  );
};

export default WhatsAppBubble;
