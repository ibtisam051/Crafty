import React, { useState } from "react";
import { Link } from "react-router-dom";
import '../styles/products.css';

function ProductCard({ id, title, category, price, image, variant = "home" }) {
  const [liked, setLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleLikeClick = (e) => {
    e.preventDefault();
    setLiked(!liked);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent navigation to product detail
    // Add cart logic here
    console.log("Added to cart:", { id, title, quantity });
    // You would typically dispatch to a cart context or state manager
  };

  const handleQuantityChange = (e, increase = true) => {
    e.preventDefault();
    e.stopPropagation();
    if (increase) {
      setQuantity(prev => prev + 1);
    } else {
      setQuantity(prev => prev > 1 ? prev - 1 : 1);
    }
  };

  return (
    <Link to={`/product/${id}`} className={`product-card-link ${variant}`}>
      <div className={`product-card ${variant}`}>
        
        <div className="product-card-top">
          <div>
            <h4 className="product-title">{title}</h4>
            <p className="product-category">{category}</p>
          </div>
          <button
            className="product-heart-btn"
            onClick={handleLikeClick}
            aria-label="like product"
          >
            {liked ? "❤️" : "🤍"}
          </button>
        </div>

        <div className="product-image-container">
          <img src={image} alt={title} className="product-card-image" />
        </div>

        <div className="product-price-section">
          <span className="product-price">${price}.00</span>
          <div className="cart-controls">
            {variant === "shop" && (
              <div className="quantity-controls">
                <button 
                  className="quantity-btn" 
                  onClick={(e) => handleQuantityChange(e, false)}
                >
                  −
                </button>
                <span className="quantity">{quantity}</span>
                <button 
                  className="quantity-btn" 
                  onClick={(e) => handleQuantityChange(e, true)}
                >
                  +
                </button>
              </div>
            )}
            <button 
              className="buy-btn"
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;