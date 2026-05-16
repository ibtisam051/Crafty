import React, { useState, useEffect } from "react";
import HeroSection from "../components/HeroSection";
import ProductsRow from "../components/ProductsRow";
import ArtisansSection from "../components/ArtisansSection";
import { getProducts } from "../services/api";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        setProducts(response.data.results || response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const homepageProducts = products; // show all products on home page

  if (loading) return <div>Loading...</div>;

  return (
    <div className="homepage-container">
      <HeroSection />
      <ProductsRow products={homepageProducts} title="All Products" showViewAll={true} />
      <ArtisansSection />
    </div>
  );
}

export default Home;
