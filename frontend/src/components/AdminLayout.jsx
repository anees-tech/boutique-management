import AdminSidebar from "./AdminSidebar"
import "../styles/AdminLayout.css"

function AdminLayout({ children, title }) {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-content">
        <div className="admin-header">
          <h1>{title}</h1>
        </div>
        <div className="admin-main">{children}</div>
      </div>
    </div>
  )
}

export default AdminLayout
