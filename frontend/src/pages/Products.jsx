"use client"

import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import ProductCard from "../components/ProductCard"
import "../styles/Products.css"
import { dummyProducts, dummyCategories } from "../dummyData" // Import dummy data

function Products() {
  const [allProducts] = useState(dummyProducts) // Store original dummy products
  const [filteredProducts, setFilteredProducts] = useState(dummyProducts) // State for filtered products
  const [categories] = useState(dummyCategories) // Use dummy categories
  const [loading, setLoading] = useState(false) // Set loading to false initially
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    category: "",
    minPrice: "",
    maxPrice: "",
    sort: "newest",
  })

  const location = useLocation()

  // Apply category filter from URL on initial load
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search)
    const categoryParam = queryParams.get("category")

    if (categoryParam) {
      setFilters((prev) => ({ ...prev, category: categoryParam }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]) // Run only when search params change

  // Apply filters and sorting whenever filters or allProducts change
  useEffect(() => {
    setLoading(true) // Simulate loading briefly
    let tempProducts = [...allProducts]

    // Apply category filter
    if (filters.category) {
      tempProducts = tempProducts.filter((p) => p.category === filters.category)
    }

    // Apply price filters
    if (filters.minPrice) {
      tempProducts = tempProducts.filter((p) => p.price >= Number(filters.minPrice))
    }
    if (filters.maxPrice) {
      tempProducts = tempProducts.filter((p) => p.price <= Number(filters.maxPrice))
    }

    // Apply sorting
    switch (filters.sort) {
      case "price-low-high":
        tempProducts.sort((a, b) => a.price - b.price)
        break
      case "price-high-low":
        tempProducts.sort((a, b) => b.price - a.price)
        break
      case "name-a-z":
        tempProducts.sort((a, b) => a.name.localeCompare(b.name))
        break
      case "name-z-a":
        tempProducts.sort((a, b) => b.name.localeCompare(a.name))
        break
      default: // newest
        tempProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }

    // Simulate network delay
    const timer = setTimeout(() => {
      setFilteredProducts(tempProducts)
      setLoading(false)
    }, 300) // 300ms delay

    return () => clearTimeout(timer) // Cleanup timer on unmount or filter change
  }, [filters, allProducts])

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
              placeholder="e.g., 10"
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
              placeholder="e.g., 100"
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
          {loading ? (
            <div className="loading" style={{ gridColumn: "1 / -1" }}>
              Applying filters...
            </div>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => <ProductCard key={product._id} product={product} />)
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
