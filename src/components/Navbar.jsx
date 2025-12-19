import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext"; 
import '../styles/navbar.css';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartCount } = useCart(); 
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  const handleLinkClick = () => {
    closeMenu();
  };
  return (
    <>
      <div 
        className={`nav-backdrop ${isMenuOpen ? 'active' : ''}`} 
        onClick={closeMenu}
      />
      <nav className="navbar">
        <div className="logo">
          <Link 
            to="/" 
            style={{ textDecoration: "none", color: "inherit" }}
            onClick={closeMenu}
          >
            CRAFTY
          </Link>
        </div>
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Search something here" />
        </div>
        <button 
          className={`navbar-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
        >
        </button>
        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/shop" onClick={handleLinkClick}>Shop</Link>
          <Link to="/artist" onClick={handleLinkClick}>Artist</Link>
          <Link to="/about" onClick={handleLinkClick}>About</Link>          
          <Link to="/cart" className="cart-nav-link" onClick={handleLinkClick}>
            🛒
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
        </div>
      </nav>
    </>
  );
}

export default Navbar;