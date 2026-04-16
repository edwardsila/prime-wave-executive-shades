import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/ProductGrid.css';
import products from '../data/products';

const ProductGrid = () => {
  const [productList, setProductList] = useState([]);

  useEffect(() => {
    setProductList(products);
  }, []);

  return (
    <div className="products-section">
      <div className="container">
        <h2 className="section-title">Our Products</h2>
        {productList.length === 0 ? (
          <p className="no-products">No products available at the moment</p>
        ) : (
          <div className="products-grid">
            {productList.map((product) => (
              <Link key={product._id} to={`/product/${product._id}`} className="product-card-link">
                <div className="product-card">
                  <div className="product-image">
                    <img src={product.image} alt={product.name} />
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
