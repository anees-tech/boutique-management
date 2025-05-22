"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import AdminLayout from "../../components/AdminLayout"
import "../../styles/admin/Products.css"
import api from "../../api"

function AdminProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [categories, setCategories] = useState([])
  const [confirmDelete, setConfirmDelete] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch products
        const productsData = await api.products.getProducts()
        setProducts(productsData)

        // Fetch categories for filtering
        const categoriesData = await api.categories.getCategories()
        setCategories(categoriesData)

        setLoading(false)
      } catch (err) {
        setError(err.message || "Failed to fetch products")
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value)
  }

  const handleDeleteClick = (productId) => {
    setConfirmDelete(productId)
  }

  const handleDeleteConfirm = async () => {
    if (!confirmDelete) return

    try {
      await api.products.deleteProduct(confirmDelete)

      // Update products list after deletion
      setProducts(products.filter((product) => product._id !== confirmDelete))
      setConfirmDelete(null)
    } catch (err) {
      setError(err.message || "Failed to delete product")
    }
  }

  const handleDeleteCancel = () => {
    setConfirmDelete(null)
  }

  // Filter products based on search term and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "" || product.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <AdminLayout title="Products">
        <div className="loading">Loading products...</div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout title="Products">
        <div className="error">Error: {error}</div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout title="Products">
      <div className="admin-products">
        <div className="actions-bar">
          <div className="filters">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
            />

            <select value={categoryFilter} onChange={handleCategoryChange} className="category-filter">
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <Link to="/admin/products/new" className="btn btn-primary">
            Add New Product
          </Link>
        </div>

        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <img src={product.image || "/placeholder.svg"} alt={product.name} className="product-thumbnail" />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>{product.inStock ? "In Stock" : "Out of Stock"}</td>
                    <td>{product.featured ? "Yes" : "No"}</td>
                    <td className="actions-cell">
                      <Link to={`/admin/products/edit/${product._id}`} className="action-link edit">
                        Edit
                      </Link>
                      <button onClick={() => handleDeleteClick(product._id)} className="action-link delete">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-data">
                    No products found
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
              <p>Are you sure you want to delete this product? This action cannot be undone.</p>
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

export default AdminProducts
