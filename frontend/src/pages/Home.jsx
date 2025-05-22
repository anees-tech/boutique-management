"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import ProductCard from "../components/ProductCard"
import "../styles/Home.css"
import api from "../api"

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Fetch featured products
        const productsData = await api.products.getFeaturedProducts()
        setFeaturedProducts(productsData)

        // Fetch categories
        const categoriesData = await api.categories.getCategories()
        setCategories(categoriesData)

        setLoading(false)
      } catch (err) {
        setError(err.message || "Failed to fetch data")
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  if (error) {
    return <div className="error">Error: {error}</div>
  }

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Boutique Fashion</h1>
          <p>Discover the latest trends in fashion and accessories</p>
          <Link to="/products" className="btn btn-primary">
            Shop Now
          </Link>
        </div>
      </section>

      <section className="featured-products">
        <h2>Featured Products</h2>
        <div className="products-grid">
          {featuredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
        <div className="view-all">
          <Link to="/products" className="btn btn-secondary">
            View All Products
          </Link>
        </div>
      </section>

      <section className="categories">
        <h2>Shop by Category</h2>
        <div className="categories-grid">
          {categories.map((category) => (
            <Link to={`/products?category=${category.name}`} className="category-card" key={category._id}>
              <div className="category-image">
                <img src={category.image || "/placeholder.svg"} alt={category.name} />
              </div>
              <h3>{category.name}</h3>
            </Link>
          ))}
        </div>
      </section>

      <section className="about-section">
        <h2>About Boutique Fashion</h2>
        <p>
          Boutique Fashion is your one-stop destination for trendy and stylish clothing and accessories. We curate the
          best fashion items to help you express your unique style and personality. With a focus on quality and
          affordability, we strive to provide an exceptional shopping experience.
        </p>
      </section>
    </div>
  )
}

export default Home
