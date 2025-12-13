import React from "react";
import HeroSection from "../components/HeroSection";
import ProductsRow from "../components/ProductsRow";
import ArtisansSection from "../components/ArtisansSection";
import products from "../components/productsData";

function Home() {
  const homepageProducts = products.slice(0, 4);

  return (
    <div className="homepage-container">
      <HeroSection />
      <ProductsRow products={homepageProducts} title="Popular Products" showViewAll={true} />
      <ArtisansSection />
    </div>
  );
}

export default Home;
