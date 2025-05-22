"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/Checkout.css"
import api from "../api"

function Checkout({ cart, clearCart, user }) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    paymentMethod: "credit",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const calculateSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const orderData = {
        userId: user._id,
        items: cart.map((item) => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        shippingAddress: {
          fullName: formData.fullName,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        paymentMethod: formData.paymentMethod,
        totalAmount: calculateSubtotal(),
      }

      const data = await api.orders.createOrder(orderData)

      // Clear the cart
      clearCart()

      // Redirect to order confirmation
      navigate(`/orders?success=true&orderId=${data._id}`)
    } catch (err) {
      setError(err.message || "Failed to place order")
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    navigate("/cart")
    return null
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      {error && <div className="error-message">{error}</div>}

      <div className="checkout-container">
        <form className="checkout-form" onSubmit={handleSubmit}>
          <div className="form-section">
            <h2>Shipping Information</h2>

            <div className="form-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input type="text" id="city" name="city" value={formData.city} onChange={handleInputChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="state">State/Province</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="zipCode">ZIP/Postal Code</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Payment Method</h2>

            <div className="payment-methods">
              <div className="payment-method">
                <input
                  type="radio"
                  id="credit"
                  name="paymentMethod"
                  value="credit"
                  checked={formData.paymentMethod === "credit"}
                  onChange={handleInputChange}
                />
                <label htmlFor="credit">Credit Card</label>
              </div>

              <div className="payment-method">
                <input
                  type="radio"
                  id="debit"
                  name="paymentMethod"
                  value="debit"
                  checked={formData.paymentMethod === "debit"}
                  onChange={handleInputChange}
                />
                <label htmlFor="debit">Debit Card</label>
              </div>

              <div className="payment-method">
                <input
                  type="radio"
                  id="paypal"
                  name="paymentMethod"
                  value="paypal"
                  checked={formData.paymentMethod === "paypal"}
                  onChange={handleInputChange}
                />
                <label htmlFor="paypal">PayPal</label>
              </div>
            </div>

            {/* For simplicity, we're not collecting actual payment details */}
            <p className="payment-note">Note: This is a demo application. No actual payment will be processed.</p>
          </div>

          <button type="submit" className="btn btn-primary place-order-btn" disabled={loading}>
            {loading ? "Processing..." : "Place Order"}
          </button>
        </form>

        <div className="order-summary">
          <h2>Order Summary</h2>

          <div className="order-items">
            {cart.map((item) => (
              <div key={item._id} className="order-item">
                <div className="item-info">
                  <img src={item.image || "/placeholder.svg"} alt={item.name} className="item-image" />
                  <div>
                    <h3>{item.name}</h3>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                </div>
                <p className="item-price">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

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
        </div>
      </div>
    </div>
  )
}

export default Checkout
