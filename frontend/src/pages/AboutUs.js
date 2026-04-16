import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import Footer from '../components/Footer';
import '../styles/AboutUs.css';

const AboutUs = () => {
  const navigate = useNavigate();

  return (
    <div className="about-page">
      <header className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            <Logo size="medium" showText={true} />
          </Link>
          <div className="navbar-menu">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/about" className="nav-link active">About</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
            <Link to="/admin-login" className="nav-link admin-link">Admin</Link>
          </div>
        </div>
      </header>

      <div className="about-content">
        <button onClick={() => navigate(-1)} className="back-button" title="Go back to previous page">
          ← Back
        </button>
        <div className="about-hero">
          <h1>About Prime Wave Executive Shades</h1>
          <p className="subtitle">Leading Provider of Premium Parking Solutions</p>
        </div>

        <div className="about-container">
          <section className="about-section">
            <h2>Our Mission</h2>
            <p>
              At Prime Wave Executive Shades, our mission is to provide innovative, 
              high-quality parking shade solutions that protect vehicles, enhance comfort, 
              and deliver exceptional value to our customers. We are committed to excellence 
              in every aspect of our business.
            </p>
          </section>

          <section className="about-section">
            <h2>Who We Are</h2>
            <p>
              With years of industry experience, Prime Wave Executive Shades has established 
              itself as a trusted leader in the parking shade market. Our team of dedicated 
              professionals is passionate about delivering superior products and customer 
              service that exceed expectations.
            </p>
          </section>

          <section className="about-section">
            <h2>Our Values</h2>
            <div className="values-grid">
              <div className="value-card">
                <h3>Quality</h3>
                <p>We use premium materials and advanced manufacturing techniques to ensure durability and performance.</p>
              </div>
              <div className="value-card">
                <h3>Innovation</h3>
                <p>We continuously innovate to bring cutting-edge solutions that address evolving customer needs.</p>
              </div>
              <div className="value-card">
                <h3>Reliability</h3>
                <p>Our products are built to last, providing long-term protection and value for your investment.</p>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2>Why Choose Us?</h2>
            <ul className="benefits-list">
              <li>Premium quality materials and construction</li>
              <li>Expert installation and professional service</li>
              <li>Competitive pricing and flexible options</li>
              <li>Excellent customer support and warranty</li>
              <li>Proven track record of customer satisfaction</li>
              <li>Fast and reliable delivery</li>
            </ul>
          </section>

          <section className="about-section call-to-action">
            <h2>Ready to Protect Your Vehicle?</h2>
            <p>Experience the Prime Wave Executive Shades difference today.</p>
            <Link to="/contact" className="cta-button">Get in Touch</Link>
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutUs;
