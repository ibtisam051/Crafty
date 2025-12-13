import React from "react";
import ProductCard from "./ProductCard";
import { Link } from "react-router-dom";
import '../styles/products.css';

function ProductsRow({ products, title = "Products", showViewAll = true, variant = "home" }) {
  return (
    <div className="products-section">
      {title && (
        <div className="products-header">
          <h3>{title}</h3>
          {showViewAll && <Link to="/shop">View All</Link>}
        </div>
      )}

      <div className="products-grid">
        {products.map((p, i) => (
          <ProductCard key={i} {...p} variant={variant} />
        ))}
      </div>
    </div>
  );
}

export default ProductsRow;
