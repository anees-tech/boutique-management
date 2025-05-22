import api from "../axios"

export const authService = {
  // Register a new user
  register: async (userData) => {
    try {
      return await api.post("/auth/register", userData)
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      return await api.post("/auth/login", credentials)
    } catch (error) {
      throw error.response?.data || error
    }
  },
}
