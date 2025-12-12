import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo"> <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>CRAFTY</Link></div>

      <div className="search-bar">
        <span className="search-icon">🔍</span>
        <input type="text" placeholder="Search something here" />
      </div>

      <div className="nav-links">
        <Link to="/shop">Shop</Link>
        <Link to="/artist">Artist</Link>
        <Link to="/about">About</Link>
      </div>
    </nav>
  );
}

export default Navbar;
