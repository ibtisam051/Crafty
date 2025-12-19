import React, { useState } from "react";
import { Link } from "react-router-dom";
import '../styles/navbar.css';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
          <Link to="/shop" onClick={handleLinkClick}>Shop</Link>
          <Link to="/artist" onClick={handleLinkClick}>Artist</Link>
          <Link to="/about" onClick={handleLinkClick}>About</Link>
        </div>
      </nav>
    </>
  );
}

export default Navbar;