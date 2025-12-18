import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import products from "../components/productsData";
import '../styles/productDetail.css';

const sampleReviews = [
  {
    id: 1,
    name: "Omar",
    location: "Lahore",
    avatar: "/images/artist/artist.png",
    date: "21 July 2025",
    rating: 5,
    text:
      "I was looking for something traditional yet sharp, and these khussas were exactly it. The quality is fantastic and the fit was true to size. The gold details are what really make them stand out. Will be buying in another color soon!",
  },
  {
    id: 2,
    name: "Ayesha",
    location: "Karachi",
    avatar: "/images/artist/artist.png",
    date: "20 July 2025",
    rating: 5,
    text:
      "The craftsmanship is even more beautiful in person. The golden thread against the black leather is so royal. I got so many compliments at my friend's wedding! They were surprisingly comfortable to wear all night. Definitely worth every rupee.",
  },
  {
    id: 3,
    name: "Ali",
    location: "Islamabad",
    avatar: "/images/artist/artist.png",
    date: "18 July 2025",
    rating: 4,
    text:
      "Beautiful craftsmanship and authentic design. The only reason I'm giving 4 stars is because they were slightly tight at first, but they stretched to fit perfectly after a day of wear.",
  },
  {
    id: 4,
    name: "Fatima",
    location: "Rawalpindi",
    avatar: "/images/artist/artist.png",
    date: "15 July 2025",
    rating: 5,
    text:
      "Absolutely stunning! The golden embroidery is even more detailed in person. Received many compliments at a traditional event. Will definitely order more colors.",
  },
];

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === Number(id));
  const [selectedImage, setSelectedImage] = useState(product ? product.image : "");
  const [showAllReviews, setShowAllReviews] = useState(false);

  const handleBuyNow = () => {
    navigate("/checkout", { state: { product } });
  };

  const displayedReviews = showAllReviews ? sampleReviews : sampleReviews.slice(0, 2);

  if (!product) return <h2>Product not found</h2>;

  return (
    <>
      <div className="product-detail-container">
        <div className="product-detail-left">
          <img 
            src={selectedImage} 
            alt={product.title} 
            className="main-image" 
          />

          <div className="thumbnail-row">
            {[
              product.image,
              "/images/products/NoImage.png",
              "/images/products/NoImage.png",
              "/images/products/NoImage.png"
            ].map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`${product.title} view ${idx + 1}`}
                onClick={() => setSelectedImage(src)}
                className={selectedImage === src ? "active" : ""}
              />
            ))}
          </div>
        </div>

        <div className="product-detail-right">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "20px" }}>
            <div>
              <h2 className="product-title">{product.title}</h2>
              <div className="rating-row">
                <span className="stars">★★★★★</span>
                <span className="review-count">440+ Reviewer</span>
              </div>
            </div>

            <div style={{ 
              color: "#ff4d6d", 
              fontSize: "28px", 
              cursor: "pointer", 
              padding: "8px",
              transition: "transform 0.2s"
            }} 
            onMouseEnter={(e) => e.target.style.transform = "scale(1.1)"}
            onMouseLeave={(e) => e.target.style.transform = "scale(1)"}
            >
              ❤
            </div>
          </div>

          <p className="product-description">
            A classic black {product.title.split(' ')[0]}, elegantly detailed with golden embroidery. Handcrafted for a perfect blend of traditional style and modern sophistication.
          </p>

          <div className="category-row">
            Category: <span>{product.category}</span>
          </div>

          <div className="price-button-row">
            <div className="product-price">${product.price}.00</div>
            <button className="buy-now-btn" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>
        </div>
      </div>

      <div className="reviews-container">
        <div className="review-header">
          <span>Reviews</span>
          <div className="review-count-badge">15</div>
        </div>

        {displayedReviews.map((review) => (
          <div key={review.id} className="review-item">
            <img src={review.avatar} alt={review.name} />
            <div className="review-content">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                <div>
                  <div className="review-name">{review.name}</div>
                  <div className="review-location">{review.location}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "#fbbf24", fontSize: "16px", marginBottom: "5px" }}>
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                  </div>
                  <div className="review-date">{review.date}</div>
                </div>
              </div>

              <div className="review-text">{review.text}</div>
            </div>
          </div>
        ))}

        <div 
          className="show-more" 
          onClick={() => setShowAllReviews(!showAllReviews)}
        >
          <span className="show-text">
  {showAllReviews ? "Show Less" : "Show All"}
</span>

        </div>
      </div>
    </>
  );
}

export default ProductDetail;