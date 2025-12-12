import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import artists, { artistTypes } from "../components/artistsData";

function ArtistPage() {
  const navigate = useNavigate();
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [likedArtists, setLikedArtists] = useState(
    artists.reduce((acc, a) => {
      if (a.liked) acc[a.id] = true;
      return acc;
    }, {})
  );
  const [showMore, setShowMore] = useState(false);

  const handleViewProfile = (id) => {
    navigate(`/artist/${id}`);
  };

  const toggleType = (typeName) => {
    setSelectedTypes((prev) =>
      prev.includes(typeName)
        ? prev.filter((t) => t !== typeName)
        : [...prev, typeName]
    );
  };

  const toggleLike = (id) => {
    setLikedArtists((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredArtists =
    selectedTypes.length === 0
      ? artists
      : artists.filter((a) => selectedTypes.includes(a.type));

  const displayedArtists = showMore ? filteredArtists : filteredArtists.slice(0, 6);

  return (
    <div className="artist-page-container">
      {/* Sidebar */}
      <div className="artist-sidebar">
        <h3 className="artist-sidebar-title">TYPE</h3>
        {artistTypes.map((type) => (
          <label key={type.name} className="artist-filter-label">
            <input
              type="checkbox"
              checked={selectedTypes.includes(type.name)}
              onChange={() => toggleType(type.name)}
            />
            <span>
              {type.name} <span className="filter-count">({type.count})</span>
            </span>
          </label>
        ))}
      </div>

      {/* Main Content */}
      <div className="artist-main">
        <div className="artist-grid">
          {displayedArtists.map((artist) => (
            <div key={artist.id} className="artist-card">
              <div className="artist-card-image">
                <img src={artist.image} alt={artist.name} />
              </div>

              <div className="artist-card-info">
                <div className="artist-header">
                  <div>
                    <h3 className="artist-name">{artist.name}</h3>
                    <p className="artist-type">{artist.type}</p>
                  </div>
                  <button
                    className="artist-like-btn"
                    onClick={() => toggleLike(artist.id)}
                  >
                    {likedArtists[artist.id] ? "❤️" : "🤍"}
                  </button>
                </div>
                <button className="view-profile-btn" onClick={() => handleViewProfile(artist.id)}>View Profile</button>
              </div>
            </div>
          ))}
        </div>

        {filteredArtists.length > 6 && !showMore && (
          <div className="show-more-artist">
            <button
              className="show-more-artist-btn"
              onClick={() => setShowMore(true)}
            >
              Show more artist
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ArtistPage;
