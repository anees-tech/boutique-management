"use client"

import { useState, useEffect } from "react"
import AdminLayout from "../../components/AdminLayout"
import "../../styles/admin/Users.css"
import api from "../../api"

function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [confirmDelete, setConfirmDelete] = useState(null)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const data = await api.users.getAllUsers()
        setUsers(data)
        setLoading(false)
      } catch (err) {
        setError(err.message || "Failed to fetch users")
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleDeleteClick = (userId) => {
    setConfirmDelete(userId)
  }

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return

    try {
      await api.users.deleteUser(confirmDelete)

      // Update users list after deletion
      setUsers(users.filter((user) => user._id !== confirmDelete))
      setConfirmDelete(null)
    } catch (err) {
      setError(err.message || "Failed to delete user")
    }
  }

  const handleDeleteCancel = () => {
    setConfirmDelete(null)
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return (
      <AdminLayout title="Users">
        <div className="loading">Loading users...</div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout title="Users">
        <div className="error">Error: {error}</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Users">
      <div className="admin-users">
        <div className="filters-bar">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>

        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role-badge ${user.role}`}>{user.role}</span>
                    </td>
                    <td>{formatDate(user.createdAt)}</td>
                    <td>
                      <button
                        onClick={() => handleDeleteClick(user._id)}
                        className="action-link delete"
                        disabled={user.role === "admin"}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-data">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {confirmDelete && (
          <div className="delete-modal">
            <div className="delete-modal-content">
              <h3>Confirm Delete</h3>
              <p>Are you sure you want to delete this user? This action cannot be undone.</p>
              <div className="delete-modal-actions">
                <button onClick={handleDeleteCancel} className="btn btn-secondary">
                  Cancel
                </button>
                <button onClick={handleDeleteConfirm} className="btn btn-danger">
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

export default AdminUsers
