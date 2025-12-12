import React from "react";
import { Link } from "react-router-dom";

function ArtisanCard({ id, name, role, about, image }) {
  return (
    <Link to={`/artist/${id}`} className="artisan-card-link">
      <div className="artisan-card">
        <div className="artisan-image">
          <img src={image} alt={name} />
        </div>
        <h4>{name}</h4>
        <p className="role">{role}</p>
        <p className="about">{about}</p>
      </div>
    </Link>
  );
}

export default ArtisanCard;
