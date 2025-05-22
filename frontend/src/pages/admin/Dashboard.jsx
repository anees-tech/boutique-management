"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import AdminLayout from "../../components/AdminLayout"
import "../../styles/admin/Dashboard.css"
import api from "../../api"

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    pendingOrders: 0,
    revenue: 0,
  })
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // Fetch products count
        const products = await api.products.getProducts()

        // Fetch all orders
        const orders = await api.orders.getAllOrders()

        // Fetch users
        const users = await api.users.getAllUsers()

        // Calculate stats
        const pendingOrders = orders.filter((order) => order.status === "Pending").length
        const revenue = orders.reduce((total, order) => total + order.totalAmount, 0)

        setStats({
          totalProducts: products.length,
          totalOrders: orders.length,
          totalUsers: users.length,
          pendingOrders,
          revenue,
        })

        // Get recent orders (last 5)
        setRecentOrders(orders.slice(0, 5))

        setLoading(false)
      } catch (err) {
        setError(err.message || "Failed to fetch dashboard data")
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  if (loading) {
    return (
      <AdminLayout title="Dashboard">
        <div className="loading">Loading dashboard data...</div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout title="Dashboard">
        <div className="error">Error: {error}</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Dashboard">
      <div className="admin-dashboard">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Products</h3>
            <p className="stat-value">{stats.totalProducts}</p>
            <Link to="/admin/products" className="stat-link">
              View Products
            </Link>
          </div>

          <div className="stat-card">
            <h3>Total Orders</h3>
            <p className="stat-value">{stats.totalOrders}</p>
            <Link to="/admin/orders" className="stat-link">
              View Orders
            </Link>
          </div>

          <div className="stat-card">
            <h3>Total Users</h3>
            <p className="stat-value">{stats.totalUsers}</p>
            <Link to="/admin/users" className="stat-link">
              View Users
            </Link>
          </div>

          <div className="stat-card">
            <h3>Pending Orders</h3>
            <p className="stat-value">{stats.pendingOrders}</p>
            <Link to="/admin/orders?status=Pending" className="stat-link">
              View Pending Orders
            </Link>
          </div>

          <div className="stat-card">
            <h3>Total Revenue</h3>
            <p className="stat-value">${stats.revenue.toFixed(2)}</p>
          </div>
        </div>

        <div className="recent-orders">
          <div className="section-header">
            <h2>Recent Orders</h2>
            <Link to="/admin/orders" className="view-all-link">
              View All
            </Link>
          </div>

          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order._id}>
                      <td>#{order._id.substring(0, 8)}</td>
                      <td>{order.shippingAddress.fullName}</td>
                      <td>{formatDate(order.createdAt)}</td>
                      <td>
                        <span className={`status-badge ${order.status.toLowerCase()}`}>{order.status}</span>
                      </td>
                      <td>${order.totalAmount.toFixed(2)}</td>
                      <td>
                        <Link to={`/admin/orders/${order._id}`} className="action-link">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default AdminDashboard
