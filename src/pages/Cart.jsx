import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import '../styles/cart.css';

function Cart() {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your cart is empty</h2>
        <p>Add some products to your cart!</p>
        <Link to="/shop" className="shop-btn">
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>Shopping Cart</h1>

      <div className="cart-items">
        {cartItems.map((item) => {
          const product = item.product || item;
          const categoryName = product.category?.name || product.category || 'Unknown';
          const imageUrl = product.images?.[0]?.image || '/images/products/default.png';
          const price = Number(product.price || 0);

          return (
            <div key={item.id} className="cart-item">
              <img src={imageUrl} alt={product.name} />
              <div className="cart-item-info">
                <h3>{product.name}</h3>
                <p>{categoryName}</p>
                <div className="cart-item-controls">
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
              </div>
              <div className="cart-item-price">
                <div>${(price * item.quantity).toFixed(2)}</div>
                <button onClick={() => removeFromCart(item.id)}>Remove</button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="cart-summary">
        <h2>Order Summary</h2>
        <div className="summary-row">
          <span>Subtotal</span>
          <span>${cartTotal.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Shipping</span>
          <span>Free</span>
        </div>
        <div className="summary-row total">
          <span>Total</span>
          <span>${cartTotal.toFixed(2)}</span>
        </div>

        <div className="cart-actions">
          <button onClick={clearCart} className="clear-btn">
            Clear Cart
          </button>
          <Link to="/checkout" className="checkout-btn">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cart;
