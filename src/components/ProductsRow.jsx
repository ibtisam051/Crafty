import React from "react";
import ProductCard from "./ProductCard";
import { Link } from "react-router-dom";

function ProductsRow({ products, title = "Products", showViewAll = true }) {
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
          <ProductCard key={i} {...p} />
        ))}
      </div>
    </div>
  );
}

export default ProductsRow;
