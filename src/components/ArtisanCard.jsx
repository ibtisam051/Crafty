import React from "react";
import { Link } from "react-router-dom";

function ArtisanCard({ artisan }) {
  const name = artisan.business_name || artisan.name || "Artisan";
  const specialty = artisan.craft_specialty || artisan.type || "Craftsman";
  const bio =
    artisan.bio || artisan.sample_products?.length
      ? `Crafts ${specialty}`
      : "Handcrafted goods from a skilled artisan.";

  return (
    <Link to={`/artist/${artisan.id}`} className="artisan-card-link">
      <div className="artisan-card">
        <div className="artisan-image">
          <img src={artisan.image || "/images/artist/artist.png"} alt={name} />
        </div>
        <h4>{name}</h4>
        <p className="role">{specialty}</p>
        <p className="about">{bio}</p>
      </div>
    </Link>
  );
}

export default ArtisanCard;
