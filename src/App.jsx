import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import ArtistPage from "./pages/ArtistPage";
import ArtistProfilePage from "./pages/ArtistProfilePage";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<ProductPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/artist" element={<ArtistPage />} />
        <Route path="/artist/:id" element={<ArtistProfilePage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
