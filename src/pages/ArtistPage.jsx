import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import artists, { artistTypes } from "../components/artistsData";
import '../styles/artistPage.css';

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
      <aside className="sidebar">
        <h4 className="sidebar-title">TYPE</h4>
        <div className="filters-list">
          {artistTypes.map((type) => (
            <label key={type.name}>
              <input
                type="checkbox"
                checked={selectedTypes.includes(type.name)}
                onChange={() => toggleType(type.name)}
              />
              {type.name} <span className="filter-count">({type.count})</span>
            </label>
          ))}
        </div>
      </aside>
      <main className="artist-main">
        <div className="artist-grid">
          {displayedArtists.map((artist) => (
            <div key={artist.id} className="artist-card">
              {/* Top: Name + Type + Like */}
              <div className="artist-card-top">
                <div className="artist-name-type">
                  <p className="artist-name">{artist.name}</p>
                  <p className="artist-type">{artist.type}</p>
                </div>
                <button
                  className="artist-like-btn"
                  onClick={() => toggleLike(artist.id)}
                >
                  {likedArtists[artist.id] ? "❤️" : "🤍"}
                </button>
              </div>
              <div className="artist-card-image">
                <img src={artist.image} alt={artist.name} />
              </div>
              <button
                className="view-profile-btn"
                onClick={() => handleViewProfile(artist.id)}
              >
                View Profile
              </button>
            </div>
          ))}
        </div>
        {filteredArtists.length > 6 && !showMore && (
          <div className="load-more">
            <button onClick={() => setShowMore(true)}>Show more artists</button>
          </div>
        )}
      </main>
    </div>
  );
}

export default ArtistPage;
