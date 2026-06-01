import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Cart from './pages/Cart';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductPage from './pages/ProductPage';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';
import ArtistPage from './pages/ArtistPage';
import ArtistProfilePage from './pages/ArtistProfilePage';
import Login from './pages/Login';
import './styles/global.css';
import About from './pages/About';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<ProductPage />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/artist" element={<ArtistPage />} />
            <Route path="/artist/:id" element={<ArtistProfilePage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
