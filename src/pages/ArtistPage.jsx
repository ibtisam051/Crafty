import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getArtisans } from "../services/api";
import '../styles/artistPage.css';

function ArtistPage() {
  const navigate = useNavigate();
  const [artists, setArtists] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [likedArtists, setLikedArtists] = useState({});
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtisans = async () => {
      try {
        const response = await getArtisans();
        const loadedArtists = response.data;
        setArtists(loadedArtists);
        setLikedArtists(
          loadedArtists.reduce((acc, artist) => {
            acc[artist.id] = false;
            return acc;
          }, {})
        );
      } catch (error) {
        console.error('Error fetching artisans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtisans();
  }, []);

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

  const artistTypes = Array.from(
    artists.reduce((acc, artist) => {
      const type = artist.craft_specialty || 'Other';
      acc.set(type, (acc.get(type) || 0) + 1);
      return acc;
    }, new Map())
  ).map(([name, count]) => ({ name, count }));

  const filteredArtists =
    selectedTypes.length === 0
      ? artists
      : artists.filter((a) => selectedTypes.includes(a.craft_specialty));

  const displayedArtists = showMore ? filteredArtists : filteredArtists.slice(0, 6);

  if (loading) return <div>Loading artisans...</div>;

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
              <div className="artist-card-top">
                <div className="artist-name-type">
                  <p className="artist-name">{artist.business_name}</p>
                  <p className="artist-type">{artist.craft_specialty}</p>
                </div>
                <button
                  className="artist-like-btn"
                  onClick={() => toggleLike(artist.id)}
                >
                  {likedArtists[artist.id] ? "❤️" : "🤍"}
                </button>
              </div>
              <div className="artist-card-image">
                <img src={artist.image || "/images/artist/artist.png"} alt={artist.business_name} />
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
