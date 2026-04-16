import React from 'react';
import { FaShieldAlt, FaLeaf, FaThermometerHalf } from 'react-icons/fa';
import '../styles/WhyShades.css';

const WhyShades = () => {
  const benefits = [
    {
      id: 'a',
      icon: <FaShieldAlt />,
      title: 'UV Protection',
      description: 'Protect your vehicle from harmful UV rays and sun damage. Our premium shades block up to 99% of ultraviolet radiation, keeping your car\'s interior cool and preventing paint fading.'
    },
    {
      id: 'b',
      icon: <FaThermometerHalf />,
      title: 'Temperature Control',
      description: 'Reduce interior temperature by up to 20°C (36°F). Our executive shades create a natural cooling system, reducing your air conditioning load and saving fuel consumption.'
    },
    {
      id: 'c',
      icon: <FaLeaf />,
      title: 'Privacy & Security',
      description: 'Enjoy complete privacy and security for your vehicle. Our shades prevent outsiders from seeing inside, protecting your belongings and enhancing overall safety.'
    }
  ];

  return (
    <section className="why-shades-section">
      <div className="container">
        <h2 className="section-title">Why Install Executive Shades?</h2>
        <p className="section-subtitle">Discover the benefits of premium parking shade solutions</p>
        
        <div className="benefits-grid">
          {benefits.map((benefit) => (
            <div key={benefit.id} className="benefit-card">
              <div className="benefit-icon">{benefit.icon}</div>
              <div className="benefit-letter">{benefit.id.toUpperCase()}</div>
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyShades;
