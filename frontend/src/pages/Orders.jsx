"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import "../styles/Orders.css"
import api from "../api"

function Orders({ user }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const location = useLocation()

  useEffect(() => {
    // Check for success message in URL params
    const queryParams = new URLSearchParams(location.search)
    const success = queryParams.get("success")
    const orderId = queryParams.get("orderId")

    if (success === "true" && orderId) {
      setSuccessMessage(`Order #${orderId.substring(0, 8)} placed successfully!`)

      // Clear success message after 5 seconds
      const timer = setTimeout(() => {
        setSuccessMessage(null)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [location.search])

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const data = await api.orders.getOrdersByUser(user._id)
        setOrders(data)
        setLoading(false)
      } catch (err) {
        setError(err.message || "Failed to fetch orders")
        setLoading(false)
      }
    }

    fetchOrders()
  }, [user._id])

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  if (loading) {
    return <div className="loading">Loading your orders...</div>
  }

  if (error) {
    return <div className="error">Error: {error}</div>
  }

  return (
    <div className="orders-page">
      <h1>My Orders</h1>

      {successMessage && <div className="success-message">{successMessage}</div>}

      {orders.length === 0 ? (
        <div className="no-orders">
          <p>You haven't placed any orders yet.</p>
          <Link to="/products" className="btn btn-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="orders-container">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div>
                  <h3>Order #{order._id.substring(0, 8)}</h3>
                  <p className="order-date">Placed on {formatDate(order.createdAt)}</p>
                </div>
                <div className="order-status">
                  <span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span>
                </div>
              </div>

              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <div className="item-info">
                      <h4>{item.name}</h4>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: ${item.price.toFixed(2)}</p>
                    </div>
                    <p className="item-total">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              <div className="order-footer">
                <div className="shipping-address">
                  <h4>Shipping Address</h4>
                  <p>{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.address}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </p>
                  <p>{order.shippingAddress.country}</p>
                </div>

                <div className="order-summary">
                  <div className="summary-row">
                    <span>Payment Method</span>
                    <span>{order.paymentMethod}</span>
                  </div>
                  <div className="summary-row total">
                    <span>Total</span>
                    <span>${order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders
