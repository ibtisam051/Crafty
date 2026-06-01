import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getArtisan } from '../services/api';
import '../styles/artistProfile.css';

function ArtistProfilePage() {
  const { id } = useParams();
  const [artist, setArtist] = useState(null);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const response = await getArtisan(id);
        setArtist(response.data);
      } catch (error) {
        console.error('Error fetching artist profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtist();
  }, [id]);

  if (loading) return <div>Loading artist profile...</div>;
  if (!artist) return <h2>Artist not found</h2>;

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    return (
      <>
        {Array(fullStars)
          .fill(0)
          .map((_, i) => (
            <span key={`full-${i}`} style={{ color: '#fbbf24' }}>
              ★
            </span>
          ))}
        {hasHalfStar && <span style={{ color: '#fbbf24' }}>☆</span>}
      </>
    );
  };

  return (
    <>
      <div className="artist-profile-container">
        <div className="artist-profile-left">
          <img
            src={artist.image || '/images/artist/artist.png'}
            alt={artist.business_name}
            className="artist-profile-image"
          />
        </div>

        <div className="artist-profile-right">
          <div className="artist-profile-header">
            <div>
              <h1 className="artist-profile-name">{artist.business_name}</h1>
              <div className="artist-profile-rating">
                {renderStars(artist.average_rating || 0)}
                <span style={{ marginLeft: '6px', color: '#777', fontSize: '14px' }}>
                  · {artist.total_sales || 0} sales
                </span>
              </div>
            </div>
            <button className="artist-profile-like-btn" onClick={() => setLiked(!liked)}>
              {liked ? '❤️' : '🤍'}
            </button>
          </div>

          <p className="artist-profile-bio">
            {artist.bio || `Crafts exceptional pieces in ${artist.craft_specialty}.`}
          </p>

          <div className="artist-profile-meta">
            <div className="meta-item">
              <span className="meta-label">Specialty</span>
              <span className="meta-value">{artist.craft_specialty}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Experience</span>
              <span className="meta-value">{artist.experience_years || 0} years</span>
            </div>
          </div>
        </div>
      </div>

      <div className="artist-products-container">
        <div className="artist-products-header">
          <span>Featured Products</span>
          <div
            style={{
              marginLeft: 8,
              background: '#eef2ff',
              color: '#3b82f6',
              padding: '4px 8px',
              borderRadius: 6,
            }}
          >
            {artist.products?.length || 0}
          </div>
        </div>
        <div className="artist-products-grid">
          {artist.products?.map((product) => (
            <div key={product.id} className="artist-product-card">
              <img
                src={product.images?.[0]?.image || '/images/products/NoImage.png'}
                alt={product.name}
              />
              <div className="artist-product-info">
                <h4>{product.name}</h4>
                <p>${product.price}.00</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default ArtistProfilePage;
