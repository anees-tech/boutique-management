import api from "../axios"

export const supportService = {
  // Create a new support ticket
  createSupportTicket: async (ticketData) => {
    try {
      return await api.post("/support", ticketData)
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Admin: Get all support tickets
  getAllSupportTickets: async () => {
    try {
      return await api.get("/support")
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Admin: Update support ticket status
  updateSupportTicketStatus: async (ticketId, statusData) => {
    try {
      return await api.put(`/support/${ticketId}/status`, statusData)
    } catch (error) {
      throw error.response?.data || error
    }
  },
}
