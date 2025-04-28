"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import "../styles/Navbar.css"

function Navbar({ user, logout, cartItemCount }) {
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Boutique Fashion
        </Link>

        <div className="menu-icon" onClick={toggleMenu}>
          <span className={menuOpen ? "menu-icon-bar open" : "menu-icon-bar"}></span>
          <span className={menuOpen ? "menu-icon-bar open" : "menu-icon-bar"}></span>
          <span className={menuOpen ? "menu-icon-bar open" : "menu-icon-bar"}></span>
        </div>

        <ul className={menuOpen ? "nav-menu active" : "nav-menu"}>
          <li className="nav-item">
            <Link to="/" className="nav-link" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/products" className="nav-link" onClick={() => setMenuOpen(false)}>
              Products
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/support" className="nav-link" onClick={() => setMenuOpen(false)}>
              Support
            </Link>
          </li>
          {user ? (
            <>
              <li className="nav-item">
                <Link to="/profile" className="nav-link" onClick={() => setMenuOpen(false)}>
                  Profile
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/orders" className="nav-link" onClick={() => setMenuOpen(false)}>
                  Orders
                </Link>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link logout-btn"
                  onClick={() => {
                    logout()
                    setMenuOpen(false)
                  }}
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link" onClick={() => setMenuOpen(false)}>
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>

        <div className="cart-icon">
          <Link to="/cart">
            <span className="material-icons">shopping_cart</span>
            {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
