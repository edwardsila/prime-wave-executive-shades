import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaWhatsapp } from 'react-icons/fa';
import Logo from '../components/Logo';
import Footer from '../components/Footer';
import '../styles/ContactUs.css';

const ContactUs = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.phone || !formData.subject || !formData.message) {
      setError('Please fill in all fields');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Here you would typically send the form data to your backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setError('');
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="contact-page">
      <header className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            <Logo size="medium" showText={true} />
          </Link>
          <div className="navbar-menu">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/contact" className="nav-link active">Contact</Link>
            <Link to="/admin-login" className="nav-link admin-link">Admin</Link>
          </div>
        </div>
      </header>

      <div className="contact-content">
        <button onClick={() => navigate(-1)} className="back-button" title="Go back to previous page">
          ← Back
        </button>
        <div className="contact-hero">
          <h1>Contact Us</h1>
          <p className="subtitle">We'd love to hear from you. Get in touch with our team today.</p>
        </div>

        <div className="contact-container">
          <div className="contact-info-section">
            <h2>Get in Touch</h2>
            
            <div className="contact-methods">
              <div className="contact-method">
                <div className="method-icon">
                  <FaPhone />
                </div>
                <div className="method-content">
                  <h3>Phone</h3>
                  <p>+254 71977 4069</p>
                  <p className="subtitle-small">Available 9 AM - 6 PM, Saturday - Thursday</p>
                </div>
              </div>

              <div className="contact-method">
                <div className="method-icon">
                  <FaEnvelope />
                </div>
                <div className="method-content">
                  <h3>Email</h3>
                  <p>primewaveshades@gmail.com</p>
                  <p className="subtitle-small">We'll respond within 24 hours</p>
                </div>
              </div>

              <div className="contact-method">
                <div className="method-icon whatsapp">
                  <FaWhatsapp />
                </div>
                <div className="method-content">
                  <h3>WhatsApp</h3>
                  <p>+254 71977 4069</p>
                  <p className="subtitle-small">Chat with us for quick responses</p>
                </div>
              </div>

              <div className="contact-method">
                <div className="method-icon">
                  <FaMapMarkerAlt />
                </div>
                <div className="method-content">
                  <h3>Location</h3>
                  <p>Kenya, Kitui town, Mulimall shop 53</p>
                  <p className="subtitle-small">Visit our showroom by appointment</p>
                </div>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={handleSubmit}>
            <h2>Send us a Message</h2>

            {submitted && (
              <div className="success-message">
                ✓ Thank you for your message! We'll get back to you soon.
              </div>
            )}

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Full Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your Name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+254 123 456 789"
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label htmlFor="message">Message *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us more about your inquiry..."
                rows="5"
              />
            </div>

            <button type="submit" className="submit-btn">
              Send Message
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ContactUs;
