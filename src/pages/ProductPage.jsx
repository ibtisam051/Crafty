import React, { useState, useMemo } from "react";
import ProductsRow from "../components/ProductsRow";
import products from "../components/productsData";

function ProductPage() {
  const [selectedFilters, setSelectedFilters] = useState({
    Textiles: true,
    Pottery: true,
    Footwear: true,
  });
  const [maxPrice, setMaxPrice] = useState(300);
  const [displayCount, setDisplayCount] = useState(6);

  const categoryCounts = useMemo(() => {
    const counts = {};
    products.forEach((product) => {
      counts[product.category] = (counts[product.category] || 0) + 1;
    });
    return counts;
  }, []);

  const allCategories = useMemo(() => {
    return [...new Set(products.map((p) => p.category))];
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryMatch = selectedFilters[product.category];
      const priceMatch = product.price <= maxPrice;
      return categoryMatch && priceMatch;
    });
  }, [selectedFilters, maxPrice]);

  const displayedProducts = filteredProducts.slice(0, displayCount);

  const handleFilterChange = (category) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handlePriceChange = (e) => {
    setMaxPrice(Number(e.target.value));
  };

  const handleShowMore = () => {
    setDisplayCount((prev) => prev + 6);
  };

  return (
    <div className="shop-fixed-sidebar">
      <div className="product-page-container">
        <aside className="sidebar">
          <h4 className="sidebar-title">TYPE</h4>
          <div className="filters-list">
            {allCategories.map((category) => (
              <label key={category}>
                <input
                  type="checkbox"
                  checked={selectedFilters[category] || false}
                  onChange={() => handleFilterChange(category)}
                />
                {category} ({categoryCounts[category]})
              </label>
            ))}
          </div>

          <h4 className="sidebar-title">PRICE</h4>
          <div className="price-filter">
            <input
              type="range"
              min="0"
              max="300"
              value={maxPrice}
              onChange={handlePriceChange}
            />
            <p>Max. ${maxPrice}.00</p>
          </div>
        </aside>

        <main className="product-list-container">
          <ProductsRow products={displayedProducts} title="" showViewAll={false} />
          {displayCount < filteredProducts.length && (
            <div className="load-more">
              <button onClick={handleShowMore}>Show more products</button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default ProductPage;
