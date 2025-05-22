import api from "../axios"

export const orderService = {
  // Create a new order
  createOrder: async (orderData) => {
    try {
      return await api.post("/orders", orderData)
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Get orders by user ID
  getOrdersByUser: async (userId) => {
    try {
      return await api.get(`/orders/user/${userId}`)
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Get order by ID
  getOrderById: async (orderId) => {
    try {
      return await api.get(`/orders/${orderId}`)
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Admin: Get all orders
  getAllOrders: async () => {
    try {
      return await api.get("/orders")
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Admin: Update order status
  updateOrderStatus: async (orderId, statusData) => {
    try {
      return await api.put(`/orders/${orderId}/status`, statusData)
    } catch (error) {
      throw error.response?.data || error
    }
  },
}
