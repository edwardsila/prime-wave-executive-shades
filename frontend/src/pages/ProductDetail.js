import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import axios from '../config/axios';
import Logo from '../components/Logo';
import Footer from '../components/Footer';
import WhatsAppBubble from '../components/WhatsAppBubble';
import '../styles/ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleInquire = () => {
    // Open contact form or WhatsApp with product inquiry
    const phoneNumber = '971123456789';
    const message = `Hello! I am interested in inquiring about the ${product?.name}. Can you provide more information?`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const fetchProduct = useCallback(async () => {
    try {
      const response = await axios.get(`/products/${id}`);
      setProduct(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Product not found');
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [id, fetchProduct]);

  if (loading) {
    return <div className="loading-container">Loading product...</div>;
  }

  if (error || !product) {
    return (
      <div className="error-container">
        <h2>{error || 'Product not found'}</h2>
        <Link to="/" className="back-link">← Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <header className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            <Logo size="medium" showText={true} />
          </Link>
          <div className="navbar-menu">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
            <Link to="/admin-login" className="nav-link admin-link">Admin</Link>
          </div>
        </div>
      </header>

      <div className="product-detail-container">
        <button onClick={() => navigate('/')} className="back-button">
          <FaArrowLeft /> Back to Products
        </button>

        <div className="product-detail-content">
          <div className="product-image-section">
            <img src={product.image} alt={product.name} className="product-detail-image" />
            {!product.inStock && <div className="out-of-stock-banner">Out of Stock</div>}
          </div>

          <div className="product-info-section">
            <h1 className="product-title">{product.name}</h1>
            
            <div className="product-meta">
              <span className="category-badge">{product.category}</span>
              <span className={`stock-status ${product.inStock ? 'in-stock' : 'out-of-stock'}`}>
                {product.inStock ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>

            <div className="description-section">
              <h2>Product Description</h2>
              <p className="full-description">{product.description}</p>
            </div>

            <div className="product-actions">
              <button className="inquire-btn" onClick={handleInquire} title="Send product inquiry via WhatsApp">
                Inquire Now
              </button>
              <a 
                href={`https://wa.me/971123456789?text=I'm interested in ${product.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-btn"
              >
                Chat on WhatsApp
              </a>
            </div>

            <div className="product-details-grid">
              <div className="detail-item">
                <h3>Quality Assurance</h3>
                <p>Premium materials built to last</p>
              </div>
              <div className="detail-item">
                <h3>Expert Installation</h3>
                <p>Professional setup included</p>
              </div>
              <div className="detail-item">
                <h3>Warranty</h3>
                <p>Comprehensive coverage provided</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="related-products">
          <h2>More Products</h2>
          <p className="related-subtitle">Explore our complete range of parking shade solutions</p>
          <Link to="/" className="browse-all-btn">Browse All Products</Link>
        </div>
      </div>

      <WhatsAppBubble />
      <Footer />
    </div>
  );
};

export default ProductDetail;
