import { NavLink } from "react-router-dom"
import "../styles/AdminSidebar.css"

function AdminSidebar() {
  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <h2>Admin Panel</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/admin" end className={({ isActive }) => (isActive ? "active" : "")}>
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/products" className={({ isActive }) => (isActive ? "active" : "")}>
              Products
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/orders" className={({ isActive }) => (isActive ? "active" : "")}>
              Orders
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/users" className={({ isActive }) => (isActive ? "active" : "")}>
              Users
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default AdminSidebar
