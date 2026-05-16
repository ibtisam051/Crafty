import React, { useState, useMemo, useEffect } from "react";
import ProductsRow from "../components/ProductsRow";
import { getProducts, getCategories } from "../services/api";

function ProductPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [maxPrice, setMaxPrice] = useState(300);
  const [displayCount, setDisplayCount] = useState(1000);  // show all by default

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([getProducts(), getCategories()]);
        setProducts(productsRes.data.results || productsRes.data);
        const cats = categoriesRes.data.results || categoriesRes.data;
        setCategories(cats);
        const filters = {};
        cats.forEach(cat => filters[cat.name] = true);
        setSelectedFilters(filters);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categoryCounts = useMemo(() => {
    const counts = {};
    products.forEach((product) => {
      counts[product.category.name] = (counts[product.category.name] || 0) + 1;
    });
    return counts;
  }, [products]);

  const allCategories = useMemo(() => {
    return categories.map(cat => cat.name);
  }, [categories]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const categoryMatch = selectedFilters[product.category.name];
      const priceMatch = product.price <= maxPrice;
      return categoryMatch && priceMatch;
    });
  }, [selectedFilters, maxPrice, products]);

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

  if (loading) return <div>Loading products...</div>;

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
