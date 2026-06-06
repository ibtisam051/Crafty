import React, { useState, useEffect } from "react";
import ArtisanCard from "./ArtisanCard";
import { getArtisans } from "../services/api";
import "../styles/artisans.css";

function ArtisansSection() {
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtisans = async () => {
      try {
        const response = await getArtisans();
        setArtisans(response.data.results || response.data);
      } catch (error) {
        console.error("Error fetching artisans:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArtisans();
  }, []);

  if (loading) return <div>Loading artisans...</div>;

  return (
    <section className="artisans-section">
      <div className="container">
        <h2 className="section-title">Meet Our Artisans</h2>
        <div className="artisans-grid">
          {artisans.slice(0, 3).map((artisan) => (
            <ArtisanCard key={artisan.id} artisan={artisan} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ArtisansSection;
