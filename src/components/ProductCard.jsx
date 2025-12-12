import React, { useState } from "react";
import { Link } from "react-router-dom";

function ProductCard({ id, title, category, price, image }) {
  const [liked, setLiked] = useState(false);

  const handleLikeClick = (e) => {
    e.preventDefault();
    setLiked(!liked);
  };

  return (
    <Link to={`/product/${id}`} className="product-card-link">
      <div className="product-card">
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
          <button className="buy-btn">Buy Now</button>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
