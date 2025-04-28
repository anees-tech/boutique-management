"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react"
// Import Swiper styles
import "swiper/css"
import "swiper/css/navigation"
import "swiper/css/pagination"
import "swiper/css/autoplay"
// import required modules
import { Navigation, Pagination, Autoplay } from "swiper/modules"

import ProductCard from "../components/ProductCard"
import "../styles/Home.css"
import { dummyProducts, dummyCategories } from "../dummyData" // Import dummy data

// Add styles for the slider
const sliderStyles = `
.hero-slider .swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #ddd; /* Placeholder background */
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px; /* Adjust height as needed */
  color: #fff;
  background-size: cover;
  background-position: center;
}

.hero-slider .swiper-slide img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.hero-slider .slide-content {
    background-color: rgba(0, 0, 0, 0.5);
    padding: 2rem;
    border-radius: 8px;
    max-width: 800px;
    margin: 0 auto;
}

.hero-slider .swiper-button-next,
.hero-slider .swiper-button-prev {
    color: #e91e63; /* Match theme color */
}

.hero-slider .swiper-pagination-bullet-active {
    background-color: #e91e63; /* Match theme color */
}
`

function Home() {
  // Use dummy data directly
  const [featuredProducts, setFeaturedProducts] = useState(dummyProducts.filter((p) => p.featured))
  const [categories, setCategories] = useState(dummyCategories)
  const [loading, setLoading] = useState(false) // Set loading to false initially
  const [error, setError] = useState(null)

  // Placeholder images for the slider - Keep this as it's local config
  const sliderImages = [
    {
      src: "/placeholder.svg?height=600&width=1200&text=Slide+1",
      alt: "Slide 1",
      title: "Welcome to Boutique Fashion",
      text: "Discover the latest trends in fashion and accessories",
    },
    {
      src: "/placeholder.svg?height=600&width=1200&text=Slide+2",
      alt: "Slide 2",
      title: "New Arrivals",
      text: "Check out our newest collection",
    },
    {
      src: "/placeholder.svg?height=600&width=1200&text=Slide+3",
      alt: "Slide 3",
      title: "Seasonal Sale",
      text: "Up to 50% off selected items",
    },
  ]

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  if (error) {
    return <div className="error">Error: {error}</div>
  }

  return (
    <div className="home">
      {/* Inject slider styles */}
      <style>{sliderStyles}</style>

      {/* Replace hero section with Swiper */}
      <section className="hero-slider">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          loop={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
        >
          {sliderImages.map((image, index) => (
            <SwiperSlide key={index} style={{ backgroundImage: `url(${image.src})` }}>
              <div className="slide-content">
                <h1>{image.title}</h1>
                <p>{image.text}</p>
                <Link to="/products" className="btn btn-primary">
                  Shop Now
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
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
                {/* Use category image from dummy data */}
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
