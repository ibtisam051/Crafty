import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "../styles/products.css";

function ProductCard({ product, variant = "home" }) {
  const { addToCart } = useCart();
  const [liked, setLiked] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const handleLikeClick = (e) => {
    e.preventDefault();
    setLiked(!liked);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, quantity);
  };

  const handleQuantityChange = (e, increase = true) => {
    e.preventDefault();
    e.stopPropagation();
    if (increase) {
      setQuantity((prev) => prev + 1);
    } else {
      setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    }
  };

  return (
    <Link
      to={`/product/${product.slug}`}
      className={`product-card-link ${variant}`}
    >
      <div className={`product-card ${variant}`}>
        <div className="product-card-top">
          <div>
            <h4 className="product-title">{product.name}</h4>
            <p className="product-category">
              {typeof product.category === "object"
                ? product.category.name
                : product.category}
            </p>
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
          <img
            src={product.images?.[0]?.image || "/images/products/NoImage.png"}
            alt={product.name}
            className="product-card-image"
          />
        </div>

        <div className="product-price-section">
          <span className="product-price">${product.price}.00</span>
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
            <button className="buy-btn" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
