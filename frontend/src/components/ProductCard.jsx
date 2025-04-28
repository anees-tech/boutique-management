import { Link } from "react-router-dom"
import "../styles/ProductCard.css"

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <Link to={`/products/${product._id}`}>
        <div className="product-image">
          <img src={product.image || "/placeholder.svg"} alt={product.name} />
        </div>
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <p className="product-price">${product.price.toFixed(2)}</p>
          <p className="product-category">{product.category}</p>
        </div>
      </Link>
    </div>
  )
}

export default ProductCard
