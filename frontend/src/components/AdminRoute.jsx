import { Navigate } from "react-router-dom"

function AdminRoute({ user, children }) {
  // Check if user is logged in and has admin role
  if (!user || user.role !== "admin") {
    return <Navigate to="/login" replace />
  }

  return children
}

export default AdminRoute
