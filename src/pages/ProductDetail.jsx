import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProduct } from "../services/api";
import { useCart } from "../context/CartContext";
import '../styles/productDetail.css';

const sampleReviews = [
  {
    id: 1,
    name: "Omar",
    location: "Lahore",
    avatar: "/images/artist/artist.png",
    date: "21 July 2025",
    rating: 5,
    text: "I was looking for something traditional yet sharp, and these khussas were exactly it. The quality is fantastic and the fit was true to size. The gold details are what really make them stand out. Will be buying in another color soon!",
  },
  {
    id: 2,
    name: "Ayesha",
    location: "Karachi",
    avatar: "/images/artist/artist.png",
    date: "20 July 2025",
    rating: 5,
    text: "The craftsmanship is even more beautiful in person. The golden thread against the black leather is so royal. I got so many compliments at my friend's wedding! They were surprisingly comfortable to wear all night. Definitely worth every rupee.",
  },
  {
    id: 3,
    name: "Ali",
    location: "Islamabad",
    avatar: "/images/artist/artist.png",
    date: "18 July 2025",
    rating: 4,
    text: "Beautiful craftsmanship and authentic design. The only reason I'm giving 4 stars is because they were slightly tight at first, but they stretched to fit perfectly after a day of wear.",
  },
  {
    id: 4,
    name: "Fatima",
    location: "Rawalpindi",
    avatar: "/images/artist/artist.png",
    date: "15 July 2025",
    rating: 5,
    text: "Absolutely stunning! The golden embroidery is even more detailed in person. Received many compliments at a traditional event. Will definitely order more colors.",
  },
];

function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await getProduct(slug);
        setProduct(response.data);
        setSelectedImage(response.data.images?.[0]?.image || "/images/products/shawl.png");
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  const handleBuyNow = () => {
    navigate("/checkout", { state: { product, quantity } });
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsInCart(true);
    alert(`Added ${quantity} ${product.name}(s) to cart!`);
  };

  const handleQuantityChange = (increase = true) => {
    if (increase) {
      setQuantity(prev => prev + 1);
    } else {
      setQuantity(prev => prev > 1 ? prev - 1 : 1);
    }
  };

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
  };

  const displayedReviews = showAllReviews ? sampleReviews : sampleReviews.slice(0, 2);

  if (loading) return <div>Loading product...</div>;
  if (!product) return <h2>Product not found</h2>;

  return (
    <>
      <div className="product-detail-container">
        <div className="product-detail-left">
          <img 
            src={selectedImage} 
            alt={product.name} 
            className="main-image" 
          />

          <div className="thumbnail-row">
            {(product.images || []).map((img, idx) => (
              <img
                key={idx}
                src={img.image}
                alt={`${product.name} view ${idx + 1}`}
                onClick={() => setSelectedImage(img.image)}
                className={selectedImage === img.image ? "active" : ""}
              />
            ))}
          </div>
        </div>

        <div className="product-detail-right">
          <div className="product-header-row">
            <div>
              <h2 className="product-title">{product.name}</h2>
              <div className="rating-row">
                <span className="stars">★★★★★</span>
                <span className="review-count">440+ Reviewer</span>
              </div>
            </div>

            <button 
              className={`like-btn ${isLiked ? 'liked' : ''}`}
              onClick={handleLikeClick}
              aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
            >
              {isLiked ? "❤️" : "🤍"}
            </button>
          </div>

          <p className="product-description">
            A classic black {product.name.split(' ')[0]}, elegantly detailed with golden embroidery. Handcrafted for a perfect blend of traditional style and modern sophistication.
          </p>

          <div className="category-row">
            Category: <span>{typeof product.category === 'object' ? product.category.name : product.category}</span>
          </div>

          {/* Quantity Controls */}
          <div className="quantity-section">
            <div className="quantity-label">Quantity:</div>
            <div className="quantity-controls">
              <button 
                className="quantity-btn" 
                onClick={() => handleQuantityChange(false)}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="quantity-value">{quantity}</span>
              <button 
                className="quantity-btn" 
                onClick={() => handleQuantityChange(true)}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <div className="total-price">
              Total: <span>${(product.price * quantity).toFixed(2)}</span>
            </div>
          </div>

          <div className="cart-action-buttons">
            <button 
              className={`add-to-cart-btn ${isInCart ? 'in-cart' : ''}`}
              onClick={handleAddToCart}
            >
              {isInCart ? '✓ Added to Cart' : 'Add to Cart'}
            </button>
            <button className="buy-now-btn" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>
        </div>
      </div>

      <div className="reviews-container">
        <div className="review-header">
          <span>Reviews</span>
          <div className="review-count-badge">{sampleReviews.length}</div>
        </div>

        {displayedReviews.map((review) => (
          <div key={review.id} className="review-item">
            <img src={review.avatar} alt={review.name} />
            <div className="review-content">
              <div className="review-header-info">
                <div>
                  <div className="review-name">{review.name}</div>
                  <div className="review-location">{review.location}</div>
                </div>
                <div className="review-rating-date">
                  <div className="review-stars">
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
            {showAllReviews ? "Show Less" : `Show All (${sampleReviews.length})`}
          </span>
        </div>
      </div>
    </>
  );
}

export default ProductDetail;