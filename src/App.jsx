import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./context/CartContext"; 
import Cart from "./pages/Cart";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import ProductPage from "./pages/ProductPage";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import ArtistPage from "./pages/ArtistPage";
import ArtistProfilePage from "./pages/ArtistProfilePage";
import './styles/global.css';
import About from "./pages/About";

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<ProductPage />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/artist" element={<ArtistPage />} />
          <Route path="/artist/:id" element={<ArtistProfilePage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About/>}/>
        </Routes>
        <Footer />
      </BrowserRouter>
    </CartProvider>
  );
}

export default App;