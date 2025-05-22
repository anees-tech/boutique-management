"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import AdminLayout from "../../components/AdminLayout"
import "../../styles/admin/OrderDetail.css"
import api from "../../api"

function AdminOrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [newStatus, setNewStatus] = useState("")

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true)
        const data = await api.orders.getOrderById(id)
        setOrder(data)
        setNewStatus(data.status)
        setLoading(false)
      } catch (err) {
        setError(err.message || "Failed to fetch order details")
        setLoading(false)
      }
    }

    fetchOrder()
  }, [id])

  const handleStatusChange = (e) => {
    setNewStatus(e.target.value)
  }

  const updateOrderStatus = async () => {
    if (newStatus === order.status) return

    try {
      setUpdatingStatus(true)
      await api.orders.updateOrderStatus(id, { status: newStatus })

      // Update local state
      setOrder({ ...order, status: newStatus })
      setUpdatingStatus(false)
    } catch (err) {
      setError(err.message || "Failed to update order status")
      setUpdatingStatus(false)
    }
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  if (loading) {
    return (
      <AdminLayout title="Order Details">
        <div className="loading">Loading order details...</div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout title="Order Details">
        <div className="error">Error: {error}</div>
      </AdminLayout>
    )
  }

  if (!order) {
    return (
      <AdminLayout title="Order Details">
        <div className="error">Order not found</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title={`Order #${order._id.substring(0, 8)}`}>
      <div className="order-detail">
        <div className="order-header">
          <div className="order-meta">
            <p>
              <strong>Date:</strong> {formatDate(order.createdAt)}
            </p>
            <p>
              <strong>Customer:</strong> {order.shippingAddress.fullName}
            </p>
            <p>
              <strong>Email:</strong> {order.shippingAddress.email || "N/A"}
            </p>
          </div>

          <div className="order-status-update">
            <div className="status-select">
              <label htmlFor="status">Status:</label>
              <select id="status" value={newStatus} onChange={handleStatusChange}>
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <button
              className="btn btn-primary"
              onClick={updateOrderStatus}
              disabled={updatingStatus || newStatus === order.status}
            >
              {updatingStatus ? "Updating..." : "Update Status"}
            </button>
          </div>
        </div>

        <div className="order-sections">
          <div className="order-section">
            <h3>Items</h3>
            <div className="table-container">
              <table className="admin-table items-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.name}</td>
                      <td>${item.price.toFixed(2)}</td>
                      <td>{item.quantity}</td>
                      <td>${(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="total-label">
                      Total
                    </td>
                    <td className="total-value">${order.totalAmount.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="order-info-grid">
            <div className="order-section">
              <h3>Shipping Address</h3>
              <div className="address-info">
                <p>{order.shippingAddress.fullName}</p>
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            </div>

            <div className="order-section">
              <h3>Payment Information</h3>
              <div className="payment-info">
                <p>
                  <strong>Method:</strong> {order.paymentMethod}
                </p>
                <p>
                  <strong>Status:</strong> Paid
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="order-actions">
          <button className="btn btn-secondary" onClick={() => navigate("/admin/orders")}>
            Back to Orders
          </button>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminOrderDetail
