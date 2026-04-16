import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import HeroSection from '../components/HeroSection';
import ProductGrid from '../components/ProductGrid';
import WhyShades from '../components/WhyShades';
import PreviousProjects from '../components/PreviousProjects';
import WhatsAppBubble from '../components/WhatsAppBubble';
import Footer from '../components/Footer';
import '../styles/HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <header className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            <Logo size="medium" showText={true} />
          </Link>
          <div className="navbar-menu">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
          </div>
        </div>
      </header>

      <HeroSection />
      <ProductGrid />
      <WhyShades />
      <PreviousProjects />
      <WhatsAppBubble />
      <Footer />
    </div>
  );
};

export default HomePage;
