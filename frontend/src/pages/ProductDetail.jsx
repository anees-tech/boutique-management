"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import "../styles/ProductDetail.css"
import api from "../api"

function ProductDetail({ addToCart }) {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true)
      try {
        const data = await api.products.getProductById(id)
        setProduct(data)

        // Fetch related products
        const relatedData = await api.products.getRelatedProducts(id)
        setRelatedProducts(relatedData)

        setLoading(false)
      } catch (err) {
        setError(err.message || "Failed to fetch product")
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleQuantityChange = (e) => {
    const value = Number.parseInt(e.target.value)
    if (value > 0) {
      setQuantity(value)
    }
  }

  const handleAddToCart = () => {
    if (product) {
      addToCart({ ...product, quantity })
    }
  }

  if (loading) {
    return <div className="loading">Loading product details...</div>
  }

  if (error) {
    return <div className="error">Error: {error}</div>
  }

  if (!product) {
    return <div className="error">Product not found</div>
  }

  return (
    <div className="product-detail">
      <div className="breadcrumb">
        <Link to="/">Home</Link> &gt;
        <Link to="/products">Products</Link> &gt;
        <span>{product.name}</span>
      </div>

      <div className="product-detail-container">
        <div className="product-image-container">
          <img src={product.image || "/placeholder.svg"} alt={product.name} className="product-detail-image" />
        </div>

        <div className="product-info-container">
          <h1 className="product-name">{product.name}</h1>
          <p className="product-price">${product.price.toFixed(2)}</p>
          <p className="product-category">Category: {product.category}</p>

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
