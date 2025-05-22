"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import AdminLayout from "../../components/AdminLayout"
import "../../styles/admin/Orders.css"
import api from "../../api"

function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statusFilter, setStatusFilter] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true)
        const data = await api.orders.getAllOrders()
        setOrders(data)
        setLoading(false)
      } catch (err) {
        setError(err.message || "Failed to fetch orders")
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value)
  }

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Filter orders based on status and search term
  const filteredOrders = orders.filter((order) => {
    const matchesStatus = statusFilter === "" || order.status === statusFilter
    const matchesSearch =
      searchTerm === "" ||
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shippingAddress.fullName.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesStatus && matchesSearch
  })

  if (loading) {
    return (
      <AdminLayout title="Orders">
        <div className="loading">Loading orders...</div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout title="Orders">
        <div className="error">Error: {error}</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Orders">
      <div className="admin-orders">
        <div className="filters-bar">
          <input
            type="text"
            placeholder="Search by order ID or customer name..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />

          <select value={statusFilter} onChange={handleStatusChange} className="status-filter">
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Status</th>
                <th>Items</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order._id}>
                    <td>#{order._id.substring(0, 8)}</td>
                    <td>{order.shippingAddress.fullName}</td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>
                      <span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span>
                    </td>
                    <td>{order.items.length}</td>
                    <td>${order.totalAmount.toFixed(2)}</td>
                    <td>
                      <Link to={`/admin/orders/${order._id}`} className="action-link">
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-data">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminOrders
