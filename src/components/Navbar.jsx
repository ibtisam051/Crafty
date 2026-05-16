import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext"; 
import '../styles/navbar.css';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartCount } = useCart(); 
  const token = localStorage.getItem('token');
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  const handleLinkClick = () => {
    closeMenu();
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
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
          {token ? (
            <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>Logout</button>
          ) : (
            <Link to="/login" onClick={handleLinkClick}>Login</Link>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;