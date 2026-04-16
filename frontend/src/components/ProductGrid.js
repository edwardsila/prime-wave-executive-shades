import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/ProductGrid.css';
import axios from '../config/axios';

const ProductGrid = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/products');
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="products-section">
      <div className="container">
        <h2 className="section-title">Our Products</h2>
        {products.length === 0 ? (
          <p className="no-products">No products available at the moment</p>
        ) : (
          <div className="products-grid">
            {products.map((product) => (
              <Link key={product._id} to={`/product/${product._id}`} className="product-card-link">
                <div className="product-card">
                  <div className="product-image">
                    <img src={product.image} alt={product.name} />
                    {!product.inStock && <div className="out-of-stock">Out of Stock</div>}
                  </div>
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p className="description">{product.description}</p>
                    <div className="product-footer">
                      <button className="contact-btn" title="View product details">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductGrid;
