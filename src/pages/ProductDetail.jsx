import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import products from "../components/productsData";

const sampleReviews = [
  {
    id: 1,
    name: "Omar",
    location: "Lahore",
    avatar: "https://i.pravatar.cc/45?img=32",
    date: "21 July 2025",
    rating: 5,
    text:
      "I was looking for something traditional yet sharp, and these khussas were exactly it. The quality is fantastic and the fit was true to size. The gold details are what really make them stand out.",
  },
  {
    id: 2,
    name: "Ayesha",
    location: "Karachi",
    avatar: "https://i.pravatar.cc/45?img=15",
    date: "20 July 2025",
    rating: 5,
    text:
      "The craftsmanship is even more beautiful in person. The golden thread against the black leather is so royal. Definitely worth every rupee.",
  },
];

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === Number(id));
  const [selectedImage, setSelectedImage] = useState(product ? product.image : "");

  const handleBuyNow = () => {
    navigate("/checkout", { state: { product } });
  };

  if (!product) return <h2>Product not found</h2>;

  return (
    <>
      <div className="product-detail-container">
        <div className="product-detail-left">
          <img src={selectedImage} alt={product.title} className="main-image" />

          <div className="thumbnail-row">
            {/* thumbnails - reuse the same image if only one provided */}
            {[product.image, product.image, product.image].map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`${product.title} ${idx + 1}`}
                onClick={() => setSelectedImage(src)}
              />
            ))}
          </div>
        </div>

        <div className="product-detail-right">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
            <div>
              <h2 className="product-title">{product.title}</h2>
              <div className="rating-row">
                <span style={{ color: "#fbbf24", marginRight: 6 }}>★★★★★</span>
                <span style={{ color: "#777", fontSize: 14 }}>440+ Reviewer</span>
              </div>
            </div>

            <div style={{ color: "#ff4d6d", fontSize: 20 }}>❤</div>
          </div>

          <p className="product-description">
            A classic {product.title}, elegantly detailed with golden embroidery. Handcrafted for a perfect blend of traditional style and modern sophistication.
          </p>

          <div className="category-row">
            Category <span style={{ marginLeft: 6, color: "#3b82f6" }}>{product.category}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="product-price">${product.price}.00</div>
            <button className="buy-now-btn" onClick={handleBuyNow}>Buy Now</button>
          </div>
        </div>
      </div>

      <div className="reviews-container">
        <div className="review-header">
          <span>Reviews</span>
          <div style={{ marginLeft: 8, background: "#eef2ff", color: "#3b82f6", padding: "4px 8px", borderRadius: 6 }}>13</div>
        </div>

        {sampleReviews.map((r) => (
          <div key={r.id} className="review-item">
            <img src={r.avatar} alt={r.name} />
            <div className="review-content">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div className="review-name">{r.name}</div>
                  <div className="review-location">{r.location}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ color: "#fbbf24" }}>{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
                  <div className="review-date" style={{ color: "#999", fontSize: 12 }}>{r.date}</div>
                </div>
              </div>

              <div className="review-text" style={{ marginTop: 8 }}>{r.text}</div>
            </div>
          </div>
        ))}

        <div className="show-more">Show All ▾</div>
      </div>
    </>
  );
}

export default ProductDetail;
