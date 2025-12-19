import React from "react";
import { Link } from "react-router-dom";
import ArtisansSection from "../components/ArtisansSection";
import '../styles/about.css';

function About() {
  return (
    <div className="about-container">
      
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>Our Story</h1>
          <p>Connecting artisans with art lovers since 2023</p>
        </div>
      </section>

      <section className="about-section">
        <div className="about-content">
          <h2>Our Mission</h2>
          <p>
            At CRAFTY, we believe in the power of handmade. Our mission is to create a platform 
            where talented artisans can showcase their unique creations and connect with people 
            who appreciate authentic craftsmanship.
          </p>
          <div className="mission-stats">
            <div className="stat">
              <h3>500+</h3>
              <p>Artisans</p>
            </div>
            <div className="stat">
              <h3>10,000+</h3>
              <p>Products</p>
            </div>
            <div className="stat">
              <h3>50,000+</h3>
              <p>Happy Customers</p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-section values-section">
        <div className="about-content">
          <h2>Our Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">🎨</div>
              <h3>Authenticity</h3>
              <p>Every product is genuinely handmade with passion and skill.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3>Fair Trade</h3>
              <p>Artisans receive fair compensation for their exceptional work.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🌱</div>
              <h3>Sustainability</h3>
              <p>We promote eco-friendly materials and sustainable practices.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">❤️</div>
              <h3>Community</h3>
              <p>Building connections between creators and appreciators.</p>
            </div>
          </div>
        </div>
      </section>
    <ArtisansSection />
      <section className="about-cta">
        <div className="cta-content">
          <h2>Join Our Community</h2>
          <p>Whether you're an artist or an art lover, there's a place for you here.</p>
          <div className="cta-buttons">
            <Link to="/artist" className="cta-btn primary">Browse All Artists</Link>
            <Link to="/shop" className="cta-btn secondary">Shop Products</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;