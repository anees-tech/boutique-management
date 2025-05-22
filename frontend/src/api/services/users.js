import api from "../axios"

export const userService = {
  // Get user by ID
  getUserById: async (userId) => {
    try {
      return await api.get(`/users/${userId}`)
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Update user
  updateUser: async (userId, userData) => {
    try {
      return await api.put(`/users/${userId}`, userData)
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Change password
  changePassword: async (userId, passwordData) => {
    try {
      return await api.put(`/users/${userId}/password`, passwordData)
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Admin: Get all users
  getAllUsers: async () => {
    try {
      return await api.get("/users")
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Admin: Delete user
  deleteUser: async (userId) => {
    try {
      return await api.delete(`/users/${userId}`)
    } catch (error) {
      throw error.response?.data || error
    }
  },
}
