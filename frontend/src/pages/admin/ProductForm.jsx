"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import AdminLayout from "../../components/AdminLayout"
import "../../styles/admin/ProductForm.css"
import api from "../../api"

function AdminProductForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditMode = !!id

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    inStock: true,
    featured: false,
  })
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.categories.getCategories()
        setCategories(data)
      } catch (err) {
        setError(err.message || "Failed to fetch categories")
      }
    }

    fetchCategories()

    // If in edit mode, fetch the product data
    if (isEditMode) {
      const fetchProduct = async () => {
        try {
          setLoading(true)
          const data = await api.products.getProductById(id)
          setFormData({
            name: data.name,
            description: data.description,
            price: data.price.toString(),
            image: data.image,
            category: data.category,
            inStock: data.inStock,
            featured: data.featured,
          })
          setLoading(false)
        } catch (err) {
          setError(err.message || "Failed to fetch product")
          setLoading(false)
        }
      }

      fetchProduct()
    }
  }, [id, isEditMode])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const productData = {
        ...formData,
        price: Number.parseFloat(formData.price),
      }

      if (isEditMode) {
        await api.products.updateProduct(id, productData)
      } else {
        await api.products.createProduct(productData)
      }

      setSuccess(true)

      // Redirect after a short delay
      setTimeout(() => {
        navigate("/admin/products")
      }, 1500)
    } catch (err) {
      setError(err.message || `Failed to ${isEditMode ? "update" : "create"} product`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminLayout title={isEditMode ? "Edit Product" : "Add New Product"}>
      <div className="product-form-container">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">Product successfully {isEditMode ? "updated" : "created"}!</div>}

        <form className="product-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Product Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="5"
              required
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price ($)</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select id="category" name="category" value={formData.category} onChange={handleInputChange} required>
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="image">Image URL</label>
            <input type="text" id="image" name="image" value={formData.image} onChange={handleInputChange} required />
          </div>

          <div className="form-row checkbox-row">
            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="inStock"
                name="inStock"
                checked={formData.inStock}
                onChange={handleInputChange}
              />
              <label htmlFor="inStock">In Stock</label>
            </div>

            <div className="form-group checkbox-group">
              <input
                type="checkbox"
                id="featured"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
              />
              <label htmlFor="featured">Featured Product</label>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => navigate("/admin/products")}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Saving..." : isEditMode ? "Update Product" : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}

export default AdminProductForm
