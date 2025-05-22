import api from "../axios"

export const categoryService = {
  // Get all categories
  getCategories: async () => {
    try {
      return await api.get("/categories")
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Admin: Create category
  createCategory: async (categoryData) => {
    try {
      return await api.post("/categories", categoryData)
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Admin: Update category
  updateCategory: async (categoryId, categoryData) => {
    try {
      return await api.put(`/categories/${categoryId}`, categoryData)
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Admin: Delete category
  deleteCategory: async (categoryId) => {
    try {
      return await api.delete(`/categories/${categoryId}`)
    } catch (error) {
      throw error.response?.data || error
    }
  },
}
