import React, { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../styles/HeroSection.css';

const HeroSection = () => {
  const [settings] = useState({
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
  });

  // Replace these URLs with your actual parking shade images
  // You can use:
  // 1. External URLs (e.g., from Imgur, Cloudinary, AWS S3)
  // 2. Local images from public folder: '/images/shade1.jpg'
  // 3. Uploaded images from backend
  const heroImages = [
    'images/hero1.png',
  ];

  return (
    <div className="hero-section">
      <Slider {...settings}>
        {heroImages.map((image, index) => (
          <div key={index} className="hero-slide">
            <img src={image} alt={`Hero Slide ${index + 1}`} />
            <div className="hero-overlay">
              <div className="hero-content">
                <h1>Prime Wave Executive Shades</h1>
                <p>Premium Parking Shades & Privacy Solutions</p>
                <button className="cta-button">Explore Products</button>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HeroSection;
