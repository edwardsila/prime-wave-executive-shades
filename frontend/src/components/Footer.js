import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter, FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa';
import '../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-container">
          {/* About Section */}
          <div className="footer-section">
            <h3 className="footer-title">Prime Wave</h3>
            <p className="footer-description">
              Premium parking shade solutions designed to protect your vehicle and enhance your comfort.
            </p>
            <div className="social-links">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link facebook" title="Visit us on Facebook" aria-label="Facebook">
                <FaFacebook />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link instagram" title="Visit us on Instagram" aria-label="Instagram">
                <FaInstagram />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="social-link linkedin" title="Visit us on LinkedIn" aria-label="LinkedIn">
                <FaLinkedin />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-link twitter" title="Visit us on Twitter" aria-label="Twitter">
                <FaTwitter />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h3 className="footer-title">Quick Links</h3>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/admin-login">Admin</Link></li>
            </ul>
          </div>

          {/* Products */}
          <div className="footer-section">
            <h3 className="footer-title">Products</h3>
            <ul className="footer-links">
              <li><Link to="/">Parking Shades</Link></li>
              <li><Link to="/">Executive Shades</Link></li>
              <li><Link to="/">Privacy Solutions</Link></li>
              <li><Link to="/">Custom Designs</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h3 className="footer-title">Contact</h3>
            <div className="contact-item">
              <FaPhone className="contact-icon" />
              <span>+254 71977 4069</span>
            </div>
            <div className="contact-item">
              <FaEnvelope className="contact-icon" />
              <span>primewaveshades@gmail.com</span>
            </div>
            <div className="contact-item">
              <FaMapMarkerAlt className="contact-icon" />
              <span>Kitui, Kenya</span>
            </div>
            <div className="contact-item">
              <FaWhatsapp className="contact-icon whatsapp-icon" />
              <span>WhatsApp Support</span>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; {currentYear} Prime Wave Executive Shades. All rights reserved.</p>
            <div className="footer-bottom-links">
              <button 
                onClick={() => alert('Privacy Policy will be displayed here')} 
                className="footer-policy-btn"
                title="View Privacy Policy"
              >
                Privacy Policy
              </button>
              <span className="divider">•</span>
              <button 
                onClick={() => alert('Terms of Service will be displayed here')} 
                className="footer-policy-btn"
                title="View Terms of Service"
              >
                Terms of Service
              </button>
              <span className="divider">•</span>
              <button 
                onClick={() => alert('Cookie Policy will be displayed here')} 
                className="footer-policy-btn"
                title="View Cookie Policy"
              >
                Cookie Policy
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
