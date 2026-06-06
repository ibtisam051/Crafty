import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/api";
import "../styles/checkout.css";

function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, cartTotal, clearCart } = useCart();
  const product = location.state?.product || null;
  const quantity = location.state?.quantity || 1;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    town: "",
    date: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.agreeTerms) {
      alert("Please agree to terms and conditions");
      return;
    }
    try {
      const shippingAddress = `${formData.address}, ${formData.town}`;
      await createOrder({ shipping_address: shippingAddress });
      clearCart();
      alert("Order placed successfully!");
      navigate("/");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Error placing order. Please try again.");
    }
  };

  const subtotal = product ? product.price * quantity : cartTotal;
  const tax = (subtotal * 0.1).toFixed(2);
  const total = (parseFloat(subtotal) + parseFloat(tax)).toFixed(2);

  return (
    <div className="checkout-container">
      <div className="checkout-left">
        <form onSubmit={handleSubmit}>
          <div className="checkout-card">
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

          <div className="checkout-card">
            <h3>Payment Method</h3>
            <p className="step-label">Step 2 of 3</p>

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
                    <div className="form-group">
                      <label>Expiration Date</label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
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
                    <img
                      src="https://e7.pngegg.com/pngimages/648/10/png-clipart-visa-logo-credit-card-visa-debit-card-payment-card-mastercard-visa-blue-text.png"
                      alt="Visa"
                    />
                    <img
                      src="https://banner2.cleanpng.com/lnd/20241123/ry/85dda930e3465f586e2b20700028d0.webp"
                      alt="Mastercard"
                    />
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
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/PayPal.svg/120px-PayPal.svg.png?20241230110020"
                    alt="PayPal"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="checkout-card">
            <h3>Confirmation</h3>
            <p className="step-label">Step 3 of 3</p>

            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="agreeMarketing"
                  checked={formData.agreeMarketing}
                  onChange={handleChange}
                />
                I agree with sending marketing and newsletter emails.
              </label>
              <label>
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  required
                />
                I agree with terms and conditions and privacy policy
              </label>
            </div>

            <button type="submit" className="buy-now-btn">
              Buy Now
            </button>

            <div className="security-info">
              <span>🔒</span>
              <div>
                <p>All your data are safe</p>
                <p>
                  We are using the most advanced security to keep your
                  information safe
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="checkout-right">
        <div className="order-summary">
          <h3>Order Summary</h3>

          {product ? (
            <div className="order-item">
              <img src={product.images?.[0]?.image} alt={product.name} />
              <div className="item-details">
                <h4>{product.name}</h4>
                <div className="item-rating">
                  <span style={{ color: "#fbbf24" }}>★★★★★</span>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#777",
                      marginLeft: "4px",
                    }}
                  >
                    440 Reviewers
                  </span>
                </div>
              </div>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="order-item">
                <img
                  src={item.product.images?.[0]?.image}
                  alt={item.product.name}
                />
                <div className="item-details">
                  <h4>{item.product.name}</h4>
                  <p>Qty: {item.quantity}</p>
                </div>
              </div>
            ))
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
            <div className="add-coupon">
              <input type="text" placeholder="Add coupon code" />
              <button type="button">Apply now</button>
            </div>

            <div className="price-row total-row">
              <span>Total Order Price</span>
              <span>${total}</span>
            </div>
            <div className="price-row">
              <span>Overall price and includes order discount</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
