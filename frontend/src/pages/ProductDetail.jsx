"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import "../styles/ProductDetail.css"
import { dummyProducts } from "../dummyData" // Import dummy data

function ProductDetail({ addToCart }) {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true) // Keep loading state for simulation
  const [error, setError] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])

  useEffect(() => {
    setLoading(true)
    setError(null)

    // Simulate fetching data
    const timer = setTimeout(() => {
      try {
        // Find product from dummy data
        const foundProduct = dummyProducts.find((p) => p._id === id)

        if (!foundProduct) {
          throw new Error("Product not found")
        }

        setProduct(foundProduct)

        // Find related products (same category, different ID)
        const foundRelated = dummyProducts
          .filter((p) => p.category === foundProduct.category && p._id !== foundProduct._id)
          .slice(0, 4) // Limit to 4 related products

        setRelatedProducts(foundRelated)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }, 500) // Simulate 500ms network delay

    return () => clearTimeout(timer) // Cleanup timer
  }, [id]) // Re-run when ID changes

  const handleQuantityChange = (e) => {
    const value = Number.parseInt(e.target.value)
    if (value > 0) {
      setQuantity(value)
    }
  }

  const handleAddToCart = () => {
    if (product) {
      // Pass a copy to avoid potential state mutation issues if product object is reused
      addToCart({ ...product, quantity })
    }
  }

  if (loading) {
    return <div className="loading">Loading product details...</div>
  }

  if (error) {
    // Use NotFound component or a specific error message
    return <div className="error">Error: {error}</div>
  }

  // Product should exist if no error and not loading, but check just in case
  if (!product) {
    return <div className="error">Product could not be loaded.</div>
  }

  return (
    <div className="product-detail">
      <div className="breadcrumb">
        <Link to="/">Home</Link> &gt;
        <Link to="/products">Products</Link> &gt;
        {product.category && (
          <>
            <Link to={`/products?category=${product.category}`}>{product.category}</Link> &gt;{" "}
          </>
        )}
        <span>{product.name}</span>
      </div>

      <div className="product-detail-container">
        <div className="product-image-container">
          <img src={product.image || "/placeholder.svg"} alt={product.name} className="product-detail-image" />
        </div>

        <div className="product-info-container">
          <h1 className="product-name">{product.name}</h1>
          <p className="product-price">${product.price.toFixed(2)}</p>
          {product.category && <p className="product-category">Category: {product.category}</p>}

          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          {product.inStock ? <p className="in-stock">In Stock</p> : <p className="out-of-stock">Out of Stock</p>}

          <div className="product-actions">
            <div className="quantity-selector">
              <label htmlFor="quantity">Quantity:</label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={handleQuantityChange}
                min="1"
                disabled={!product.inStock}
              />
            </div>

            <button className="btn btn-primary add-to-cart-btn" onClick={handleAddToCart} disabled={!product.inStock}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="related-products">
          <h2>You May Also Like</h2>
          <div className="related-products-grid">
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct._id} className="related-product-card">
                {/* Ensure related products link correctly */}
                <Link to={`/products/${relatedProduct._id}`}>
                  <img src={relatedProduct.image || "/placeholder.svg"} alt={relatedProduct.name} />
                  <h3>{relatedProduct.name}</h3>
                  <p>${relatedProduct.price.toFixed(2)}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetail
