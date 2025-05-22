"use client"

import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import "./styles/App.css"

// Pages
import Home from "./pages/Home"
import Products from "./pages/Products"
import ProductDetail from "./pages/ProductDetail"
import Cart from "./pages/Cart"
import Checkout from "./pages/Checkout"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Profile from "./pages/Profile"
import Orders from "./pages/Orders"
import Support from "./pages/Support"
import NotFound from "./pages/NotFound"

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard"
import AdminProducts from "./pages/admin/Products"
import AdminProductForm from "./pages/admin/ProductForm"
import AdminOrders from "./pages/admin/Orders"
import AdminOrderDetail from "./pages/admin/OrderDetail"
import AdminUsers from "./pages/admin/Users"

// Components
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import AdminRoute from "./components/AdminRoute"

function App() {
  const [user, setUser] = useState(null)
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in via localStorage
    const loggedInUser = localStorage.getItem("user")
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser))
    }

    // Load cart from localStorage
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }

    setLoading(false)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])

  const login = (userData) => {
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item._id === product._id)

    if (existingItem) {
      setCart(cart.map((item) => (item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item._id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCart(cart.map((item) => (item._id === productId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setCart([])
  }

  if (loading) {
    return <div className="loading-screen">Loading...</div>
  }

  return (
    <BrowserRouter>
      <div className="app">
        <Navbar user={user} logout={logout} cartItemCount={cart.reduce((total, item) => total + item.quantity, 0)} />
        <main className="main-content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail addToCart={addToCart} />} />
            <Route
              path="/cart"
              element={<Cart cart={cart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />}
            />
            <Route
              path="/checkout"
              element={user ? <Checkout cart={cart} clearCart={clearCart} user={user} /> : <Navigate to="/login" />}
            />
            <Route path="/login" element={<Login login={login} />} />
            <Route path="/register" element={<Register login={login} />} />
            <Route path="/profile" element={user ? <Profile user={user} /> : <Navigate to="/login" />} />
            <Route path="/orders" element={user ? <Orders user={user} /> : <Navigate to="/login" />} />
            <Route path="/support" element={<Support user={user} />} />

            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute user={user}>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/products"
              element={
                <AdminRoute user={user}>
                  <AdminProducts />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/products/new"
              element={
                <AdminRoute user={user}>
                  <AdminProductForm />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/products/edit/:id"
              element={
                <AdminRoute user={user}>
                  <AdminProductForm />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <AdminRoute user={user}>
                  <AdminOrders />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/orders/:id"
              element={
                <AdminRoute user={user}>
                  <AdminOrderDetail />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute user={user}>
                  <AdminUsers />
                </AdminRoute>
              }
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
