"use client"

import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import ProductCard from "../components/ProductCard"
import "../styles/Products.css"

function Products() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    sort: "newest",
  })

  const location = useLocation()

  useEffect(() => {
    // Extract category from URL query params if present
    const queryParams = new URLSearchParams(location.search)
    const categoryParam = queryParams.get("category")

    if (categoryParam) {
      setFilters((prev) => ({ ...prev, category: categoryParam }))
    }
  }, [location.search])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/categories")
        if (!response.ok) {
          throw new Error("Failed to fetch categories")
        }
        const data = await response.json()
        setCategories(data)
      } catch (err) {
        setError(err.message)
      }
    }

    fetchCategories()
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        // Build query string based on filters
        const queryParams = new URLSearchParams()
        if (filters.category) queryParams.append("category", filters.category)
        if (filters.minPrice) queryParams.append("minPrice", filters.minPrice)
        if (filters.maxPrice) queryParams.append("maxPrice", filters.maxPrice)
        if (filters.sort) queryParams.append("sort", filters.sort)

        const response = await fetch(`http://localhost:5000/api/products?${queryParams.toString()}`)
        if (!response.ok) {
          throw new Error("Failed to fetch products")
        }
        const data = await response.json()
        setProducts(data)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }

    fetchProducts()
  }, [filters])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
  }

  const resetFilters = () => {
    setFilters({
      category: "",
      minPrice: "",
      maxPrice: "",
      sort: "newest",
    })
  }

  if (loading && products.length === 0) {
    return <div className="loading">Loading products...</div>
  }

  if (error) {
    return <div className="error">Error: {error}</div>
  }

  return (
    <div className="products-page">
      <h1>Products</h1>

      <div className="products-container">
        <aside className="filters-sidebar">
          <h2>Filters</h2>

          <div className="filter-group">
            <label htmlFor="category">Category</label>
            <select id="category" name="category" value={filters.category} onChange={handleFilterChange}>
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="minPrice">Min Price</label>
            <input
              type="number"
              id="minPrice"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
              min="0"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="maxPrice">Max Price</label>
            <input
              type="number"
              id="maxPrice"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              min="0"
            />
          </div>

          <div className="filter-group">
            <label htmlFor="sort">Sort By</label>
            <select id="sort" name="sort" value={filters.sort} onChange={handleFilterChange}>
              <option value="newest">Newest</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
              <option value="name-a-z">Name: A to Z</option>
              <option value="name-z-a">Name: Z to A</option>
            </select>
          </div>

          <button className="btn btn-secondary" onClick={resetFilters}>
            Reset Filters
          </button>
        </aside>

        <div className="products-grid">
          {products.length > 0 ? (
            products.map((product) => <ProductCard key={product._id} product={product} />)
          ) : (
            <div className="no-products">
              <p>No products found matching your criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Products
