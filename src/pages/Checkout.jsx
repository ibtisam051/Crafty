import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product || null;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    town: "",
    elevationDate: "",
    cardNumber: "",
    cardHolder: "",
    cvc: "",
    paymentMethod: "credit-card",
    agreeMarketing: false,
    agreeTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.agreeTerms) {
      alert("Please agree to terms and conditions");
      return;
    }
    alert("Order placed successfully!");
    navigate("/");
  };

  const subtotal = product?.price || 0;
  const tax = (subtotal * 0.1).toFixed(2);
  const total = (parseFloat(subtotal) + parseFloat(tax)).toFixed(2);

  return (
    <div className="checkout-container">
      <div className="checkout-left">
        {/* Billing Info */}
        <form onSubmit={handleSubmit}>
          <div className="checkout-section">
            <h3>Billing Info</h3>
            <p className="step-label">Step 1 of 3</p>

            <div className="form-row">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Your phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Town/City</label>
                <input
                  type="text"
                  name="town"
                  placeholder="Town or city"
                  value={formData.town}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="checkout-section">
            <h3>Payment Method</h3>
            <p className="step-label">Step 2 of 3</p>
            <p className="section-desc">Please select your preferred payment method</p>

            <div className="payment-options">
              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="credit-card"
                  checked={formData.paymentMethod === "credit-card"}
                  onChange={handleChange}
                />
                <span>Credit Card</span>
              </label>

              {formData.paymentMethod === "credit-card" && (
                <div className="card-details">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Card Number</label>
                      <input
                        type="text"
                        name="cardNumber"
                        placeholder="Card number"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Card Holder</label>
                      <input
                        type="text"
                        name="cardHolder"
                        placeholder="Full name"
                        value={formData.cardHolder}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>CVC</label>
                      <input
                        type="text"
                        name="cvc"
                        placeholder="000"
                        value={formData.cvc}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="payment-logos">
                    <img src="https://via.placeholder.com/40x25?text=VISA" alt="Visa" />
                    <img src="https://via.placeholder.com/40x25?text=MC" alt="Mastercard" />
                  </div>
                </div>
              )}

              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="paypal"
                  checked={formData.paymentMethod === "paypal"}
                  onChange={handleChange}
                />
                <span>PayPal</span>
              </label>

              {formData.paymentMethod === "paypal" && (
                <div className="paypal-logo">
                  <img src="https://via.placeholder.com/100x40?text=PayPal" alt="PayPal" />
                </div>
              )}
            </div>
          </div>

          {/* Confirmation */}
          <div className="checkout-section">
            <h3>Confirmation</h3>
            <p className="step-label">Step 3 of 3</p>
            <p className="section-desc">We are getting to the end. Just fill in the below and we'll set up your order(confirm).</p>

            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="agreeMarketing"
                  checked={formData.agreeMarketing}
                  onChange={handleChange}
                />
                I agree with sending an marketing and newsletter emails. No spam, promised!
              </label>
              <label>
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  required
                />
                I agree with our terms and conditions and privacy policy
              </label>
            </div>

            <button type="submit" className="buy-now-btn" style={{ width: "100%", marginTop: "20px" }}>
              Buy Now
            </button>
          </div>

          <div className="security-info">
            <span style={{ fontSize: "20px", marginRight: "8px" }}>🔒</span>
            <div>
              <p style={{ fontWeight: 600, margin: "0 0 4px 0" }}>All your data are safe</p>
              <p style={{ fontSize: "12px", color: "#999", margin: 0 }}>We are using the most advanced security to keep your information safe</p>
            </div>
          </div>
        </form>
      </div>

      {/* Order Summary */}
      <div className="checkout-right">
        <div className="order-summary">
          <h3>Order Summary</h3>

          {product && (
            <div className="order-item">
              <img src={product.image} alt={product.title} />
              <div className="item-details">
                <h4>{product.title}</h4>
                <div className="item-rating">
                  <span style={{ color: "#fbbf24" }}>★★★★★</span>
                  <span style={{ fontSize: "12px", color: "#777", marginLeft: "4px" }}>440 Reviewers</span>
                </div>
              </div>
              <div className="item-price">${product.price}.00</div>
            </div>
          )}

          <div className="price-breakdown">
            <div className="price-row">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="price-row">
              <span>Tax</span>
              <span>${tax}</span>
            </div>
            <div className="price-row" style={{ paddingTop: "12px", borderTop: "1px solid #ddd" }}>
              <span style={{ fontWeight: 600 }}>Total Order Price</span>
              <span style={{ fontWeight: 600, fontSize: "18px" }}>${total}</span>
            </div>
          </div>

          <div className="add-coupon">
            <input type="text" placeholder="Add coupon code" />
            <button type="button">Apply now</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
