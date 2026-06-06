import React from "react";
import "../styles/footer.css";

function Footer() {
  return (
    <div className="footer-wrapper">
      <div className="footer">
        <div className="footer-col">
          <h3>CRAFTY</h3>
          <p>
            Connecting authentic Pakistani artisans with customers worldwide
          </p>
        </div>

        <div className="footer-col">
          <h4>About</h4>
          <p>How it works</p>
          <p>Featured</p>
          <p>Partnership</p>
        </div>

        <div className="footer-col">
          <h4>Socials</h4>
          <p>Discord</p>
          <p>Instagram</p>
          <p>Twitter</p>
          <p>Facebook</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>©2025 CRAFTY. All rights reserved</p>
        <div className="footer-bottom-links">
          <a href="#privacy">Privacy & Policy</a>
          <a href="#terms">Terms & Condition</a>
        </div>
      </div>
    </div>
  );
}

export default Footer;
