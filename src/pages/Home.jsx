import React from "react";
import HeroSection from "../components/HeroSection";
import ProductsRow from "../components/ProductsRow";
import ArtisansSection from "../components/ArtisansSection";
import products from "../components/productsData"; // import common products

function Home() {
  return (
    <div className="homepage-container">
      <HeroSection />
      <ProductsRow products={products} title="Popular Products" showViewAll={true} />
      <ArtisansSection />
    </div>
  );
}

export default Home;
