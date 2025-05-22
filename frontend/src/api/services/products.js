import api from "../axios"

export const productService = {
  // Get all products with optional filtering
  getProducts: async (params = {}) => {
    try {
      return await api.get("/products", { params })
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Get featured products
  getFeaturedProducts: async () => {
    try {
      return await api.get("/products/featured")
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Get related products
  getRelatedProducts: async (productId) => {
    try {
      return await api.get(`/products/related/${productId}`)
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Get product by ID
  getProductById: async (productId) => {
    try {
      return await api.get(`/products/${productId}`)
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Admin: Create product
  createProduct: async (productData) => {
    try {
      return await api.post("/products", productData)
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Admin: Update product
  updateProduct: async (productId, productData) => {
    try {
      return await api.put(`/products/${productId}`, productData)
    } catch (error) {
      throw error.response?.data || error
    }
  },

  // Admin: Delete product
  deleteProduct: async (productId) => {
    try {
      return await api.delete(`/products/${productId}`)
    } catch (error) {
      throw error.response?.data || error
    }
  },
}
