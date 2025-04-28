"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "../styles/Profile.css"

function Profile({ user }) {
  // Initialize directly from the user prop
  const [profile, setProfile] = useState(user)
  const [formData, setFormData] = useState({
    name: user?.name || "", // Add null checks
    email: user?.email || "", // Add null checks
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [activeTab, setActiveTab] = useState("profile")

  // Update form if user prop changes (e.g., after login)
  useEffect(() => {
    if (user) {
      setProfile(user)
      setFormData((prev) => ({
        ...prev,
        name: user.name,
        email: user.email,
        // Reset password fields when user context changes
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }))
    }
  }, [user])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleProfileUpdate = async (e) => {
    e.preventDefault()
    if (!user) return setError("User not found") // Guard clause
    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch(`http://localhost:5000/api/users/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update profile")
      }

      const updatedUser = await response.json()
      setProfile(updatedUser) // Update local profile state

      // Update localStorage if needed (App.jsx might handle this better via login prop)
      const storedUser = JSON.parse(localStorage.getItem("user"))
      if (storedUser) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...storedUser, // Keep token/other info if stored
            name: updatedUser.name,
            email: updatedUser.email,
          }),
        )
      }

      setSuccess("Profile updated successfully")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async (e) => {
    e.preventDefault()
    if (!user) return setError("User not found") // Guard clause
    setLoading(true)
    setError(null)
    setSuccess(null)

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New passwords do not match")
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`http://localhost:5000/api/users/${user._id}/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to change password")
      }

      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }))

      setSuccess("Password changed successfully")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Handle case where user data is not available yet
  if (!user) {
    return <div className="loading">Loading profile...</div> // Or redirect to login
  }

  return (
    <div className="profile-page">
      <h1>My Account</h1>

      <div className="profile-container">
        <div className="profile-tabs">
          <button className={activeTab === "profile" ? "active" : ""} onClick={() => setActiveTab("profile")}>
            Profile Information
          </button>
          <button className={activeTab === "password" ? "active" : ""} onClick={() => setActiveTab("password")}>
            Change Password
          </button>
          <Link to="/orders" className="tab-link">
            My Orders
          </Link>
        </div>

        <div className="profile-content">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          {activeTab === "profile" && (
            <form className="profile-form" onSubmit={handleProfileUpdate}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required />
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

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </form>
          )}

          {activeTab === "password" && (
            <form className="password-form" onSubmit={handlePasswordChange}>
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  required
                  minLength="6"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  minLength="6"
                />
              </div>

              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? "Changing..." : "Change Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
