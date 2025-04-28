"use client"

import { Link } from "react-router-dom"
import "../styles/Cart.css"

function Cart({ cart, updateQuantity, removeFromCart }) {
  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <h1>Your Cart</h1>
        <p>Your cart is empty.</p>
        <Link to="/products" className="btn btn-primary">
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>

      <div className="cart-container">
        <div className="cart-items">
          {cart.map((item) => (
            <div key={item._id} className="cart-item">
              <div className="cart-item-image">
                <img src={item.image || "/placeholder.svg"} alt={item.name} />
              </div>

              <div className="cart-item-details">
                <h3>
                  <Link to={`/products/${item._id}`}>{item.name}</Link>
                </h3>
                <p className="item-price">${item.price.toFixed(2)}</p>
                <p className="item-category">{item.category}</p>
              </div>

              <div className="cart-item-actions">
                <div className="quantity-control">
                  <button className="quantity-btn" onClick={() => updateQuantity(item._id, item.quantity - 1)}>
                    -
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button className="quantity-btn" onClick={() => updateQuantity(item._id, item.quantity + 1)}>
                    +
                  </button>
                </div>

                <p className="item-total">${(item.price * item.quantity).toFixed(2)}</p>

                <button className="remove-btn" onClick={() => removeFromCart(item._id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>${calculateSubtotal().toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span>Free</span>
          </div>

          <div className="summary-row total">
            <span>Total</span>
            <span>${calculateSubtotal().toFixed(2)}</span>
          </div>

          <Link to="/checkout" className="btn btn-primary checkout-btn">
            Proceed to Checkout
          </Link>

          <Link to="/products" className="continue-shopping">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Cart
