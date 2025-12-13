import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import artists, { artistReviews } from "../components/artistsData";
import '../styles/artistProfile.css';

function ArtistProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const artist = artists.find((a) => a.id === Number(id));
  const [liked, setLiked] = useState(artist?.liked || false);
  const reviews = artistReviews[id] || [];

  if (!artist) {
    return <h2>Artist not found</h2>;
  }

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    return (
      <>
        {Array(fullStars)
          .fill(0)
          .map((_, i) => (
            <span key={`full-${i}`} style={{ color: "#fbbf24" }}>
              ★
            </span>
          ))}
        {hasHalfStar && (
          <span style={{ color: "#fbbf24" }}>☆</span>
        )}
      </>
    );
  };

  return (
    <>
      <div className="artist-profile-container">
        <div className="artist-profile-left">
          <img src={artist.image} alt={artist.name} className="artist-profile-image" />
        </div>

        <div className="artist-profile-right">
          <div className="artist-profile-header">
            <div>
              <h1 className="artist-profile-name">{artist.name}</h1>
              <div className="artist-profile-rating">
                {renderStars(artist.rating)}
                <span style={{ marginLeft: "6px", color: "#777", fontSize: "14px" }}>
                  · {artist.reviewCount}+ Reviewer
                </span>
              </div>
            </div>
            <button
              className="artist-profile-like-btn"
              onClick={() => setLiked(!liked)}
            >
              {liked ? "❤️" : "🤍"}
            </button>
          </div>

          <p className="artist-profile-bio">{artist.bio}</p>

          <div className="artist-profile-meta">
            <div className="meta-item">
              <span className="meta-label">Category</span>
              <span className="meta-value">{artist.type}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="artist-reviews-container">
        <div className="artist-reviews-header">
          <span>Reviews</span>
          <div style={{ marginLeft: 8, background: "#eef2ff", color: "#3b82f6", padding: "4px 8px", borderRadius: 6 }}>
            {reviews.length || 13}
          </div>
        </div>

        {reviews.length > 0 ? (
          <>
            {reviews.map((review) => (
              <div key={review.id} className="artist-review-item">
                <img src={review.avatar} alt={review.name} />
                <div className="artist-review-content">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div className="artist-review-name">{review.name}</div>
                      <div className="artist-review-location">{review.location}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ color: "#fbbf24" }}>
                        {Array(review.rating)
                          .fill(0)
                          .map((_, i) => (
                            <span key={i}>★</span>
                          ))}
                        {Array(5 - review.rating)
                          .fill(0)
                          .map((_, i) => (
                            <span key={`empty-${i}`} style={{ color: "#ddd" }}>
                              ★
                            </span>
                          ))}
                      </div>
                      <div style={{ color: "#999", fontSize: 12 }}>{review.date}</div>
                    </div>
                  </div>

                  <div className="artist-review-text" style={{ marginTop: 8 }}>
                    {review.text}
                  </div>
                </div>
              </div>
            ))}

            <div className="artist-show-more">Show All ▾</div>
          </>
        ) : (
          <p style={{ textAlign: "center", color: "#999", marginTop: "20px" }}>
            No reviews yet
          </p>
        )}
      </div>
    </>
  );
}

export default ArtistProfilePage;
